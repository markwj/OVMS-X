import React, { useEffect, useState } from "react"
import { ImageBackground, View, Image, StyleSheet } from "react-native"
import { VehicleImage } from "@/store/vehiclesSlice"
import { GetCurrentUTCTimeStamp } from "../utils/datetime"
import * as FileSystem from "expo-file-system"

const DEFAULT_IMAGE_NAME = "roadster"

export const VehicleTypes = {
  'ampera': {
    name: 'Opel Ampera-e',
    types: ['VA'],
    side: require('@/assets/carimages/opel_ampera_side_base.png'),
    sideMask: require('@/assets/carimages/opel_ampera_side_mask.png'),
    top: require('@/assets/carimages/opel_ampera_top_base.png'),
    topMask: require('@/assets/carimages/opel_ampera_top_mask.png'),
    map: require('@/assets/carimages/opel_ampera_map_base.png'),
    mapMask: require('@/assets/carimages/opel_ampera_map_mask.png')
  },
  'roadster': {
    name: 'Tesla Roadster (2008-2012)',
    types: ['TR', 'TR1N', 'TR2N', 'TR2S'],
    side: require('@/assets/carimages/tesla_roadster_classic_side_base.png'),
    sideMask: require('@/assets/carimages/tesla_roadster_classic_side_mask.png'),
    top: require('@/assets/carimages/tesla_roadster_classic_top_base.png'),
    topMask: require('@/assets/carimages/tesla_roadster_classic_top_mask.png'),
    map: require('@/assets/carimages/tesla_roadster_classic_map_base.png'),
    mapMask: require('@/assets/carimages/tesla_roadster_classic_map_mask.png')
  },
  'thinkcity': {
    name: 'Think City',
    types: ['TGTC'],
    side: require('@/assets/carimages/think_city_side_base.png'),
    sideMask: require('@/assets/carimages/think_city_side_mask.png'),
    top: require('@/assets/carimages/think_city_top_base.png'),
    topMask: require('@/assets/carimages/think_city_top_mask.png'),
    map: require('@/assets/carimages/think_city_map_base.png'),
    mapMask: require('@/assets/carimages/think_city_map_mask.png')
  },
  'twizy': {
    name: 'Renault Twizy',
    types: ['RT'],
    side: require('@/assets/carimages/renault_twizy_side_base.png'),
    sideMask: require('@/assets/carimages/renault_twizy_side_mask.png'),
    top: require('@/assets/carimages/renault_twizy_top_base.png'),
    topMask: require('@/assets/carimages/renault_twizy_top_mask.png'),
    map: require('@/assets/carimages/renault_twizy_map_base.png'),
    mapMask: require('@/assets/carimages/renault_twizy_map_mask.png')
  },
  'volt': {
    name: 'Chevrolet Volt',
    types: ['VA'],
    side: require('@/assets/carimages/chevy_volt_side_base.png'),
    sideMask: require('@/assets/carimages/chevy_volt_side_mask.png'),
    top: require('@/assets/carimages/chevy_volt_top_base.png'),
    topMask: require('@/assets/carimages/chevy_volt_top_mask.png'),
    map: require('@/assets/carimages/chevy_volt_map_base.png'),
    mapMask: require('@/assets/carimages/chevy_volt_map_mask.png')
  },
  'default': {
    name: 'Default',
    types: [],
    side: require('@/assets/carimages/default_side_base.png'),
    sideMask: require('@/assets/carimages/default_side_mask.png'),
    top: require('@/assets/carimages/default_top_base.png'),
    topMask: require('@/assets/carimages/default_top_mask.png'),
    map: require('@/assets/carimages/default_map_base.png'),
    mapMask: require('@/assets/carimages/default_map_mask.png')
  },
}

const undefinedCarImages = {
  side: require('@/assets/carimages/undefined_car_side.png'),
  top: require('@/assets/carimages/undefined_car_top.png'),
  map: require('@/assets/carimages/undefined_car_map.png'),
}

export const GetVehicleName = (type: string) => {
  for (const obj in VehicleTypes) {
    //@ts-ignore
    if (VehicleTypes[obj].types.includes(type)) {
      //@ts-ignore
      return VehicleTypes[obj].name
    }
  }

  return null
}

