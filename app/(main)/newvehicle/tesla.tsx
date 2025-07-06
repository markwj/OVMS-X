import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet
} from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Text, Card } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function NewVehicleTesla() {
  const theme = useTheme();
  const { t } = useTranslation();
  
  return (
    <ScrollView style={{ height: '100%' }}>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: 200,
  },
});