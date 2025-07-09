import React from "react";
import { useTheme, Text, Button } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import { useDispatch } from "react-redux";
import {vehiclesSlice} from "@/store/vehiclesSlice";

export default function SettingsScreen() {
  const dispatch = useDispatch();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button onPress={() => dispatch(vehiclesSlice.actions.wipeVehicles())}>Wipe all vehicles</Button>
    </View>
  );
}