export function VehicleSideImage({ image }: { image: VehicleImage, continuouslyPollSource?: boolean }): React.JSX.Element {
  const ASPECT_RATIO = 654 / 302

  const [customVehicleImageSource, setCustomVehicleImageSource] = useState(undefinedCarImages.side)

  if (image == null) { return (<View></View>); }

  const getCustomImageSource = async () => {
    if ((await FileSystem.getInfoAsync(image.customPath + "/side")).exists) {
      setCustomVehicleImageSource({ uri: image.customPath + "/side?timestamp=" + encodeURI(GetCurrentUTCTimeStamp()) })
    } else {
      setCustomVehicleImageSource(undefinedCarImages.side)
    }
  }

  useEffect(() => {
    if (image.imageName == "custom") {
      getCustomImageSource()
    } 
  }, [image])

  if (image.imageName == "custom") {

    return (<Image
      style={{
        aspectRatio: ASPECT_RATIO,
        width: "100%",
        height: undefined,
      }}
      resizeMode="contain"
      source={customVehicleImageSource}
      defaultSource={undefinedCarImages.side}
    />);
  }

  return (
    //@ts-ignore
    <ImageBackground imageStyle={{ width: '100%', height: undefined, resizeMode: 'contain', zIndex: -3 }} style={{ aspectRatio: ASPECT_RATIO, width: "100%", height: undefined }} source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].side}>
      {/* @ts-ignore */}
      <ImageBackground imageStyle={{ width: '100%', height: undefined, resizeMode: 'contain', zIndex: -2 }} style={{ aspectRatio: ASPECT_RATIO, width: "100%", height: undefined }} source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].sideMask}>
        <Image
          style={{
            aspectRatio: ASPECT_RATIO,
            width: "100%",
            height: undefined,
            tintColor: image.tintColor ?? "#fff",
            //@ts-ignore
            mixBlendMode: 'color-burn',
            zIndex: -1
          }}
          resizeMode="contain"
          //@ts-ignore
          source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].sideMask}
        />
      </ImageBackground>
    </ImageBackground>
  )
}

export function VehicleTopImage({ image }: { image: VehicleImage }): React.JSX.Element {
  const ASPECT_RATIO = 304 / 606

  const [customVehicleImageSource, setCustomVehicleImageSource] = useState(undefinedCarImages.top)

  if (image == null) { return (<View></View>); }

  const getCustomImageSource = async () => {
    if ((await FileSystem.getInfoAsync(image.customPath + "/top")).exists) {
      setCustomVehicleImageSource({ uri: image.customPath + "/top?timestamp=" + encodeURI(GetCurrentUTCTimeStamp()) })
    } else {
      setCustomVehicleImageSource(undefinedCarImages.top)
    }
  }

  useEffect(() => {
    if (image.imageName == "custom") {
      getCustomImageSource()
    } 
  }, [image])

  if (image.imageName == "custom") {

    return (<Image
      style={{
        aspectRatio: ASPECT_RATIO,
        width: "100%",
        height: undefined,
      }}
      resizeMode="contain"
      source={customVehicleImageSource}
      defaultSource={undefinedCarImages.top}
    />);
  }

  return (
    //@ts-ignore
    <ImageBackground imageStyle={{ width: '100%', height: undefined, resizeMode: 'contain', zIndex: -3 }} style={{ width: '100%', height: undefined, aspectRatio: ASPECT_RATIO }} source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].top}>
      {/* @ts-ignore */}
      <ImageBackground imageStyle={{ width: '100%', height: undefined, resizeMode: 'contain', zIndex: -2 }} style={{ width: '100%', height: undefined, aspectRatio: ASPECT_RATIO }} source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].topMask}>
        <Image
          style={{
            width: '100%', height: undefined,
            aspectRatio: ASPECT_RATIO,
            resizeMode: "contain",
            tintColor: image.tintColor ?? "#fff",
            //@ts-ignore
            mixBlendMode: 'color-burn',
            zIndex: -1
          }}
          //@ts-ignore
          source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].topMask}
        />
      </ImageBackground>
    </ImageBackground>
  )
}

export function VehicleMapImage({ image }: { image: VehicleImage }): React.JSX.Element {
  const ASPECT_RATIO = 96 / 96

  const [customVehicleImageSource, setCustomVehicleImageSource] = useState(undefinedCarImages.top)

  if (image == null) { return (<View></View>); }

  const getCustomImageSource = async () => {
    if ((await FileSystem.getInfoAsync(image.customPath + "/map")).exists) {
      setCustomVehicleImageSource({ uri: image.customPath + "/map?timestamp=" + encodeURI(GetCurrentUTCTimeStamp()) })
    } else {
      setCustomVehicleImageSource(undefinedCarImages.map)
    }
  }

  useEffect(() => {
    if (image.imageName == "custom") {
      getCustomImageSource()
    } 
  }, [image])

  if (image.imageName == "custom") {

    return (<Image
      style={{
        aspectRatio: ASPECT_RATIO,
        width: "100%",
        height: undefined,
      }}
      resizeMode="contain"
      source={customVehicleImageSource}
      defaultSource={undefinedCarImages.map}
    />);
  }

  return (
    //@ts-ignore
    <ImageBackground imageStyle={{ width: '100%', height: undefined, resizeMode: 'contain' }} style={{ width: '100%', height: undefined, aspectRatio: ASPECT_RATIO }} source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].map}>
      {/* @ts-ignore */}
      <ImageBackground imageStyle={{ width: '100%', height: undefined, resizeMode: 'contain' }} style={{ width: '100%', height: undefined, aspectRatio: ASPECT_RATIO }} source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].mapMask}>
        <Image
          style={{
            width: '100%',
            height: undefined,
            aspectRatio: ASPECT_RATIO,
            resizeMode: "contain",
            tintColor: image.tintColor ?? "#fff",
            //@ts-ignore
            mixBlendMode: 'color-burn'
          }}
          //@ts-ignore
          source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].mapMask}
        />
      </ImageBackground>
    </ImageBackground>
  )
}