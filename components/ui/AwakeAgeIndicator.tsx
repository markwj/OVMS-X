import { getLastUpdateTime } from "@/store/connectionSlice"
import { generateGetMetricValueSelector } from "@/store/metricsSlice"
import React from "react"
import {Text} from "react-native-paper"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"

export function AwakeAgeIndicator() {
  const { t } = useTranslation()
  const lastUpdated = useSelector(getLastUpdateTime)

  const vEAwakeSelector = generateGetMetricValueSelector("v.e.awake12")
  const vEAwake = useSelector(vEAwakeSelector)
  
  const dataAgeDisplay = lastUpdated != 0 ? DisplayDataAge(Date.now()/1000 - lastUpdated, t) : "no data"

  return <Text>{vEAwake ? t('Awake') : t('Asleep')}, {dataAgeDisplay}</Text>
}

function DisplayDataAge(dataAgeSeconds : number, t : any) {
  const minutes = dataAgeSeconds / 60
  const hours = minutes / 60
  const days = hours / 24

  if(days >= 1) {return `${Math.floor(days)} ${days >= 2 ? t('days') : t('day')}`}
  if(hours >= 1) {return `${Math.floor(hours)} ${hours >= 2 ? t('hours') : t('hour')}`}
  if(minutes >= 1) {return `${Math.floor(minutes)} ${minutes >= 2 ? t('minutes') : t('minute')}`}
  return "live"
}