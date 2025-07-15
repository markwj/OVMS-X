import React from "react";
import { useTheme, Text } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import { useSelector } from "react-redux";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { VehicleTopImage } from "@/components/ui/VehicleImages";

export default function ClimateScreen() {
  const vehicle = useSelector(getSelectedVehicle)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {vehicle != null &&
        <View style={{ height: '100%' }}>
          <VehicleTopImage image={vehicle.image} />
        </View>
      }
    </View>
  );
}
