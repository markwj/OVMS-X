import { selectMetricValue } from "@/store/metricsSlice"
import React from "react"
import { Icon } from "react-native-paper"
import { useSelector } from "react-redux"

export function BatteryIcon({ batterySOC, batteryCharging }: { batterySOC?: number, batteryCharging?: boolean }): React.JSX.Element {
  let batteryIconSource = ''

  batterySOC ??= useSelector(selectMetricValue("v.b.soc"))
  batteryCharging ??= useSelector(selectMetricValue('v.c.inprogress')) == "yes"

  let batteryColor = "#ffffff"

  if (batterySOC == undefined) {
    batteryIconSource = "battery-unknown"
  } else {
    switch (Math.floor(batterySOC / 10) * 10) {
      case 100:
        batteryIconSource = batteryCharging ? 'battery-charging-100' : 'battery'
        break
      case 0:
        batteryColor = "#ff0000"
        batteryIconSource = batteryCharging ? 'battery-charging-outline' : 'battery-outline'
        break
      default:
        if(batterySOC <= 10) {
          batteryColor = "#ff0000"
        }
        batteryIconSource = (batteryCharging ? 'battery-charging-' : 'battery-') + Math.floor(batterySOC / 10) * 10
    }
  }

  return (<Icon source={batteryIconSource} size={20} color={batteryColor}/>)
}