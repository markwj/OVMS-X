import React, { ComponentProps } from 'react'
import { Text } from 'react-native-paper'
import { GetCurrentUTCTimeStamp } from '../utils/datetime'
import { useSelector } from 'react-redux'
import { generateGetMetricUnitSelector, generateGetMetricValueSelector, generateMetricIsStaleSelector } from '@/store/metricsSlice'

type Props = Omit<ComponentProps<typeof Text>, 'metricKey'> & { metricKey: string }

export function MetricValue({ metricKey } : Props) {
  const stale = useSelector(generateMetricIsStaleSelector(metricKey, GetCurrentUTCTimeStamp()))
  const value = useSelector(generateGetMetricValueSelector(metricKey))
  const unit = useSelector(generateGetMetricUnitSelector(metricKey))

  return (
    <Text style={{ color: stale ? "grey" : "white" }}>
      {value != null ? value + " " + (unit ?? "") : "undefined"}
    </Text>
  )
}