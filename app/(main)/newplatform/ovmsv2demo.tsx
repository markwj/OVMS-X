import React, { useEffect, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { Stack, router } from "expo-router";
import { Text, TextInput, Button, SegmentedButtons, HelperText } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from "react-hook-form";
import { useHeaderHeight } from '@react-navigation/elements'
import { useGetMessagesQuery, closeWebSocket } from "@/store/ovmsv2wsApi";
import { useDispatch } from "react-redux";
import { vehiclesSlice } from "@/store/vehiclesSlice";
import { useLazyGetVehiclesQuery } from "@/store/ovmsv2httpApi";
import { VehicleTypes } from "@/components/ui/VehicleImages";
import { metricsSlice } from "@/store/metricsSlice";
import { selectionSlice } from "@/store/selectionSlice";

// Function to generate a random color
const generateRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#F9E79F', '#ABEBC6', '#FAD7A0', '#AED6F1', '#D5A6BD'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Function to generate a random vehicle type
const generateRandomVehicleType = (): string => {
  const vehicleTypeKeys = Object.keys(VehicleTypes);
  return vehicleTypeKeys[Math.floor(Math.random() * vehicleTypeKeys.length)];
};

export default function NewPlatformOVMSDemo() {
  const { t } = useTranslation();
  const dispatch = useDispatch()

  useEffect(() => {
    const newKey = "ovmsv2api:api.openvehicles.com:6869:6870:demo:DEMO";
    const newVehicle = {
      key: newKey,
      name: "DEMO",
      vin: '',
      platform: 'ovmsv2api',
      platformKey: newKey,
      platformParameters: {
        server: "api.openvehicles.com",
        httpsport: "6869",
        wssport: "6870",
        username: "demo",
        password: "9768e3a55ed098e66da206bdb1660cad792b496d1e9b5d78140d8d2f5a603736",
        id: "DEMO"
      },
      image: {
        imageName: generateRandomVehicleType(),
        tintColor: generateRandomColor(),
        customPath: null
      }
    };

    dispatch(vehiclesSlice.actions.addVehicle(newVehicle));
    console.log("[NewPlatformOVMSv2Demo] selecting vehicle", newKey);
    dispatch(metricsSlice.actions.clearAll());
    dispatch(selectionSlice.actions.selectVehicle(newKey));

    // Navigate back to main screen after successful addition
    setTimeout(() => {
      router.replace({ pathname: '/' });
    }, 1500);

  }, [])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="titleLarge">Loading DEMO vehicle...</Text>
    </View>
  );
}