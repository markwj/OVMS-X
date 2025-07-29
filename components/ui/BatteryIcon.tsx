import { selectMetricValue } from "@/store/metricsSlice"
import React, { useRef } from "react"
import { ImageBackground, Image, View } from "react-native"
import { Icon, Text, useTheme } from "react-native-paper"
import { FlipInEasyX } from "react-native-reanimated"
import { useSelector } from "react-redux"

export function BatteryIcon({ batterySOC, batteryCharging }: { batterySOC?: number, batteryCharging?: boolean }): React.JSX.Element {
  let batteryIconSource = ''
  const theme = useTheme()

  batterySOC ??= useSelector(selectMetricValue("v.b.soc"))
  batteryCharging ??= useSelector(selectMetricValue('v.c.inprogress')) == "yes"

  let batteryColor = theme.colors.onSurface

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
        if (batterySOC <= 10) {
          batteryColor = "#ff0000"
        }
        batteryIconSource = (batteryCharging ? 'battery-charging-' : 'battery-') + Math.floor(batterySOC / 10) * 10
    }
  }

  return (<Icon source={batteryIconSource} size={20} color={batteryColor} />)
}

const battery100 = require("@/assets/images/component/battery_100.png")
const battery0 = require("@/assets/images/component/battery_000.png")
const batteryCopperTops = require("@/assets/images/component/battery_coppertops.png")
const minPercentageWidth = 16
const maxPercentageWidth = 62

export function HorizontalBatteryIcon({ batterySOC, batteryCharging }: { batterySOC?: number, batteryCharging?: boolean }): React.JSX.Element {

  batterySOC ??= useSelector(selectMetricValue("v.b.soc"))
  batteryCharging ??= useSelector(selectMetricValue('v.c.inprogress')) == "yes"

  const displayedPercent = batterySOC ?? 0

  const percentageWidth = minPercentageWidth + (displayedPercent / 100) * maxPercentageWidth
  const offsetToPercentageWidth = (100 / percentageWidth) * 100

  return (
    <View style={{ flex: 1, flexDirection: 'column', position: 'relative' }}>
      <ImageBackground source={battery0} style={{ width: '100%', height: '100%', alignSelf: 'center', overflow: 'hidden' }} resizeMode="contain">
        {/*@ts-ignore*/}
        <View style={{ width: `${percentageWidth}%`, height: '100%', overflow: 'hidden' }}>
          <View style={{ width: `${offsetToPercentageWidth}%`, height: '100%', overflow: 'hidden', alignSelf: 'flex-start' }}>
            <Image source={battery100} style={{ width: '100%', height: '100%', alignSelf: 'flex-start', overflow: 'hidden', resizeMode: 'contain' }}></Image>
          </View>
        </View>
      </ImageBackground>
      {batteryCharging &&
        <Image source={batteryCopperTops} style={{ width: '100%', height: '100%', alignSelf: 'center', overflow: 'hidden', position: 'absolute', left: 0, top: 0 }} resizeMode="contain"></Image>
      }
      <View style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="displaySmall" style={{ paddingHorizontal: 10, textAlign: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>{batterySOC}%</Text>
      </View>
    </View>
  )

}