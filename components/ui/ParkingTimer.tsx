import { selectMetricUnit, selectMetricValue } from "@/store/metricsSlice"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { numericalUnitConvertor } from "../utils/numericalUnitConverter"
import { View, Image } from "react-native"
import React from "react"
import { Icon, Text } from "react-native-paper"

const parkingImageSource = require("@/assets/images/component/parking.png")

export function ParkingTimer() {
  const { t } = useTranslation()
  
  const vERawParktime = useSelector(selectMetricValue("v.e.parktime"))
  const vEParktimeUnit = useSelector(selectMetricUnit("v.e.parktime"))
  const vEParktimeSeconds = numericalUnitConvertor(vERawParktime).from(vEParktimeUnit).to("s")

  //@ts-ignore
  if(vEParktimeSeconds == 0) {
    return <View></View>
  }

  const convertedParktime = numericalUnitConvertor(vEParktimeSeconds).from("s").toBest({exclude: ['ms', 'ns', 'mu', 'year']})!
  convertedParktime.val = Math.floor(convertedParktime.val)

  return (
    <View style={{ flexDirection: 'row'}}>
      <Icon source={parkingImageSource} size={20}></Icon>
      <Text style={{marginStart: 10}}>{`${convertedParktime.val} ${t(convertedParktime.val == 1 ? convertedParktime.singular : convertedParktime.plural)}`}</Text>
    </View>
  )

}
