import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './root';
import { STANDARD_METRICS } from '@/components/vehicle/standardMetrics';
import { MetricDefined, Metric, MetricType } from '@/components/vehicle/metrics';
import { GetUnitAbbr, numericalUnitConvertor } from '@/components/utils/numericalUnitConverter';
import { GetCurrentUTCTimeStamp } from '@/components/utils/datetime';

export interface Metrics {
  metricsList: {}
  hasStandardMetrics: boolean
}

const initialMetricsState: Metrics = {
  metricsList: {},
  hasStandardMetrics: false
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
      state.hasStandardMetrics = true
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
    setMetric: (state: Metrics, payload: PayloadAction<{ key: string, value: string, currentTime?: string, unit?: string, stale?: boolean | null }>) => { //Need to pass the current time to maintain purity
      const params = payload.payload;
      if (!Object.keys(state.metricsList).includes(params.key)) { return; }
      const metric = JSON.parse((state.metricsList as any)[params.key]);

      metric.explicitlyStale = params.stale ?? null

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

          if (params.unit && metric.unit && GetUnitAbbr(params.unit) != GetUnitAbbr(metric.unit)) {
            try {
              v = numericalUnitConvertor(v).from(GetUnitAbbr(params.unit)).to(GetUnitAbbr(metric.unit))
              console.log(`[metricsSlice] Converted ${params.key} from ${params.value} ${params.unit} to ${v} ${metric.unit}`)
            } catch (error) {
              console.error(`[metricsSlice] Error converting ${params.key} from ${params.value} ${params.unit} to ${v} ${metric.unit}`, error)
            }
          }

          if (metric.precision != null) {
            console.log(`[metricsSlice] Set precision of ${v} to ${metric.precision} d.p. of ${+v.toFixed(metric.precision)}`)
            v = +v.toFixed(metric.precision);
          }
          metric.value = v
          break
        default:
          metric.value = params.value
      }

      metric.defined = metric.defined != MetricDefined.NEVER ? MetricDefined.DEFINED : MetricDefined.FIRST
      metric.lastModified = params.currentTime ?? GetCurrentUTCTimeStamp();
      (state.metricsList as any)[params.key] = JSON.stringify(metric);
    }
  }
})

export const getMetricsListSelector = (state: RootState) => state.metrics.metricsList ?? [];
export const metricsAllKeysSelector = createSelector(getMetricsListSelector, (metricsList) => Object.keys(metricsList))
export const metricsAllSerialisedValuesSelector = createSelector(getMetricsListSelector, (metricsList) => Object.values(metricsList))
export const metricsAllValuesSelector = createSelector(metricsAllSerialisedValuesSelector, (metricsList) => metricsList.map((stringMetric) => JSON.parse(stringMetric as string)))

export const generateGetMetricSelector = (key: string) => {
  return createSelector(getMetricsListSelector, (metricsList) => JSON.parse((metricsList as any)[key] ?? "{}"))
}

export const generateGetMetricValueSelector = (key: string, unit?: string) => {
  return createSelector(generateGetMetricSelector(key), (metric) => {
    if (unit && metric?.unit && metric?.value && GetUnitAbbr(unit) != GetUnitAbbr(metric.unit)) {
      try {
        return numericalUnitConvertor(metric.value).from(GetUnitAbbr(metric.unit)).to(GetUnitAbbr(unit))
      } catch (error) {
        console.error(error)
      }
    }
    return metric?.value
  })
}

export const generateGetMetricUnitSelector = (key: string) => {
  return createSelector(generateGetMetricSelector(key), (metric) => metric?.unit)
}

export const generateMetricIsStaleSelector = (key: string, currentTime: string) => {
  return createSelector(generateGetMetricSelector(key), (metric) => {
    if (metric?.explicitlyStale != null) { return metric?.explicitlyStale }
    if (metric?.staleSeconds == null) { return false }
    return new Date(metric?.lastModified ?? 0).getTime() / 1000 + (metric?.staleSeconds ?? 0) < new Date(currentTime).getTime() / 1000
  })
}

export const generateMetricIsDefinedSelector = (key: string) => {
  return createSelector(generateGetMetricSelector(key), (metric) => metric?.defined)
}

export const generateGetMetricLastModifiedSelector = (key: string) => {
  return createSelector(generateGetMetricSelector(key), (metric) => metric?.lastModified)
}

export const hasStandardMetricsSelector = (state: RootState) => state.metrics.hasStandardMetrics ?? false

export const { deleteAll, deleteOne, clearAll, clearOne, createMetric, resetToStandardMetrics } = metricsSlice.actions;
export default metricsSlice.reducer;
