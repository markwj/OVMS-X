import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './root';
import { STANDARD_METRICS } from '@/components/vehicle/standardMetrics';
import { MetricDefined, Metric, MetricType } from '@/components/vehicle/metrics';


export interface Metrics {
  metricsList: {}
}

const initialMetricsState: Metrics = {
  metricsList: {}
}

export const metricsSlice = createSlice({
  name: 'metrics',
  initialState: initialMetricsState,
  reducers: {
    resetToStandardMetrics: (state: Metrics) => {
      metricsSlice.actions.deleteAll()
      STANDARD_METRICS.forEach((metric) => {
        (state.metricsList as any)[metric.key] = JSON.stringify(new Metric({ ...metric, standard: true }));
      })
    },
    deleteAll: (state: Metrics) => {
      state.metricsList = {};
    },
    deleteOne: (state: Metrics, key: PayloadAction<string>) => {
      if (!Object.keys(state.metricsList).includes(key.payload)) { return; }
      delete (state.metricsList as any)[key.payload];
    },
    clearAll: (state: Metrics) => {
      for (const key of Object.keys(state.metricsList)) {
        const metric = JSON.parse((state.metricsList as any)[key] as string);
        metric.value = null;
        metric.defined = MetricDefined.NEVER;
        metric.lastModified = null;
        (state.metricsList as any)[key] = JSON.stringify(metric);
      }
    },
    clearOne: (state: Metrics, key: PayloadAction<string>) => {
      if (!Object.keys(state.metricsList).includes(key.payload)) { return; }
      const metric = JSON.parse((state.metricsList as any)[key.payload] as string);
      metric.value = null;
      metric.defined = MetricDefined.NEVER;
      metric.lastModified = null;
      (state.metricsList as any)[key.payload] = JSON.stringify(metric);
    },
    createMetric: (state: Metrics, payload: PayloadAction<any>) => {
      const params = payload.payload;
      (state.metricsList as any)[params.key] = JSON.stringify(new Metric(params));
    },
    setMetric: (state: Metrics, payload: PayloadAction<{ key: string, value: string, currentTime: string }>) => { //Need to pass the current time to maintain purity
      const params = payload.payload;
      if (!Object.keys(state.metricsList).includes(params.key)) { return; }
      const metric = JSON.parse((state.metricsList as any)[params.key]);

      switch (metric.type) {
        case MetricType.BOOL:
          if ([1, "yes", metric.trueStatement].includes(params.value)) {
            metric.value = "yes"
          } else {
            metric.value = "no"
          }
          break
        case MetricType.NUMBER:
          let v = +params.value;
          if (isNaN(v)) { metric.value = "NaN"; break; }
          if (metric.precision != null) { v = +v.toFixed(metric.precision); }
          metric.value = v
          break
        default:
          metric.value = params.value
      }

      metric.defined = metric.defined != MetricDefined.NEVER ? MetricDefined.DEFINED : MetricDefined.FIRST
      metric.lastModified = params.currentTime;
      (state.metricsList as any)[params.key] = JSON.stringify(metric);
    }
  }
})

export const getMetricsListSelector = (state: RootState) => state.metrics.metricsList;
export const metricsAllKeysSelector = createSelector(getMetricsListSelector, (metricsList) => Object.keys(metricsList))
export const metricsAllSerialisedValuesSelector = createSelector(getMetricsListSelector, (metricsList) => Object.values(metricsList))
export const metricsAllValuesSelector = createSelector(metricsAllSerialisedValuesSelector, (metricsList) => metricsList.map((stringMetric) => JSON.parse(stringMetric as string)))


export const generateGetMetricSelector = (key: string) => {
  return createSelector(getMetricsListSelector, (metricsList) => JSON.parse((metricsList as any)[key]))
}

export const generateGetMetricValueSelector = (key: string) => {
  return createSelector(generateGetMetricSelector(key), (metric) => metric.value)
}

export const generateGetMetricUnitSelector = (key: string) => {
  return createSelector(generateGetMetricSelector(key), (metric) => metric.unit)
}

export const generateMetricIsStaleSelector = (key: string, currentTime: string) => {
  return createSelector(generateGetMetricSelector(key), (metric) => (new Date(metric.lastModified).getTime() / 1000 + metric.staleSeconds) < new Date(currentTime).getTime() / 1000)
}

export const generateMetricIsDefinedSelector = (key: string) => {
  return createSelector(generateGetMetricSelector(key), (metric) => metric.defined)
}

export const generateGetMetricLastModifiedSelector = (key: string) => {
  return createSelector(generateGetMetricSelector(key), (metric) => metric.lastModified)
}

export const { deleteAll, deleteOne, clearAll, clearOne, createMetric, resetToStandardMetrics } = metricsSlice.actions;
export default metricsSlice.reducer;
