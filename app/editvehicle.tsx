import React, { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next";
import { getVehicles, selectVehicle, Vehicle, vehiclesSlice } from "@/store/vehiclesSlice";
import { VehicleMapImage, VehicleSideImage, VehicleTopImage, VehicleTypes } from "@/components/ui/VehicleImages";
import ColorPicker from 'react-native-wheel-color-picker'
import { TextInput, Text, IconButton, useTheme } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown"
import { usePreventRemove } from "@react-navigation/native";
import { getSelectedVehicle, selectionSlice } from "@/store/selectionSlice";
import { store } from "@/store/root";
import { ConfirmationMessage } from "@/components/ui/ConfirmationMessage";
import * as FileSystem from "expo-file-system"

import * as ImagePicker from "expo-image-picker"
import { ConnectionDisplay } from "@/components/ui/ConnectionDisplay";

import { ImageData, ImageEditor } from "expo-dynamic-image-crop";

export default function EditVehicleScreen() {
  //@ts-ignore
  const { vehicleKey } = useLocalSearchParams<{ vehicleKey: string }>();
  const { t } = useTranslation();

  //@ts-ignore
  let vehicleImageNames = Object.keys(VehicleTypes).map((k) => { return { "key": t(VehicleTypes[k].name), "value": k } })
  vehicleImageNames = [...vehicleImageNames, { "key": "Use custom images", "value": "custom" }]

  const dispatch = useDispatch()
  const vehicle = useSelector(selectVehicle(vehicleKey))
  const theme = useTheme()

  const navigation = useNavigation();
  const { control, handleSubmit, watch } = useForm<Vehicle>({ defaultValues: vehicle ?? {} })
  const onSubmit: SubmitHandler<Vehicle> = async (data) => {
    dispatch(vehiclesSlice.actions.updateVehicleName({ key: vehicleKey, newValue: data.name }))
    const customPath = FileSystem.documentDirectory + "carimages/" + encodeURI(data.key)

    if (data.image.imageName != 'custom' && (await FileSystem.getInfoAsync(customPath)).exists) {
      console.log(`[EditVehicle] Removing images at ${customPath} due to custom being disabled`)
      await FileSystem.deleteAsync(customPath)
      data.image.customPath = null
    }

    dispatch(vehiclesSlice.actions.updateVehicleImage({ key: vehicleKey, newValue: data.image }))
  }

  const imageName = watch('image.imageName')
  let customImage = imageName == "custom"

  usePreventRemove(true, (d) => {
    handleSubmit(onSubmit)();
    navigation.dispatch(d.data.action)
  })

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("Edit") + " " + vehicle?.name,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon={"delete"} onPress={() => (
            ConfirmationMessage(
              t,
              () => {
                if (getSelectedVehicle(store.getState())?.key == vehicleKey) {
                  dispatch(selectionSlice.actions.unselectVehicle())
                }
                dispatch(vehiclesSlice.actions.removeVehicle(vehicleKey))

                const firstVehicleKey = getVehicles(store.getState())[0].key
                if (firstVehicleKey != null) {
                  dispatch(selectionSlice.actions.selectVehicle(firstVehicleKey))
                }

                router.back()
              },
              "Warning!",
              `Do you want to delete ${vehicle?.name ?? t("vehicle")}? This action cannot be undone.`,
              "Delete"
            )
          )} />
          <ConnectionDisplay />
        </View>
      )
    })
  }, [navigation, vehicle])

  const carImage = useWatch({ control, name: "image", defaultValue: vehicle?.image })

  type CroppingImageParams = {
    uri: string,
    aspectRatio: number,
    type: "side" | "top" | "map"
  }
  const [croppingImageParams, setCroppingImageParams] = useState<CroppingImageParams | null>(null)

  if (vehicle == null) { return <View style={styles.container}><Text>Could not find vehicle data</Text></View> }

  return (
    <View style={styles.container}>
      <View style={{ flexShrink: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}>
        <View style={{ flexShrink: 1, marginRight: '5%' }}>
          <Text variant="labelMedium" style={{ fontWeight: 'bold' }}>{t("Name")}: </Text>
        </View>
        <View style={{ flexGrow: 4 }}>
          <Controller
            control={control}
            name="name"
            rules={{ required: 'Required', maxLength: 30 }}
            render={({ field: { onChange, value = vehicle.name } }) => (
              <View style={{ alignItems: 'center' }}>
                <TextInput
                  value={value ?? ""}
                  onChangeText={(v: string) => {
                    onChange(v);
                  }}
                  clearButtonMode="always"
                  style={{ color: theme.colors.secondary, flexDirection: 'row', backgroundColor: theme.colors.surfaceVariant }}
                  dense={true}
                  placeholder="Name..."
                />
              </View>
            )}
          />
        </View>
      </View>
      <View style={{ flexShrink: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}>
        <View style={{ flexShrink: 1, marginRight: '5%' }}>
          <Text variant="labelMedium" style={{ fontWeight: 'bold' }}>{t("Type")}: </Text>
        </View>
        <View style={{ flexGrow: 4 }}>
          <Controller
            control={control}
            name="image.imageName"
            render={({ field: { onChange, value = vehicle.image.imageName } }) => (
              <Dropdown
                iconColor={theme.colors.onSurface}
                selectedTextStyle={{ color: theme.colors.onSurface }}
                itemTextStyle={{ color: theme.colors.onSurface }}
                containerStyle={{ backgroundColor: theme.colors.surfaceVariant }}
                itemContainerStyle={{ backgroundColor: theme.colors.surfaceVariant }}
                activeColor={theme.colors.surface}
                style={{ backgroundColor: theme.colors.surfaceVariant, padding: 10 }}
                data={vehicleImageNames.map((v) => { return { ...v, key: t(v.key) } })}
                onChange={(v) => onChange(v.value)}
                labelField={"key"} valueField={"value"}
                value={value}
              />
            )} />
        </View>
      </View>
      <View style={{ flexGrow: 1 }}>

        {!customImage &&
          <>
            <View style={{ flexShrink: 1, flexDirection: 'row', alignItems: 'flex-start', zIndex: 0 }}>
              <VehicleSideImage image={carImage} />
            </View>
            <View style={{ flexGrow: 1, padding: 40, paddingTop: 0 }}>
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
          </>
        }

        {customImage &&
          <View style={{ flexGrow: 1, flexDirection: 'column', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ borderWidth: 2, borderColor: 'grey', alignItems: 'center' }}
              onPress={async () => {
                const image = await pickImageAsync()
                if (image == null) { return }
                setCroppingImageParams({
                  uri: image,
                  aspectRatio: 654 / 302,
                  type: "side"
                })
              }}>
              <VehicleSideImage image={carImage} continuouslyPollSource={false}></VehicleSideImage>
              <Text variant="labelMedium" style={{ alignSelf: 'center' }}>{t("Side view")}</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>

              <View style={{ flex: 1 }}>
                <TouchableOpacity style={{ borderWidth: 2, borderColor: 'grey' }} onPress={async () => {
                  const image = await pickImageAsync()
                  if (image == null) { return }
                  setCroppingImageParams({
                    uri: image,
                    aspectRatio: 304 / 606,
                    type: "top"
                  })
                }}>
                  <VehicleTopImage image={carImage}></VehicleTopImage>
                  <Text style={{ alignSelf: 'center' }} variant="labelMedium">{t("Top view")}</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <TouchableOpacity style={{ borderWidth: 2, borderColor: 'grey' }} onPress={async () => {
                  const image = await pickImageAsync()
                  if (image == null) { return }
                  setCroppingImageParams({
                    uri: image,
                    aspectRatio: 1,
                    type: "map"
                  })
                }}>
                  <VehicleMapImage image={carImage}></VehicleMapImage>
                  <Text variant="labelMedium" style={{ alignSelf: 'center' }}>{t("Map icon")}</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        }

      </View>
      <Controller
        control={control}
        name="image.customPath"
        render={({ field: { onChange } }) => (
          <ImageEditor
            imageUri={croppingImageParams?.uri ?? ""}
            onEditingCancel={() => {
              setCroppingImageParams(null)
            }}
            onEditingComplete={async (data: ImageData) => {
              let customPath = await HandleAddCustomVehicleImage(vehicleKey, croppingImageParams?.type ?? "side", data.uri)
              onChange(customPath)
              setCroppingImageParams(null)
            }}
            fixedAspectRatio={croppingImageParams?.aspectRatio ?? 1}
            isVisible={croppingImageParams != null}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
  }
});

async function pickImageAsync() {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1
  })

  if (!result.canceled) {
    return result.assets[0].uri
  } else {
    console.log("[EditVehicle] Cancelled adding custom image")
    return null
  }
}

