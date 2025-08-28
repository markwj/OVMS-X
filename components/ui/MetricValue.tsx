import React, { ComponentProps } from 'react'
import { Text, useTheme } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import { GetCurrentUTCTimeStamp } from '../utils/datetime'
import { useSelector } from 'react-redux'
import { selectMetricUnit, selectMetricValue, selectMetricIsStale, selectLocalisedMetricValue } from '@/store/metricsSlice'
import { store } from '@/store/root'
import { numericalUnitConvertor } from '../utils/numericalUnitConverter'
import { useTranslation } from 'react-i18next'
import { MetricRecord } from '@/components/vehicle/metrics'

type MetricRecordProps = Omit<ComponentProps<typeof Text>, 'children'> & { 
  metricRecord: MetricRecord | null, 
  emptyOverride?: string,
  showStaleIndicator?: boolean
}

export function MetricVal(props: MetricRecordProps) {
  const {t} = useTranslation()
  const theme = useTheme()

  if (!props.metricRecord) {
    return (
      <Text {...props} style={props.style}>
        {t(props.emptyOverride ?? "")}
      </Text>
    )
  }

  const { localisedValueWithUnit: localisedValue, stale } = props.metricRecord
  const showStaleIndicator = props.showStaleIndicator ?? true

  return (
    <Text {...props} style={[props.style, (stale && showStaleIndicator && {opacity: 0.5})]}>
      {localisedValue != null ? localisedValue : (t(props.emptyOverride ?? ""))}
    </Text>
  )
}