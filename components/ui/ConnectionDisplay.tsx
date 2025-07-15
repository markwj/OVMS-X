import { getCarConnected, getConnectionState, getLastUpdateTime, VehicleConnectionState } from "@/store/connectionSlice"
import { generateGetMetricValueSelector } from "@/store/metricsSlice"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Icon, Text } from "react-native-paper"
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated"
import { useSelector } from "react-redux"

const GREEN = "#00ff00ff"
const ORANGE = "#ff8000ff"
const RED = "#ff0000ff"

export function ConnectionDisplay(): React.JSX.Element {
  let color;
  let flashing;

  const source = 'antenna'
  const opacity = useSharedValue(0.7);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.3, { duration: 500 }), 
      -1, 
      true 
    );
  }, []);

  const connectionState = useSelector(getConnectionState)
  const carConnected = useSelector(getCarConnected)

  if(connectionState == VehicleConnectionState.CONNECTED) {
    if(carConnected) {
      color = GREEN
      flashing = false
    } else {
      color = ORANGE
      flashing = true
    }
  } else {
    color = RED
    flashing = true
  }

  if(flashing) {
    return (
      <Animated.View style={animatedStyle}>
        <Icon source={source} size={20} color={color}/>
      </Animated.View>
    )
  }
  return <Icon source={source} size={20} color={color}/>
}

export function ConnectionText() {
  const { t } = useTranslation()
  const lastUpdated = useSelector(getLastUpdateTime)
  const vEAwake = useSelector(generateGetMetricValueSelector("v.e.awake12"))

  const connectionState = useSelector(getConnectionState)
  const carConnected = useSelector(getCarConnected)

  const dataAgeSeconds = Date.now()/1000 - lastUpdated

  let textContent;
  let textColor = "white";

  if(connectionState == VehicleConnectionState.CONNECTED) {
    if(carConnected) {
      textContent = `${vEAwake ? t('Awake') : t('Sleeping')}, ${GetConnectionStatusText(dataAgeSeconds, t)}`
      textColor = "white"
    } else {
      textColor = ORANGE
      textContent = t("Vehicle disconnected") + " " + GetConnectionStatusText(dataAgeSeconds, t)
    }
  } else if (connectionState == VehicleConnectionState.AUTHENTICATING) {
    textContent = t("Authenticating...")
    textColor = ORANGE
  } else {
    textContent = t("Connecting...")
    textColor = RED
  }

  return <Text style={{color: textColor}}>{textContent}</Text>
}

function GetConnectionStatusText(dataAgeSeconds : number, t : any) {
  const minutes = dataAgeSeconds / 60
  const hours = minutes / 60
  const days = hours / 24

  if(days >= 1) {return `${Math.floor(days)} ${days >= 2 ? t('days') : t('day')}`}
  if(hours >= 1) {return `${Math.floor(hours)} ${hours >= 2 ? t('hours') : t('hour')}`}
  if(minutes >= 1) {return `${Math.floor(minutes)} ${minutes >= 2 ? t('minutes') : t('minute')}`}
  return "live"
}
