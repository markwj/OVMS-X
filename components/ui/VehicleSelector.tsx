import React, { useState, useRef } from "react";
import { Image, View, Pressable, ScrollView, StyleSheet } from "react-native";
import { router, useRouter } from "expo-router";
import { Text, Card, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedVehicle, getVehicles, Vehicle, vehiclesSlice } from "@/store/vehiclesSlice";

function VehicleList() {
  const vehicleList = useSelector(getVehicles);
  const dispatch = useDispatch();

  const onVehiclePress = (index : number) => {
    dispatch(vehiclesSlice.actions.updateSelectedVehicleIndex(index))
  }

  if (typeof vehicleList === 'undefined') {
    return null;
  } else {
    return (
      <>
        {vehicleList.map((vehicle: Vehicle, index: number) => (
          <Pressable
            key={"vehicle-" + vehicle.vin}
            onPress={() => { onVehiclePress(index) } }>
            <Card style={styles.container}>
              <Card.Content>
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

  const handleAddNewVehicle = () => {
    // Close the drawer first by going back
    router.back();
    // Then navigate to the new vehicle screen
    setTimeout(() => {
      router.push('/(main)/newvehicle');
    }, 100);
  };

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <ScrollView>
        <VehicleList />
        <Pressable onPress={handleAddNewVehicle}>
          <Card style={styles.container}>
            <Card.Content>
              <Text>Add a new vehicle</Text>
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