import React from "react";
import { useTheme, Text } from 'react-native-paper';
import { View, TouchableOpacity } from 'react-native';

export default function ClimateScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Climate</Text>
    </View>
  );
}
