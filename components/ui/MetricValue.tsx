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

type Props = Omit<ComponentProps<typeof Text>, 'children'> & { metricKey: string, addSpace? : boolean, emptyOverride? : string, showUnit? : boolean, toBest? : boolean, abbreviateUnit? : boolean }

export function MetricValue(props : Props) {
  const stale = useSelector(selectMetricIsStale(props.metricKey, GetCurrentUTCTimeStamp()))
  const {t} = useTranslation()
  const theme = useTheme()

  let {value, unit} = store.dispatch(selectLocalisedMetricValue(props.metricKey))

  if(props.toBest) {
    const res = numericalUnitConvertor(value).from(unit).toBest()
    value = res?.val
    unit = res?.unit
  }

  let addSpace = props.addSpace ?? !(["%", "°", "°C", "°F"].includes(unit))
  let showUnit = props.showUnit ?? true
  let abbreviateUnit = props.abbreviateUnit ?? true

  if(numericalUnitConvertor().possibilities().includes(unit) && !abbreviateUnit) {
    unit = value == 1 ? numericalUnitConvertor().describe(unit).singular : numericalUnitConvertor().describe(unit).plural
  }

  return (
    <Text {...props} style={[props.style, (stale && {opacity: 0.5})]}>
      {value != null ? value + (addSpace ? " " : "") + (showUnit ? (unit ?? "") : "") : (t(props.emptyOverride ?? ""))}
    </Text>
  )
}

type MetricRecordProps = Omit<ComponentProps<typeof Text>, 'children'> & { 
  metricRecord: MetricRecord | null, 
  addSpace?: boolean, 
  emptyOverride?: string, 
  showUnit?: boolean, 
  abbreviateUnit?: boolean 
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

  const { localisedValue, stale } = props.metricRecord

  let addSpace = props.addSpace ?? !(["%", "°", "°C", "°F"].includes("")) // No unit in MetricRecord, so default to true
  let showUnit = props.showUnit ?? true
  let abbreviateUnit = props.abbreviateUnit ?? true

  return (
    <Text {...props} style={[props.style, (stale && {opacity: 0.5})]}>
      {localisedValue != null ? localisedValue : (t(props.emptyOverride ?? ""))}
    </Text>
  )
}