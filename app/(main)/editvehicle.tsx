import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { router, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next";
import { getVehicles, selectVehicle, Vehicle, vehiclesSlice } from "@/store/vehiclesSlice";
import { VehicleMapImage, VehicleSideImage, VehicleTopImage, VehicleTypes } from "@/components/ui/VehicleImages";
import ColorPicker from 'react-native-wheel-color-picker'
import { TextInput, Text, IconButton } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown"
import { usePreventRemove } from "@react-navigation/native";
import { getSelectedVehicle, selectionSlice } from "@/store/selectionSlice";
import { store } from "@/store/root";
import { ConfirmationMessage } from "@/components/ui/ConfirmationMessage";
import * as FileSystem from "expo-file-system"

import * as ImagePicker from "expo-image-picker"
import { ImageData, ImageEditor } from "expo-dynamic-image-crop";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditVehicleScreen() {
  //@ts-ignore
  const { vehicleKey } = useLocalSearchParams<{ vehicleKey: string }>();
  const { t } = useTranslation();

  //@ts-ignore
  let vehicleImageNames = Object.keys(VehicleTypes).map((k) => { return { "key": t(VehicleTypes[k].name), "value": k } })
  vehicleImageNames = [...vehicleImageNames, { "key": "Use custom images", "value": "custom" }]

  const dispatch = useDispatch()
  const vehicle = useSelector(selectVehicle(vehicleKey))

  const navigation = useNavigation();
  const { control, handleSubmit, watch } = useForm<Vehicle>({ defaultValues: vehicle ?? {} })
  const onSubmit: SubmitHandler<Vehicle> = async (data) => {
    dispatch(vehiclesSlice.actions.updateVehicleName({ key: vehicleKey, newValue: data.name }))
    navigation.setOptions({
      title: t("Edit") + " " + data?.name,
    })

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

  const carImage = useWatch({ control, name: "image", defaultValue: vehicle?.image })

  type CroppingImageParams = {
    uri: string,
    aspectRatio: number,
    type: "side" | "top" | "map"
  }
  const [croppingImageParams, setCroppingImageParams] = useState<CroppingImageParams | null>(null)

  if (vehicle == null) { return <View style={styles.container}><Text>Could not find vehicle data</Text></View> }

  console.log(vehicle.image)

  return (
    <View style={styles.container}>
      <View style={{ flexShrink: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}>
        <View style={{ flexShrink: 1, marginRight: '5%' }}>
          <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Name: </Text>
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
                    navigation.setOptions({
                      title: t("Edit") + " " + v,
                    })
                  }}
                  style={{ color: 'white', flexDirection: 'row', backgroundColor: 'dimgrey' }}
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
          <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Type: </Text>
        </View>
        <View style={{ flexGrow: 4 }}>
          <Controller
            control={control}
            name="image.imageName"
            render={({ field: { onChange, value = vehicle.image.imageName } }) => (
              <Dropdown
                iconColor='white'
                selectedTextStyle={{ color: 'white' }}
                itemTextStyle={{ color: 'white' }}
                containerStyle={{ backgroundColor: 'grey' }}
                itemContainerStyle={{ backgroundColor: 'grey' }}
                activeColor="dimgrey"
                style={{ backgroundColor: 'dimgrey', borderColor: 'black', borderWidth: 2, padding: 10 }}
                data={vehicleImageNames}
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
              style={{ borderWidth: 2, borderColor: 'white', alignItems: 'center' }}
              onPress={async () => {
                const image = await pickImageAsync()
                if (image == null) { return }
                setCroppingImageParams({
                  uri: image,
                  aspectRatio: 654 / 302,
                  type: "side"
                })
              }}>
              <VehicleSideImage image={carImage}></VehicleSideImage>
              <Text variant="labelMedium" style={{ alignSelf: 'center' }}>Side view</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>

              <View style={{ flex: 1 }}>
                <TouchableOpacity style={{ borderWidth: 2, borderColor: 'white' }} onPress={async () => {
                  const image = await pickImageAsync()
                  if (image == null) { return }
                  setCroppingImageParams({
                    uri: image,
                    aspectRatio: 304 / 606,
                    type: "top"
                  })
                }}>
                  <VehicleTopImage image={carImage}></VehicleTopImage>
                  <Text variant="labelMedium">Top view</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1 }}>
                <TouchableOpacity style={{ borderWidth: 2, borderColor: 'white' }} onPress={async () => {
                  const image = await pickImageAsync()
                  if (image == null) { return }
                  setCroppingImageParams({
                    uri: image,
                    aspectRatio: 1,
                    type: "map"
                  })
                }}>
                  <VehicleMapImage image={carImage}></VehicleMapImage>
                  <Text variant="labelMedium" style={{ alignSelf: 'center' }}>Map icon</Text>
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

      <Stack.Screen options={{
        title: t("Edit") + " " + vehicle?.name,
        headerRight: () => (
          <IconButton icon={"delete"} onPress={() => (
            ConfirmationMessage(
              () => {
                if (getSelectedVehicle(store.getState())?.key == vehicleKey) {
                  dispatch(selectionSlice.actions.unselectVehicle())
                }
                dispatch(vehiclesSlice.actions.removeVehicle(vehicleKey))

                const firstVehicleKey = getVehicles(store.getState())[0].key
                if(firstVehicleKey != null) {
                  dispatch(selectionSlice.actions.selectVehicle(firstVehicleKey))
                }

                router.back()
              },
              "Warning!",
              `Do you want to delete ${vehicle.name}? This action cannot be undone.`,
              "Delete"
            )
          )} />
        )
      }} />
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



/*
      {!customImage &&
        <View style={{ flex: 1, flexDirection: 'row', padding: 20, paddingTop: 0, marginBottom: 20 }}>
          <VehicleSideImage image={carImage} />
        </View>
      }

      {!customImage &&
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
      }

      {customImage &&
        <View style={{ flex: 4, flexDirection: 'column', padding: 20, paddingTop: 0, alignItems: 'center' }}>
          <TouchableOpacity
            style={{ borderWidth: 2, borderColor: 'white', alignItems: 'center' }}
            onPress={async () => {
              const image = await pickImageAsync()
              if (image == null) { return }
              setCroppingImageParams({
                uri: image,
                aspectRatio: 654 / 302,
                type: "side"
              })
            }}>
            <VehicleSideImage image={carImage}></VehicleSideImage>
            <Text variant="labelMedium" style={{ alignSelf: 'center' }}>Side view</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', flex: 1, width: '100%' }}>

            <View style={{ flex: 1 }}>
              <TouchableOpacity style={{ borderWidth: 2, borderColor: 'white' }} onPress={async () => {
                const image = await pickImageAsync()
                if (image == null) { return }
                setCroppingImageParams({
                  uri: image,
                  aspectRatio: 304 / 606,
                  type: "top"
                })
              }}>
                <VehicleTopImage image={carImage}></VehicleTopImage>
                <Text variant="labelMedium">Top view</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 2 }}>
              <TouchableOpacity style={{ borderWidth: 2, borderColor: 'white' }} onPress={async () => {
                const image = await pickImageAsync()
                if (image == null) { return }
                setCroppingImageParams({
                  uri: image,
                  aspectRatio: 1,
                  type: "map"
                })
              }}>
                <VehicleMapImage image={carImage}></VehicleMapImage>
                <Text variant="labelMedium" style={{ alignSelf: 'center' }}>Map icon</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      }

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

      <Stack.Screen options={{
        title: t("Edit") + " " + vehicle?.name,
        headerRight: () => (
          <IconButton icon={"delete"} onPress={() => (
            ConfirmationMessage(
              () => {
                if (getSelectedVehicle(store.getState())?.key == vehicleKey) {
                  dispatch(selectionSlice.actions.unselectVehicle())
                }
                dispatch(vehiclesSlice.actions.removeVehicle(vehicleKey))
                router.back()
              },
              "Warning!",
              `Do you want to delete ${vehicle.name}? This action cannot be undone.`,
              "Delete"
            )
          )} />
        )
      }} />
*/