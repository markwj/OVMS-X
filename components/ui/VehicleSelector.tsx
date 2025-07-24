import React, { useState, useRef, RefObject } from "react";
import { Image, View, Pressable, ScrollView, StyleSheet } from "react-native";
import { router, useRouter } from "expo-router";
import { Text, Card, Button, IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedVehicle, selectionSlice,  } from "@/store/selectionSlice";
import {getVehicles, Vehicle, vehiclesSlice} from "@/store/vehiclesSlice"
import { useTranslation } from "react-i18next";
import { VehicleSideImage } from "@/components/ui/VehicleImages";
import { metricsSlice } from "@/store/metricsSlice";
import { SafeAreaProvider } from "react-native-safe-area-context";
interface VehicleSelectorProps {
  navigation?: any;
}

function VehicleList({ navigation }: { navigation?: any }) {
  const router = useRouter();
  const vehicleList = useSelector(getVehicles);
  const selectedVehicle = useSelector(getSelectedVehicle);
  const dispatch = useDispatch();

  console.log("[VehicleList] navigation", navigation);
  const onVehiclePress = (key: string) => {
    dispatch(metricsSlice.actions.clearAll());
    dispatch(selectionSlice.actions.selectVehicle(key));
    console.log("closing drawer with navigation", navigation);
    if (navigation) {
      navigation.closeDrawer();
    }
  }

  if (typeof vehicleList === 'undefined') {
    return null;
  } else {
    return (
      <>
        {vehicleList.map((vehicle: Vehicle, index: number) => (
          <Pressable
            key={`vehicle-${vehicle.key}`}
            onPress={() => { onVehiclePress(vehicle.key) }}>
            <Card
              style={styles.container}
              mode={selectedVehicle?.key === vehicle.key ? 'outlined' : 'elevated'}
              contentStyle={{
                opacity: selectedVehicle?.key === vehicle.key ? 1.0 : 0.5
              }}>
              <Card.Content>
                <VehicleSideImage image={vehicle.image} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 30 }}>
                  <Text style={{ alignSelf: "center" }}>{vehicle.name}</Text>
                  <View style={{ alignSelf: "center" }}>
                    <IconButton icon='pencil' size={20} onPress={() => { 
                      router.back();
                      setTimeout(() => {
                        router.push({ pathname: '/(main)/editvehicle', params: { vehicleKey: vehicle.key } }) 
                      }, 100);
                    }} />
                  </View>
                </View>
              </Card.Content>
            </Card>
          </Pressable>
        ))}
      </>
    );
  }
}

export function VehicleSelector({ navigation }: VehicleSelectorProps) {
  const router = useRouter();
  const { t } = useTranslation();

  console.log("[VehicleSelector] navigation", navigation);

  const handleAddNewPlatform = () => {
    // Close the drawer first by going back
    router.back();
    // Then navigate to the new platform screen
    setTimeout(() => {
      router.push('/(main)/newplatform');
    }, 100);
  };

  return (
    <SafeAreaProvider>
    <SafeAreaView style={{ height: '100%' }}>
      <ScrollView>
        <VehicleList navigation={navigation} />
        <Pressable onPress={handleAddNewPlatform}>
          <Card style={styles.container}>
            <Card.Content>
              <Text>{t('Add a new platform')}</Text>
            </Card.Content>
          </Card>
        </Pressable>
      </ScrollView>
    </SafeAreaView >
    </SafeAreaProvider>
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