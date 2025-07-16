import { generateGetMetricValueSelector } from "@/store/metricsSlice"
import React, { useEffect, useState } from "react"
import { AnimatedRegion, Circle, MarkerAnimated } from "react-native-maps"
import { useSelector } from "react-redux"
import { VehicleMapImage } from "./VehicleImages";
import { getSelectedVehicle } from "@/store/selectionSlice";
import Animated from "react-native-reanimated";
import { useSharedValue, withTiming, Easing, useAnimatedStyle } from "react-native-reanimated";

export function CarMarker() {
  const vPosLatitudeSelector = generateGetMetricValueSelector("v.p.latitude")
  const vPosLatitude = useSelector(vPosLatitudeSelector)
  const vPosLongitudeSelector = generateGetMetricValueSelector("v.p.longitude")
  const vPosLongitude = useSelector(vPosLongitudeSelector)
  const vPosDirectionSelector = generateGetMetricValueSelector("v.p.direction")
  const vPosDirection = useSelector(vPosDirectionSelector)

  const vBatRangeEstSelector = generateGetMetricValueSelector("v.b.range.est")
  const vBatRangeEst = useSelector(vBatRangeEstSelector)
  const vBatRangeIdealSelector = generateGetMetricValueSelector("v.b.range.ideal")
  const vBatRangeIdeal = useSelector(vBatRangeIdealSelector)

  const selectedVehicle = useSelector(getSelectedVehicle)
  const currentCoordinate = { latitude: vPosLatitude, longitude: vPosLongitude }
  const [markerCoordinate, setMarkerCoordinate] = useState(new AnimatedRegion({ latitude: vPosLatitude, longitude: vPosLongitude }))

  const markerBearing = useSharedValue(vPosDirection)
  useEffect(() => {
    if (markerBearing.value !== vPosDirection) {
      markerBearing.value = withTiming(vPosDirection, {
        duration: 5000,
        easing: Easing.linear,
      });
    }
    if (markerCoordinate != new AnimatedRegion(currentCoordinate)) {
      markerCoordinate.timing({
        latitude: currentCoordinate.latitude,
        longitude: currentCoordinate.longitude,
        latitudeDelta: 0,
        longitudeDelta: 0,
        easing: Easing.linear,
        duration: 5000,
        toValue: 1,
        useNativeDriver: false
      }).start()
    }
  }, [vPosDirection, currentCoordinate]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transformOrigin: 'center',
      transform: [{ rotate: `${markerBearing.value}deg` }, { translateX: "-25%" }],
    };
  });

  return (
    <>
      {/*@ts-ignore*/}
      <MarkerAnimated coordinate={markerCoordinate}>
        <Animated.View style={[{width: 36.4, height: 63.04, transformOrigin: 'center'}, animatedStyle]}>
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
