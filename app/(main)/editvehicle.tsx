import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from 'react-native';
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next";
import { generateFindVehicleSelector, Vehicle, vehiclesSlice } from "@/store/vehiclesSlice";
import { VehicleSideImage, VehicleTypes } from "@/components/ui/VehicleImages";
import ColorPicker from 'react-native-wheel-color-picker'
import { useTheme, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown"
import { usePreventRemove } from "@react-navigation/native";

export default function EditVehicleScreen() {
  //@ts-ignore
  const { vehicleKey } = useLocalSearchParams<{ vehicleKey: string }>();
  const { t } = useTranslation();

  //@ts-ignore
  let vehicleImageNames = Object.keys(VehicleTypes).map((k) => { return { "key": t(VehicleTypes[k].name), "value": k } })

  const dispatch = useDispatch()
  const vehicle = useSelector(generateFindVehicleSelector(vehicleKey))

  const navigation = useNavigation();

  const theme = useTheme()

  useEffect(() => {
    navigation.setOptions({
      title: t("Edit") + " " + vehicle?.name,
    })
  }, [navigation])

  const { control, handleSubmit } = useForm<Vehicle>({ defaultValues: vehicle ?? {} })
  const onSubmit: SubmitHandler<Vehicle> = (data) => {
    dispatch(vehiclesSlice.actions.updateVehicleImage({ key: vehicleKey, newValue: data.image }))
    dispatch(vehiclesSlice.actions.updateVehicleName({ key: vehicleKey, newValue: data.name }))
    navigation.setOptions({
      title: t("Edit") + " " + data?.name,
    })
  }

  usePreventRemove(true, (d) => {
    handleSubmit(onSubmit)();
    navigation.dispatch(d.data.action)
  })

  const carImage = useWatch({ control, name: "image", defaultValue: vehicle?.image })

  if (vehicle == null) { return <View style={styles.container}><Text>Could not find vehicle data</Text></View> }

  return (
    <View style={{ ...styles.container, marginBottom: 50 }}>
      <View style={{ flexDirection: 'row', padding: 20, alignItems: 'center' }}>
        <Text style={{ color: theme.colors.secondary, marginRight: '5%', fontSize: 15, fontWeight: 'bold' }}>Name: </Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'Required', maxLength: 30 }}
          render={({ field: { onChange, value = vehicle.name } }) => (
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
              <TextInput
                value={value ?? ""}
                onChangeText={(v) => {
                  onChange(v); 
                  navigation.setOptions({
                    title: t("Edit") + " " + v,
                  })
                }}
                style={{ color: 'white', width: '90%', backgroundColor: 'grey' }}
                dense={true}
                placeholder="Name..."
              />
            </View>
          )}
        />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', padding: 20, paddingTop: 0 }}>
        <VehicleSideImage image={carImage} />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Controller
          control={control}
          name="image.imageName"
          render={({ field: { onChange, value = vehicle.image.imageName } }) => (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', padding: 20, marginTop: 20 }}>
              <Dropdown
                iconColor='white'
                selectedTextStyle={{ color: 'white' }}
                itemTextStyle={{ color: 'white' }}
                containerStyle={{ backgroundColor: 'grey' }}
                itemContainerStyle={{ backgroundColor: 'grey' }}
                activeColor="darkgray"
                style={{ width: '80%', alignContent: 'center', backgroundColor: 'grey', borderColor: 'black', borderWidth: 2, padding: 20 }}
                data={vehicleImageNames}
                onChange={(v) => onChange(v.value)}
                labelField={"key"} valueField={"value"}
                value={value}
              />
            </View>
          )}
        />
      </View>
      <View style={{ flex: 3, flexDirection: 'row', padding: 40, paddingTop: 0 }}>
        <Controller
          control={control}
          name="image.tintColor"
          render={({ field: { onChange, value = vehicle.image.tintColor } }) => (
            <ColorPicker
              color={value ?? "#ffffff"}
              palette={['#ffffff', '#bababa', '#888888', '#282828', '#fc574b', '#f99500', '#fce00c', '#00ff50', '#5480e5', "#cb6ee5", "#f95eb6"]}
              //@ts-ignore
              onColorChangeComplete={(color) => { onChange(color); }}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'flex-start'
  },
});

