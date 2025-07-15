import { getCarConnected, getConnectionState, VehicleConnectionState } from "@/store/connectionSlice"
import { generateGetMetricValueSelector } from "@/store/metricsSlice"
import React, { useEffect } from "react"
import { Icon } from "react-native-paper"
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated"
import { useSelector } from "react-redux"

export function ConnectionDisplay(): React.JSX.Element {
  let color;
  let flashing;

  const green = "#00ff00ff"
  const orange = "#ff8000ff"
  const red = "#ff0000ff"

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
      color = green
      flashing = false
    } else {
      color = orange
      flashing = true
    }
  } else {
    color = red
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