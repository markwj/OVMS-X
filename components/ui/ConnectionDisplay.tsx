import { getConnectionState, VehicleConnectionState } from "@/store/connectionSlice"
import React, { useEffect } from "react"
import { Icon } from "react-native-paper"
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated"
import { useSelector } from "react-redux"

export function ConnectionDisplay(): React.JSX.Element {
  let color = '#00ff00ff'
  let flashing = false

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

  switch(connectionState) {
    case VehicleConnectionState.DISCONNECTED:
    case VehicleConnectionState.ERROR:
      color = '#ff0000ff'
      break
    case VehicleConnectionState.AUTHENTICATING:
    case VehicleConnectionState.CONNECTING:
      flashing = true
      break
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