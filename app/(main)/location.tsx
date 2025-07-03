import React from "react";
import { useTheme, Text } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from "expo-router";
//import { ClusteredMapView } from 'react-native-maps-super-cluster';
//import { Marker } from "react-native-maps";

const INITIAL_REGION = {
  latitude: 52.5,
  longitude: 19.2,
  latitudeDelta: 8.5,
  longitudeDelta: 8.5,
};

export default function LocationScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Location</Text>
    </View>
  );
}
