import { createSelector, createSlice, Dispatch, PayloadAction, UnknownAction } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from './root';
import { store } from './root';
import { STANDARD_METRICS } from '@/components/vehicle/standardMetrics';
import { MetricDefined, Metric, MetricType, MetricRecord } from '@/components/vehicle/metrics';
import { GetUnitAbbr, numericalUnitConvertor } from '@/components/utils/numericalUnitConverter';
import { GetCurrentUTCTimeStamp } from '@/components/utils/datetime';
import { useDispatch } from 'react-redux';
import { getDistancePreference, getPressureUnit, getTemperatureUnit } from './preferencesSlice';

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
          if (["1", "yes", metric.trueStatement].includes(params.value)) {
            metric.value = "yes"
          } else {
            metric.value = "no"
          }
          break
        case MetricType.NUMBER:
          let v = +params.value;

          if (isNaN(v) && metric.unit == "DateLocal") { //Manual override for trialing converting DateLocal string into number
            //While this can deal with most date formats, several localised date formats cannot be parsed by this
            //It will be necessary to develop a format identifier and parser here for those
            v = Date.parse(params.value)
          }

          if (isNaN(v)) {
            metric.value = "NaN"; break;
          }

          if (metric.unit) {
            if (params.unit && GetUnitAbbr(params.unit) != GetUnitAbbr(metric.unit)) {
              try {
                v = numericalUnitConvertor(v).from(GetUnitAbbr(params.unit)).to(GetUnitAbbr(metric.unit))
                console.log(`[metricsSlice] Converted ${params.key} from ${params.value} ${params.unit} to ${v} ${metric.unit}`)
              } catch (error) {
                console.error(`[metricsSlice] Error converting ${params.key} from ${params.value} ${params.unit} to ${v} ${metric.unit}`, error)
              }
            }
          }

          if (metric.precision != null && +v) {
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

export const selectMetrics = (state: RootState) => state.metrics.metricsList ?? [];
export const selectMetricsKeys = createSelector(selectMetrics, (metricsList) => Object.keys(metricsList))
export const selectMetricsSerialisedValues = createSelector(selectMetrics, (metricsList) => Object.values(metricsList))
export const selectMetricsValues = createSelector(selectMetricsSerialisedValues, (metricsList) => metricsList.map((stringMetric) => JSON.parse(stringMetric as string)))
export const selectHasStandardMetrics = (state: RootState) => state.metrics.hasStandardMetrics ?? false

export const selectMetric = (key: string) => {
  return createSelector(selectMetrics, (metricsList) => JSON.parse((metricsList as any)[key] ?? "{}"))
}

export const selectMetricValue = (key: string, unit?: string) => {
  return createSelector(selectMetric(key), (metric) => {
    let v = metric?.value

    if (v == null) { return v }

    v = v!

    switch (metric.type) {
      case MetricType.BOOL:
        if ([1, "yes", metric.trueStatement].includes(v)) {
          if(unit == "bool") { return true }
          return metric.trueStatement ?? "yes"
        } else {
          if(unit == "bool") { return false }
          return metric.falseStatement ?? "no"
        }
      case MetricType.NUMBER:
        if (metric?.unit) {
          if (unit && GetUnitAbbr(unit) != GetUnitAbbr(metric.unit)) {
            try {
              v = numericalUnitConvertor(metric.value).from(GetUnitAbbr(metric.unit)).to(GetUnitAbbr(unit))
            } catch (error) {
              console.error(error)
            }
          } else if (metric?.unit == "DateLocal") { //Required manual override for number -> string conversion
            v = new Date(metric.value).toLocaleString()
          }
        }
        if (metric.precision != null && +v) {
          v = +v.toFixed(metric.precision);
        }
        return v
      default:
        return v
    }
  })
}

export const selectMetricUnit = (key: string) => {
  return createSelector(selectMetric(key), (metric) => metric?.unit)
}

export const selectMetricIsStale = (key: string, currentTime: string) => {
  return createSelector(selectMetric(key), (metric) => {
    if (metric?.explicitlyStale != null) { return metric?.explicitlyStale }
    if (metric?.staleSeconds == null) { return false }
    return new Date(metric?.lastModified ?? 0).getTime() / 1000 + (metric?.staleSeconds ?? 0) < new Date(currentTime).getTime() / 1000
  })
}

export const selectMetricIsDefined = (key: string) => {
  return createSelector(selectMetric(key), (metric) => metric?.defined)
}

export const selectMetricLastModified = (key: string) => {
  return createSelector(selectMetric(key), (metric) => metric?.lastModified)
}

export const selectMetricRecord = (key: string, toBest?: boolean) => {
  return createSelector(
    [selectMetric(key), selectMetricIsStale(key, GetCurrentUTCTimeStamp())],
    (metric, isStale) => {
      // Return null if metric is not defined (NEVER) or if metric key is not found
      if (!metric || metric.defined === MetricDefined.NEVER) {
        return null;
      }

      // Get the raw value
      const rawValue = metric.value;

      // Get the localized value using the same logic as MetricValue component
      let localisedValue = rawValue;
      let unit = metric.unit;

      if (rawValue != null && metric.type === MetricType.NUMBER && metric.unit) {
        const possibleUnits = numericalUnitConvertor().possibilities();
        
        if (possibleUnits.includes(metric.unit)) {
          let targetUnit;
          
          switch (numericalUnitConvertor().describe(metric.unit).measure) {
            case "temperature":
              targetUnit = getTemperatureUnit(store.getState());
              break;
            case "length":
              targetUnit = getDistancePreference(store.getState());
              break;
            case "pressure":
              targetUnit = getPressureUnit(store.getState());
              break;
            default:
              targetUnit = "system";
          }

          if (targetUnit !== "system" && targetUnit !== metric.unit) {
            try {
              localisedValue = numericalUnitConvertor(rawValue).from(GetUnitAbbr(metric.unit)).to(GetUnitAbbr(targetUnit));
              unit = targetUnit;
            } catch (error) {
              console.error(`Error converting metric ${key}:`, error);
            }
          }
        }
      }

      // Apply toBest conversion if requested (same as MetricValue component)
      if (toBest && localisedValue != null && unit) {
        const res = numericalUnitConvertor(localisedValue).from(unit).toBest();
        if (res) {
          localisedValue = res.val;
          unit = res.unit;
        }
      }

      // Format the localized value as a string
      let formattedLocalisedValue = localisedValue;
      if (localisedValue != null) {
        if (metric.type === MetricType.BOOL) {
          formattedLocalisedValue = [1, "yes", metric.trueStatement].includes(localisedValue) 
            ? (metric.trueStatement ?? "yes") 
            : (metric.falseStatement ?? "no");
        } else if (metric.type === MetricType.NUMBER) {
          if (metric.precision != null && +localisedValue) {
            formattedLocalisedValue = +localisedValue.toFixed(metric.precision);
          }
          if (metric.unit === "DateLocal") {
            formattedLocalisedValue = new Date(localisedValue).toLocaleString();
          }
        }
      }

      return {
        stale: isStale,
        rawValue: rawValue,
        localisedValue: formattedLocalisedValue,
        type: metric.type
      } as MetricRecord;
    }
  );
};

export function selectLocalisedMetricValue(metricName: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const currentUnit = selectMetricUnit(metricName)(getState())
    const possibleUnits = numericalUnitConvertor().possibilities()
    let metricValue = selectMetricValue(metricName)(getState())

    if (metricValue == null || [NaN, null, undefined].includes(+metricValue)) {
      return { value: metricValue, unit: currentUnit }
    }

    metricValue = +metricValue

    let targetUnit;

    if (possibleUnits.includes(currentUnit) && currentUnit != null) {
      switch (numericalUnitConvertor().describe(currentUnit).measure) {
        case "temperature":
          targetUnit = getTemperatureUnit(getState())
          break
        case "length":
          targetUnit = getDistancePreference(getState())
          break
        case "pressure":
          targetUnit = getPressureUnit(getState())
          break
        default:
          targetUnit = "system"
      }

      if (targetUnit == "system" || targetUnit == currentUnit) { return { value: metricValue, unit: currentUnit } }
      if (targetUnit == currentUnit) { return { value: metricValue, unit: targetUnit } }

      const convertedMetricValue = selectMetricValue(metricName, targetUnit)(getState())

      return { value: convertedMetricValue, unit: targetUnit }

    } else {
      return { value: metricValue, unit: currentUnit }
    }
  }
}

export const { deleteAll, deleteOne, clearAll, clearOne, createMetric, resetToStandardMetrics } = metricsSlice.actions;
export default metricsSlice.reducer;
