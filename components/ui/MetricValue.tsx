import React, { ComponentProps } from 'react'
import { Text } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import { GetCurrentUTCTimeStamp } from '../utils/datetime'
import { useSelector } from 'react-redux'
import { selectMetricUnit, selectMetricValue, selectMetricIsStale, selectLocalisedMetricValue } from '@/store/metricsSlice'
import { store } from '@/store/root'

type Props = Omit<ComponentProps<typeof Text>, 'children'> & { metricKey: string } & { addSpace? : boolean }

export function MetricValue(props : Props) {
  const stale = useSelector(selectMetricIsStale(props.metricKey, GetCurrentUTCTimeStamp()))

  const {value, unit} = store.dispatch(selectLocalisedMetricValue(props.metricKey))

  let addSpace = props.addSpace ?? !(["%", "°"].includes(unit))

  return (
    <Text style={StyleSheet.compose({ color: stale ? "grey" : "rgba(230,225,229,1)" }, props.style)} variant={props.variant}>
      {value != null ? value + (addSpace ? " " : "") + (unit ?? "") : ""}
    </Text>
  )
}