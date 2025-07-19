import { selectMetricValue } from "@/store/metricsSlice"
import React, { useEffect, useState } from "react"
import { AnimatedRegion, Circle, MarkerAnimated } from "react-native-maps"
import { useSelector } from "react-redux"
import { VehicleMapImage } from "./VehicleImages";
import { getSelectedVehicle } from "@/store/selectionSlice";
import Animated, { useSharedValue, withTiming, Easing, useAnimatedStyle, useDerivedValue, runOnJS } from "react-native-reanimated";

export function CarMarker() {
  const vPosLatitudeSelector = selectMetricValue("v.p.latitude")
  const vPosLatitude = useSelector(vPosLatitudeSelector)
  const vPosLongitudeSelector = selectMetricValue("v.p.longitude")
  const vPosLongitude = useSelector(vPosLongitudeSelector)
  const vPosDirectionSelector = selectMetricValue("v.p.direction")
  const vPosDirection = useSelector(vPosDirectionSelector)
  const vPosSpeedSelector = selectMetricValue("v.p.speed")
  const vPosSpeed = useSelector(vPosSpeedSelector)

  const vBatRangeEstSelector = selectMetricValue("v.b.range.est")
  const vBatRangeEst = useSelector(vBatRangeEstSelector)
  const vBatRangeIdealSelector = selectMetricValue("v.b.range.ideal")
  const vBatRangeIdeal = useSelector(vBatRangeIdealSelector)

  const selectedVehicle = useSelector(getSelectedVehicle)

  // Create shared values for smooth animations
  const animatedLatitude = useSharedValue(vPosLatitude || 0)
  const animatedLongitude = useSharedValue(vPosLongitude || 0)
  const animatedDirection = useSharedValue(vPosDirection || 0)

  // State variables to avoid accessing .value during render
  const [displayLatitude, setDisplayLatitude] = useState(vPosLatitude || 0)
  const [displayLongitude, setDisplayLongitude] = useState(vPosLongitude || 0)
  const [displayDirection, setDisplayDirection] = useState(vPosDirection || 0)

  // Update shared values when new data arrives
  useEffect(() => {
    if (vPosLatitude !== null && vPosLatitude !== undefined) {
      animatedLatitude.value = withTiming(vPosLatitude, {
        duration: 3000,
        easing: Easing.linear
      })
    }
  }, [vPosLatitude, animatedLatitude])

  useEffect(() => {
    if (vPosLongitude !== null && vPosLongitude !== undefined) {
      animatedLongitude.value = withTiming(vPosLongitude, {
        duration: 3000,
        easing: Easing.linear
      })
    }
  }, [vPosLongitude, animatedLongitude])

  useEffect(() => {
    if (vPosDirection !== null && vPosDirection !== undefined) {
      animatedDirection.value = withTiming(vPosDirection, {
        duration: 1000,
        easing: Easing.linear
      })
    }
  }, [vPosDirection, animatedDirection])

  // Update display values from animated values
  useDerivedValue(() => {
    runOnJS(setDisplayLatitude)(animatedLatitude.value)
  })

  useDerivedValue(() => {
    runOnJS(setDisplayLongitude)(animatedLongitude.value)
  })

  useDerivedValue(() => {
    runOnJS(setDisplayDirection)(animatedDirection.value)
  })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transformOrigin: 'center',
      transform: [{ rotate: `${animatedDirection.value}deg` }, { translateX: "-25%" }],
    };
  });

  return (
    <>
      {/*@ts-ignore*/}
      <MarkerAnimated coordinate={{
        latitude: displayLatitude, 
        longitude: displayLongitude
      }}>
        <Animated.View style={[{ width: 36.4, height: 63.04, transformOrigin: 'center' }, animatedStyle]}>
          {selectedVehicle != null && <VehicleMapImage image={selectedVehicle.image} />}
        </Animated.View>
      </MarkerAnimated>
      <Circle center={{
        latitude: vPosLatitude,
        longitude: vPosLongitude
      }} radius={vBatRangeEst * 1000} strokeColor="red" />
      <Circle center={{
        latitude: vPosLatitude,
        longitude: vPosLongitude
      }} radius={vBatRangeIdeal * 1000} strokeColor="black" />
    </>
  )
}
