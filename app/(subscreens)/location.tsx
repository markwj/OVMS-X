import React from "react";
import { useTheme } from 'react-native-paper';
import { View } from 'react-native';
import { Stack } from "expo-router";
//import { ClusteredMapView } from 'react-native-maps-super-cluster';
import { Marker } from "react-native-maps";

const INITIAL_REGION = {
  latitude: 52.5,
  longitude: 19.2,
  latitudeDelta: 8.5,
  longitudeDelta: 8.5,
};

export default function LocationScreen() {
  const theme = useTheme();

  return (
    <>
      <View>
      </View>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Location',
        }} />
    </>
  );
}
