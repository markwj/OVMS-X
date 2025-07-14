import React from "react";
import MapView, { Marker } from "react-native-maps";
import { CarMarker } from "./CarMarker";
import { useSelector } from "react-redux";
import { generateGetMetricValueSelector } from "@/store/metricsSlice";

export function Map() {

  const INITIAL_REGION = {
    latitude: useSelector(generateGetMetricValueSelector("v.p.latitude")) ?? 52.5,
    longitude: useSelector(generateGetMetricValueSelector("v.p.longitude")) ?? 19.2,
    latitudeDelta: 8.5,
    longitudeDelta: 8.5,
  };

  return (
    <MapView
      initialRegion={INITIAL_REGION}
      rotateEnabled={false}
      style={{ flex: 1 }}>
      <CarMarker />
    </MapView>
  );
}
