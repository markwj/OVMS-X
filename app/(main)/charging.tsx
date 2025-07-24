import React from "react";
import { useTheme, Text } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { HorizontalBatteryIcon } from "@/components/ui/BatteryIcon";

export default function ChargingScreen() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, flexDirection: 'column', margin: 20 }}>
        <View style={{flex: 1, flexDirection: 'column', padding: 20}}>
          <HorizontalBatteryIcon></HorizontalBatteryIcon>
        </View>
        <View style={{flex: 4}}>

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
