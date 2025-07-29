import React, { useState, useRef, RefObject } from "react";
import { Image, View, Pressable, ScrollView, StyleSheet } from "react-native";
import { router, useRouter } from "expo-router";
import { Text, Card, Button, IconButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedVehicle, selectionSlice, } from "@/store/selectionSlice";
import { getVehicles, Vehicle, vehiclesSlice } from "@/store/vehiclesSlice"
import { useTranslation } from "react-i18next";
import { VehicleSideImage } from "@/components/ui/VehicleImages";
import { metricsSlice } from "@/store/metricsSlice";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface VehicleSelectorProps {
  setDrawerOpen?: (open: boolean) => void;
  headerHeight: number;
}

function VehicleList({ setDrawerOpen }: { setDrawerOpen?: (open: boolean) => void }) {
  const router = useRouter();
  const vehicleList = useSelector(getVehicles);
  const selectedVehicle = useSelector(getSelectedVehicle);
  const dispatch = useDispatch();

  const onVehiclePress = (key: string) => {
    dispatch(metricsSlice.actions.clearAll());
    dispatch(selectionSlice.actions.selectVehicle(key));
    if (setDrawerOpen) { setDrawerOpen(false); }
  }

  if (typeof vehicleList === 'undefined') {
    return null;
  } else {
    return (
      <>
        {vehicleList.map((vehicle: Vehicle, index: number) => (
          <Card
            key={`vehicle-${vehicle.key}`}
            style={styles.container}
            mode={selectedVehicle?.key === vehicle.key ? 'outlined' : 'elevated'}
            contentStyle={{
              opacity: selectedVehicle?.key === vehicle.key ? 1.0 : 0.5
            }}>
            <Card.Content>
              <Pressable
                onPress={() => { onVehiclePress(vehicle.key) }}>
                <VehicleSideImage image={vehicle.image} />
              </Pressable>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 30 }}>
                <Text style={{ alignSelf: "center" }}>{vehicle.name}</Text>
                <View style={{ alignSelf: "center" }}>
                  {selectedVehicle?.key == vehicle.key && (
                    <IconButton
                      icon='pencil'
                      size={20} onPress={() => {
                        if (setDrawerOpen) { setDrawerOpen(false); }
                        setTimeout(() => {
                          router.push({ pathname: '/editvehicle', params: { vehicleKey: vehicle.key } })
                        }, 100);
                      }} />
                  )}
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </>
    );
  }
}

export function VehicleSelector({ setDrawerOpen, headerHeight }: VehicleSelectorProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleAddNewPlatform = () => {
    if (setDrawerOpen) { setDrawerOpen(false); }
    setTimeout(() => {
      router.push('/newplatform');
    }, 100);
  };

  return (
      <View style={{ height: '100%' }}>
        <ScrollView
          contentContainerStyle={{ paddingTop: headerHeight }}
        >
          <VehicleList setDrawerOpen={setDrawerOpen} />
          <Pressable onPress={handleAddNewPlatform}>
            <Card style={styles.container}>
              <Card.Content>
                <Text>{t('Add a new platform')}</Text>
              </Card.Content>
            </Card>
          </Pressable>
        </ScrollView>
      </View >
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