import { createReducer, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './root';
import { STANDARD_METRICS } from '@/components/vehicle/standardMetrics';

export enum MetricDefined {
  NEVER = "never",
  FIRST = "first",
  DEFINED = "defined"
}

export enum MetricType {
  UNDEFINED = 0,
  BOOL = 1,
  STRING = 2,
  NUMBER = 3
}

export class Metric {
  value: string | null = null

  standard? : boolean;

  type: MetricType = MetricType.UNDEFINED
  unit: string | null = null
  precision: number | null = null

  staleSeconds: number | null = null
  defined: MetricDefined = MetricDefined.NEVER
  lastModified: Date | null = null
}

function ConstructNewMetric(standard : boolean, options? : {value? : string, type? : string, unit? : string, precision? : number, staleSeconds? : number, currentTime? : Date}) {
  let newMetric = new Metric();
  newMetric.standard = standard;
  newMetric.staleSeconds = options?.staleSeconds ?? null
  newMetric.unit = options?.unit ?? null
  newMetric.precision = options?.precision ?? null
  newMetric.value = options?.value ?? null
  if(newMetric.value != null) {
    newMetric.defined = MetricDefined.FIRST;
    newMetric.lastModified = options?.currentTime ?? null;
  } else {
    newMetric.defined = MetricDefined.NEVER;
  }

  switch(options?.type) {
    case "bool":
      newMetric.type = MetricType.BOOL
      break
    case "string":
      newMetric.type = MetricType.STRING
      break
    case "number":
      newMetric.type = MetricType.NUMBER
      break
    default:
      newMetric.type = MetricType.UNDEFINED
      break
  }

  return newMetric;
}

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
        (state.metricsList as any)[metric.key] = JSON.stringify(ConstructNewMetric(true, metric));
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
        metric.value = "undefined";
        metric.defined = MetricDefined.NEVER;
        metric.lastModified = "undefined";
        (state.metricsList as any)[key] = JSON.stringify(metric);
      }
    },
    clearOne: (state: Metrics, key: PayloadAction<string>) => {
      if (!Object.keys(state.metricsList).includes(key.payload)) { return; }
      const metric = JSON.parse((state.metricsList as any)[key.payload] as string);
      metric.value = "undefined";
      metric.defined = MetricDefined.NEVER;
      metric.lastModified = "undefined";
      (state.metricsList as any)[key.payload] = JSON.stringify(metric);
    },
    createMetric: (state: Metrics, payload: PayloadAction<{ standard: boolean, key: string, unit?: string, staleSeconds?: number }>) => {
      const params = payload.payload;
      (state.metricsList as any)[params.key] = JSON.stringify(ConstructNewMetric(true, params));
    },
    setMetric: (state: Metrics, payload: PayloadAction<{ key: string, value: string, currentTime : Date }>) => { //Need to pass the current time to maintain purity
      const params = payload.payload;
      if (!Object.keys(state.metricsList).includes(params.key)) { return; }
      const metric = JSON.parse((state.metricsList as any)[params.key]);
      metric.value = params.value;
      metric.defined = metric.defined != MetricDefined.NEVER ? MetricDefined.DEFINED : MetricDefined.FIRST
      metric.lastModified = params.currentTime;
      (state.metricsList as any)[params.key] = JSON.stringify(metric);
    }
  }
})

export const getMetricsListSelector = (state : RootState) => state.metrics.metricsList;
export const metricsAllKeysSelector = createSelector(getMetricsListSelector, (metricsList) => Object.keys(metricsList))
export const metricsAllSerialisedValuesSelector = createSelector(getMetricsListSelector, (metricsList) => Object.values(metricsList))
export const metricsAllValuesSelector = createSelector(metricsAllSerialisedValuesSelector, (metricsList) => metricsList.map((stringMetric) => JSON.parse(stringMetric as string)))


export const generateGetMetricSelector = (key : string) => {
  return createSelector(getMetricsListSelector, (metricsList) => JSON.parse((metricsList as any)[key]))
}

export const generateGetMetricValueSelector = (key : string) => {
  return createSelector(generateGetMetricSelector(key), (metric) => metric.value)
}

export const generateGetMetricUnitSelector = (key : string) => {
  return createSelector(generateGetMetricSelector(key), (metric) => metric.unit)
}

export const generateMetricIsStaleSelector = (key : string, currentTime : Date) => {
  return createSelector(generateGetMetricSelector(key), (metric) => ((metric.lastModified as Date).getSeconds() + metric.staleSeconds) < (currentTime).getSeconds())
}

export const generateMetricIsDefinedSelector = (key : string) => {
  return createSelector(generateGetMetricSelector(key), (metric) => metric.defined)
}

export const generateGetMetricLastModifiedSelector = (key : string) => {
  return createSelector(generateGetMetricSelector(key), (metric) => metric.lastModified)
}

export const { deleteAll, deleteOne, clearAll, clearOne, createMetric, resetToStandardMetrics } = metricsSlice.actions;
export default metricsSlice.reducer;
