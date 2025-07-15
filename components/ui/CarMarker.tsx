import { generateGetMetricValueSelector } from "@/store/metricsSlice"
import React from "react"
import { Circle, Marker } from "react-native-maps"
import { useSelector } from "react-redux"
import { View } from "react-native";
import { VehicleMapImage } from "./VehicleImages";
import { getSelectedVehicle } from "@/store/selectionSlice";

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

  if (vPosLatitude == null || vPosLongitude == null) { return null; }

  return (
    <>
      <Marker coordinate={{ latitude: vPosLatitude, longitude: vPosLongitude }}>
        <View style={{ width: 45.4, height: 78.8, transform: [{ rotate: vPosDirection + 'deg' }] }}>
          {selectedVehicle != null && <VehicleMapImage image={selectedVehicle.image} />}
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