async function HandleAddCustomVehicleImage(vehicleKey: string, type: "side" | "top" | "map", image: string) {
  const customPath = FileSystem.documentDirectory + "carimages/" + encodeURI(vehicleKey)
  const pathToWriteTo = customPath + "/" + type

  //Get uploaded image
  /*const image = await pickImageAsync()*/

  if (image == null) { return null }

  //Handle CarImages directory
  const carImagesDirectoryInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "carimages/")
  if (!carImagesDirectoryInfo.exists) {
    console.log(`[EditVehicle] Creating directory carImages at ${FileSystem.documentDirectory}`)
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "carimages")
  }

  //Handle vehicle directory
  const vehicleDirectory = await FileSystem.getInfoAsync(customPath)
  if (!vehicleDirectory.exists) {
    console.log(`[EditVehicle] Creating directory for vehicle ${vehicleKey} at ${customPath}`)
    await FileSystem.makeDirectoryAsync(customPath)
  }

  //Overwrite existing file
  const fileAlreadyAtPathInfo = await FileSystem.getInfoAsync(pathToWriteTo)
  if (fileAlreadyAtPathInfo.exists) {
    console.log(`[EditVehicle] Removing already existing file at ${pathToWriteTo} to add new image`)
    FileSystem.deleteAsync(pathToWriteTo)
  }

  //Write file
  console.log(`[EditVehicle] Copying file at URI ${image} to custom path ${pathToWriteTo}`)
  await FileSystem.copyAsync({ from: image, to: pathToWriteTo })

  return customPath
}