import React, { useEffect, useRef, useState } from "react";
import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { CarMarker } from "./CarMarker";
import { useSelector } from "react-redux";
import { selectMetricValue } from "@/store/metricsSlice";
import { Animated, useColorScheme, View } from "react-native";
import { getSelectedVehicle } from "@/store/selectionSlice";

export function Map() {
  const mapRef = useRef(null)
  const colorScheme = useColorScheme();
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
      latitude: vPLatitude,
      longitude: vPLongitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta
    }, 500)
  }

  return (
    <View style={{ flexGrow: 1 }}>
      <MapView
        ref={mapRef}
        region={region}
        initialRegion={INITIAL_REGION}
        onRegionChangeComplete={(r, v) => {
          if (v.isGesture) {
            setRegion(r)
          }
        }}
        style={{ flex: 1 }}
        rotateEnabled={false}
        showsTraffic={false}>
        <CarMarker />
      </MapView>
    </View>
  );
}
