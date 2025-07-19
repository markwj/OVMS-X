import React, { ComponentProps } from 'react'
import { Text } from 'react-native-paper'
import { GetCurrentUTCTimeStamp } from '../utils/datetime'
import { useSelector } from 'react-redux'
import { selectMetricUnit, selectMetricValue, selectMetricIsStale } from '@/store/metricsSlice'

type Props = Omit<ComponentProps<typeof Text>, 'metricKey'> & { metricKey: string }

export function MetricValue({ metricKey } : Props) {
  const stale = useSelector(selectMetricIsStale(metricKey, GetCurrentUTCTimeStamp()))
  const value = useSelector(selectMetricValue(metricKey))
  const unit = useSelector(selectMetricUnit(metricKey))

  return (
    <Text style={{ color: stale ? "grey" : "white" }}>
      {value != null ? value + " " + (unit ?? "") : "undefined"}
    </Text>
  )
}