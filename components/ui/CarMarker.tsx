import { generateGetMetricValueSelector } from "@/store/metricsSlice"
import React from "react"
import { Circle, Marker } from "react-native-maps"
import { useSelector } from "react-redux"
import { View } from "react-native";
import { VehicleMapImage } from "./VehicleImages";
import { getSelectedVehicle } from "@/store/vehiclesSlice";

export function CarMarker() {
  const vPosLatitude = useSelector(generateGetMetricValueSelector("v.pos.latitude"))
  const vPosLongitude = useSelector(generateGetMetricValueSelector("v.pos.longitude"))
  const vPosDirection = useSelector(generateGetMetricValueSelector("v.pos.direction"))

  const vBatRangeEst = useSelector(generateGetMetricValueSelector("v.bat.range.est"))
  const vBatRangeIdeal = useSelector(generateGetMetricValueSelector("v.bat.range.ideal"))

  const selectedVehicle = useSelector(getSelectedVehicle)

  if (vPosLatitude == null || vPosLongitude == null) { return null; }

  return (
    <>
      <Marker coordinate={{ latitude: vPosLatitude, longitude: vPosLongitude }}>
        <View style={{ width: 45.4, height: 78.8, transform: [{ rotate: vPosDirection + 'deg' }] }}>
          <VehicleMapImage image={selectedVehicle.image} />
        </View>
      </Marker>
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
