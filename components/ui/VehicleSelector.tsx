import React, { useState, useRef } from "react";
import { Image, View, Pressable, ScrollView, StyleSheet } from "react-native";
import { router, useRouter } from "expo-router";
import { Text, Card, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedVehicle, getVehicles, Vehicle, vehiclesSlice } from "@/store/vehiclesSlice";
import { useTranslation } from "react-i18next";
import { VehicleSideImage } from "@/components/ui/VehicleImages";

function VehicleList() {
  const vehicleList = useSelector(getVehicles);
  const selectedVehicle = useSelector(getSelectedVehicle);
  const dispatch = useDispatch();

  const onVehiclePress = (key : string) => {
    dispatch(vehiclesSlice.actions.selectVehicle(key))
  }

  if (typeof vehicleList === 'undefined') {
    return null;
  } else {
    return (
      <>
        {vehicleList.map((vehicle: Vehicle, index: number) => (
          <Pressable
            key={`vehicle-${vehicle.key}`}
            onPress={() => { onVehiclePress(vehicle.key) } }>
            <Card
            style={styles.container}
            mode={selectedVehicle?.key === vehicle.key ? 'outlined' : 'elevated'}
            contentStyle={{
              opacity: selectedVehicle?.key === vehicle.key ? 1.0 : 0.5
            }}>
              <Card.Content>
                <VehicleSideImage image={vehicle.image} />
                <Text>{vehicle.name}</Text>
              </Card.Content>
            </Card>
          </Pressable>
        ))}
      </>
    );
  }
}

export function VehicleSelector() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleAddNewPlatform = () => {
    // Close the drawer first by going back
    router.back();
    // Then navigate to the new platform screen
    setTimeout(() => {
      router.push('/(main)/newplatform');
    }, 100);
  };

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <ScrollView>
        <VehicleList />
        <Pressable onPress={handleAddNewPlatform}>
          <Card style={styles.container}>
            <Card.Content>
              <Text>{t('Add a new platform')}</Text>
            </Card.Content>
          </Card>
        </Pressable>
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: 150,
    borderColor: 'black',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
});