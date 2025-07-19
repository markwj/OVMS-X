import React, { ComponentProps } from 'react'
import { Text } from 'react-native-paper'
import { GetCurrentUTCTimeStamp } from '../utils/datetime'
import { useSelector } from 'react-redux'
import { selectMetricUnit, selectMetricValue, selectMetricIsStale, selectLocalisedMetricValue } from '@/store/metricsSlice'
import { store } from '@/store/root'

type Props = Omit<ComponentProps<typeof Text>, 'metricKey'> & { metricKey: string }

export function MetricValue({ metricKey } : Props) {
  const stale = useSelector(selectMetricIsStale(metricKey, GetCurrentUTCTimeStamp()))

  const {value, unit} = store.dispatch(selectLocalisedMetricValue(metricKey))

  return (
    <Text style={{ color: stale ? "grey" : "white" }}>
      {value != null ? value + " " + (unit ?? "") : "undefined"}
    </Text>
  )
}