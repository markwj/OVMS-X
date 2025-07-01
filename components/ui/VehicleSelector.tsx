import React, { useState, useRef } from "react";
import { Image, View, Pressable, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Text, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector, useAppDispatch } from '@/hooks/store';

function VehicleList() {
  const vehicleList = useAppSelector((state) => state.vehicles.vehicles);
  console.log('[VehicleList] list is', vehicleList);
  if (typeof vehicleList === 'undefined') {
    return null;
  } else {
    return (
      <>
        {vehicleList.map((vehicle, index) => (
          <Pressable
            key={"vehicle-" + vehicle.vin}
            onPress={() => { console.log('press', vehicle) }}>
            <Card style={styles.container}>
              <Card.Content>
                <Text>Vehicle #{vehicle.vin}</Text>
              </Card.Content>
            </Card>
          </Pressable>
        ))}
      </>
    );
  }
}

export function VehicleSelector() {
  const vehicleList = useAppSelector((state) => state.vehicles.vehicles);

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <ScrollView>
        <VehicleList />
        <Pressable onPress={() => { router.push('/(subscreens)/newvehicle') }}>
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