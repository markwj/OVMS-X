import React, { useEffect, useRef, useState } from "react";
import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { CarMarker } from "./CarMarker";
import { useSelector } from "react-redux";
import { selectMetricValue } from "@/store/metricsSlice";
import { Animated } from "react-native";
import { getSelectedVehicle } from "@/store/selectionSlice";

export function Map() {
  const mapRef = useRef(null)

  const vPLatitude = useSelector(selectMetricValue("v.p.latitude"))
  const vPLongitude = useSelector(selectMetricValue("v.p.longitude"))

  const INITIAL_REGION = {
    latitude: vPLatitude ?? 52.5,
    longitude: vPLongitude ?? 19.2,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const [region, setRegion] = useState(INITIAL_REGION)

  if (vPLatitude == null || vPLongitude == null) {
    return (<></>);
  }

  if (Math.abs(vPLatitude - region.latitude) > region.latitudeDelta / 2 || Math.abs(vPLongitude - region.longitude) > region.longitudeDelta / 2) {
    //@ts-ignore
    mapRef.current?.animateToRegion({
      latitude: vPLatitude ?? region.latitude,
      longitude: vPLongitude ?? region.longitude,
    }, 100)
  }

  return (
    <MapView
      ref={mapRef}
      region={region}
      onRegionChangeComplete={setRegion}
      rotateEnabled={false}
      showsTraffic={false}
      style={{ flex: 1 }}
      provider={PROVIDER_GOOGLE}>
      <CarMarker />
    </MapView>
  );
}
