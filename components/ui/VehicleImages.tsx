import React from "react"
import { ImageBackground, View, Image } from "react-native"
import { VehicleImage } from "@/store/vehiclesSlice"

const DEFAULT_IMAGE_NAME = "roadster"

export const VehicleTypes = {
  'ampera': {
    name: 'Opel Ampera-e',
    side: require('@/assets/carimages/ampera_side_base.png'),
    sideMask: require('@/assets/carimages/ampera_side_mask.png'),
    top: require('@/assets/carimages/ampera_top_base.png'),
    topMask: require('@/assets/carimages/ampera_top_mask.png'),
    map: require('@/assets/carimages/ampera_map_base.png'),
    mapMask: require('@/assets/carimages/ampera_map_mask.png')
  },
  'roadster': {
    name: 'Tesla Roadster (2008-2012)',
    side: require('@/assets/carimages/roadster_side_base.png'),
    sideMask: require('@/assets/carimages/roadster_side_mask.png'),
    top: require('@/assets/carimages/roadster_top_base.png'),
    topMask: require('@/assets/carimages/roadster_top_mask.png'),
    map: require('@/assets/carimages/roadster_map_base.png'),
    mapMask: require('@/assets/carimages/roadster_map_mask.png')
  },
  'thinkcity': {
    name: 'Think City',
    side: require('@/assets/carimages/thinkcity_side_base.png'),
    sideMask: require('@/assets/carimages/thinkcity_side_mask.png'),
    top: require('@/assets/carimages/thinkcity_top_base.png'),
    topMask: require('@/assets/carimages/thinkcity_top_mask.png'),
    map: require('@/assets/carimages/thinkcity_map_base.png'),
    mapMask: require('@/assets/carimages/thinkcity_map_mask.png')
  },
  'twizy': {
    name: 'Renault Twizy',
    side: require('@/assets/carimages/twizy_side_base.png'),
    sideMask: require('@/assets/carimages/twizy_side_mask.png'),
    top: require('@/assets/carimages/twizy_top_base.png'),
    topMask: require('@/assets/carimages/twizy_top_mask.png'),
    map: require('@/assets/carimages/twizy_map_base.png'),
    mapMask: require('@/assets/carimages/twizy_map_mask.png')
  },
  'volt': {
    name: 'Chevrolet Volt',
    side: require('@/assets/carimages/volt_side_base.png'),
    sideMask: require('@/assets/carimages/volt_side_mask.png'),
    top: require('@/assets/carimages/volt_top_base.png'),
    topMask: require('@/assets/carimages/volt_top_mask.png'),
    map: require('@/assets/carimages/volt_map_base.png'),
    mapMask: require('@/assets/carimages/volt_map_mask.png')
  }
}

export function VehicleSideImage({ image }: { image: VehicleImage }): React.JSX.Element {
  const ASPECT_RATIO = 654 / 302

  if (image == null) { return (<View></View>); }

  return (
    //@ts-ignore
    <ImageBackground style={{ aspectRatio: ASPECT_RATIO, flex: 1 }} resizeMode="contain" source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].side}>
      <Image
        style={{
          aspectRatio: ASPECT_RATIO,
          flex: 1,
          resizeMode: "contain",
          tintColor: image.tintColor ?? "#fff",
          mixBlendMode: 'color-burn'
        }}
        //@ts-ignore
        source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].sideMask}
      />
    </ImageBackground>
  )
}

export function VehicleTopImage({ image }: { image: VehicleImage }): React.JSX.Element {
  const ASPECT_RATIO = 304 / 606

  return (
    //@ts-ignore
    <ImageBackground style={{ aspectRatio: ASPECT_RATIO, flex: 1 }} resizeMode="contain" source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].top}>
      <Image
        style={{
          aspectRatio: ASPECT_RATIO,
          flex: 1,
          resizeMode: "contain",
          tintColor: image.tintColor ?? "#fff",
          mixBlendMode: 'color-burn'
        }}
        //@ts-ignore
        source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].topMask}
      />
    </ImageBackground>
  )
}

export function VehicleMapImage({ image }: { image: VehicleImage }): React.JSX.Element {
  const ASPECT_RATIO = 96 / 96

  return (
    //@ts-ignore
    <ImageBackground style={{ aspectRatio: ASPECT_RATIO, flex: 1 }} resizeMode="contain" source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].map}>
      <Image
        style={{
          aspectRatio: ASPECT_RATIO,
          flex: 1,
          resizeMode: "contain",
          tintColor: image.tintColor ?? "#fff",
          mixBlendMode: 'color-burn'
        }}
        //@ts-ignore
        source={VehicleTypes[image.imageName ?? DEFAULT_IMAGE_NAME].mapMask}
      />
    </ImageBackground>
  )
}