import React, { useEffect, useState } from "react"
import { ImageBackground, View, Image, StyleSheet } from "react-native"
import { VehicleImage } from "@/store/vehiclesSlice"
import { GetCurrentUTCTimeStamp } from "../utils/datetime"
import * as FileSystem from "expo-file-system"

const DEFAULT_IMAGE_NAME = "default"

export const VehicleTypes = {
  'bmw-i3': {
    name: 'BMW i3',
    types: {
      'BMWI3': 'BMW i3'
    },
    side: require('@/assets/carimages/bmw_i3_side_base.png'),
    sideMask: require('@/assets/carimages/bmw_i3_side_mask.png'),
    top: require('@/assets/carimages/bmw_i3_top_base.png'),
    topMask: require('@/assets/carimages/bmw_i3_top_mask.png'),
    map: require('@/assets/carimages/bmw_i3_map_base.png'),
    mapMask: require('@/assets/carimages/bmw_i3_map_mask.png')
  },
  'chevy-boltev': {
    name: 'Chevy Bolt EV',
    types: {
      'CBOLTEV': 'Chevy Bolt EV'
    },
    side: require('@/assets/carimages/chevy_boltev_side_base.png'),
    sideMask: require('@/assets/carimages/chevy_boltev_side_mask.png'),
    top: require('@/assets/carimages/chevy_boltev_top_base.png'),
    topMask: require('@/assets/carimages/chevy_boltev_top_mask.png'),
    map: require('@/assets/carimages/chevy_boltev_map_base.png'),
    mapMask: require('@/assets/carimages/chevy_boltev_map_mask.png')
  },
  'chevy-volt': {
    name: 'Chevrolet Volt',
    types: {
      'VA': 'Chevrolet Volt'
    },
    side: require('@/assets/carimages/chevy_volt_side_base.png'),
    sideMask: require('@/assets/carimages/chevy_volt_side_mask.png'),
    top: require('@/assets/carimages/chevy_volt_top_base.png'),
    topMask: require('@/assets/carimages/chevy_volt_top_mask.png'),
    map: require('@/assets/carimages/chevy_volt_map_base.png'),
    mapMask: require('@/assets/carimages/chevy_volt_map_mask.png')
  },
  'default': {
    name: 'Default',
    types: {},
    side: require('@/assets/carimages/default_side_base.png'),
    sideMask: require('@/assets/carimages/default_side_mask.png'),
    top: require('@/assets/carimages/default_top_base.png'),
    topMask: require('@/assets/carimages/default_top_mask.png'),
    map: require('@/assets/carimages/default_map_base.png'),
    mapMask: require('@/assets/carimages/default_map_mask.png')
  },
  'fiat-500e': {
    name: 'Fiat 500e',
    types: {
      'FT5E': 'Fiat 500e'
    },
    side: require('@/assets/carimages/fiat_500e_side_base.png'),
    sideMask: require('@/assets/carimages/fiat_500e_side_mask.png'),
    top: require('@/assets/carimages/fiat_500e_top_base.png'),
    topMask: require('@/assets/carimages/fiat_500e_top_mask.png'),
    map: require('@/assets/carimages/fiat_500e_map_base.png'),
    mapMask: require('@/assets/carimages/fiat_500e_map_mask.png')
  },
  'hyundai-ioniq5': {
    name: 'Hyundai Ioniq 5',
    types: {
      'I5': 'Hyundai Ioniq 5'
    },
    side: require('@/assets/carimages/hyundai_ioniq5_side_base.png'),
    sideMask: require('@/assets/carimages/hyundai_ioniq5_side_mask.png'),
    top: require('@/assets/carimages/hyundai_ioniq5_top_base.png'),
    topMask: require('@/assets/carimages/hyundai_ioniq5_top_mask.png'),
    map: require('@/assets/carimages/hyundai_ioniq5_map_base.png'),
    mapMask: require('@/assets/carimages/hyundai_ioniq5_map_mask.png')
  },
  'hyundai-kona': {
    name: 'Hyundai Kona',
    types: {
    },
    side: require('@/assets/carimages/hyundai_kona_side_base.png'),
    sideMask: require('@/assets/carimages/hyundai_kona_side_mask.png'),
    top: require('@/assets/carimages/hyundai_kona_top_base.png'),
    topMask: require('@/assets/carimages/hyundai_kona_top_mask.png'),
    map: require('@/assets/carimages/hyundai_kona_map_base.png'),
    mapMask: require('@/assets/carimages/hyundai_kona_map_mask.png')
  },
  'kia-niro': {
    name: 'Kia Niro',
    types: {
      'KN': 'Kia Niro'
    },
    side: require('@/assets/carimages/kia_niro_side_base.png'),
    sideMask: require('@/assets/carimages/kia_niro_side_mask.png'),
    top: require('@/assets/carimages/kia_niro_top_base.png'),
    topMask: require('@/assets/carimages/kia_niro_top_mask.png'),
    map: require('@/assets/carimages/kia_niro_map_base.png'),
    mapMask: require('@/assets/carimages/kia_niro_map_mask.png')
  },
  'kia-soul': {
    name: 'Kia Soul',
    types: {
      'KS': 'Kia Soul'
    },
    side: require('@/assets/carimages/kia_soul_side_base.png'),
    sideMask: require('@/assets/carimages/kia_soul_side_mask.png'),
    top: require('@/assets/carimages/kia_soul_top_base.png'),
    topMask: require('@/assets/carimages/kia_soul_top_mask.png'),
    map: require('@/assets/carimages/kia_soul_map_base.png'),
    mapMask: require('@/assets/carimages/kia_soul_map_mask.png')
  },
  'maxus-edeliver3': {
    name: 'Maxus E Deliver 3',
    types: {
      'MED3': 'Maxus E Deliver 3'
    },
    side: require('@/assets/carimages/maxus_edeliver3_side_base.png'),
    sideMask: require('@/assets/carimages/maxus_edeliver3_side_mask.png'),
    top: require('@/assets/carimages/maxus_edeliver3_top_base.png'),
    topMask: require('@/assets/carimages/maxus_edeliver3_top_mask.png'),
    map: require('@/assets/carimages/maxus_edeliver3_map_base.png'),
    mapMask: require('@/assets/carimages/maxus_edeliver3_map_mask.png')
  },
  'mg-zs': {
    name: 'MG ZS',
    types: {
      'MGS': 'MG ZS EV (SR) (2023-)',
      'MGA': 'MG ZS EV (UK/EU)',
      'MGB': 'MG ZS EV (AU/TH)',
    },
    side: require('@/assets/carimages/mg_zs_side_base.png'),
    sideMask: require('@/assets/carimages/mg_zs_side_mask.png'),
    top: require('@/assets/carimages/mg_zs_top_base.png'),
    topMask: require('@/assets/carimages/mg_zs_top_mask.png'),
    map: require('@/assets/carimages/mg_zs_map_base.png'),
    mapMask: require('@/assets/carimages/mg_zs_map_mask.png')
  },
  'mitsubishi-imiev': {
    name: 'Mitsubishi i-MiEV',
    types: {
      'MI': 'Mitsubishi i-MiEV'
    },
    side: require('@/assets/carimages/mitsubishi_imiev_side_base.png'),
    sideMask: require('@/assets/carimages/mitsubishi_imiev_side_mask.png'),
    top: require('@/assets/carimages/mitsubishi_imiev_top_base.png'),
    topMask: require('@/assets/carimages/mitsubishi_imiev_top_mask.png'),
    map: require('@/assets/carimages/mitsubishi_imiev_map_base.png'),
    mapMask: require('@/assets/carimages/mitsubishi_imiev_map_mask.png')
  },
  'nissan-env200': {
    name: 'Nissan e-NV200',
    types: {
    },
    side: require('@/assets/carimages/nissan_env200_side_base.png'),
    sideMask: require('@/assets/carimages/nissan_env200_side_mask.png'),
    top: require('@/assets/carimages/nissan_env200_top_base.png'),
    topMask: require('@/assets/carimages/nissan_env200_top_mask.png'),
    map: require('@/assets/carimages/nissan_env200_map_base.png'),
    mapMask: require('@/assets/carimages/nissan_env200_map_mask.png')
  },
  'nissan-leaf': {
    name: 'Nissan Leaf',
    types: {
      'NL': 'Nissan Leaf'
    },
    side: require('@/assets/carimages/nissan_leaf_side_base.png'),
    sideMask: require('@/assets/carimages/nissan_leaf_side_mask.png'),
    top: require('@/assets/carimages/nissan_leaf_top_base.png'),
    topMask: require('@/assets/carimages/nissan_leaf_top_mask.png'),
    map: require('@/assets/carimages/nissan_leaf_map_base.png'),
    mapMask: require('@/assets/carimages/nissan_leaf_map_mask.png')
  },
  'opel-ampera': {
    name: 'Opel Ampera',
    types: {
      'OA': 'Opel Ampera'
    },
    side: require('@/assets/carimages/opel_ampera_side_base.png'),
    sideMask: require('@/assets/carimages/opel_ampera_side_mask.png'),
    top: require('@/assets/carimages/opel_ampera_top_base.png'),
    topMask: require('@/assets/carimages/opel_ampera_top_mask.png'),
    map: require('@/assets/carimages/opel_ampera_map_base.png'),
    mapMask: require('@/assets/carimages/opel_ampera_map_mask.png')
  },
  'renault-kangoo': {
    name: 'Renault Kangoo',
    types: {
      'RZ': 'Renault Zoe/Kangoo',
    },
    side: require('@/assets/carimages/renault_kangoo_side_base.png'),
    sideMask: require('@/assets/carimages/renault_kangoo_side_mask.png'),
    top: require('@/assets/carimages/renault_kangoo_top_base.png'),
    topMask: require('@/assets/carimages/renault_kangoo_top_mask.png'),
    map: require('@/assets/carimages/renault_kangoo_map_base.png'),
    mapMask: require('@/assets/carimages/renault_kangoo_map_mask.png')
  },
  'renault-twizy': {
    name: 'Renault Twizy',
    types: {
      'RT': 'Renault Twizy',
    },
    side: require('@/assets/carimages/renault_twizy_side_base.png'),
    sideMask: require('@/assets/carimages/renault_twizy_side_mask.png'),
    top: require('@/assets/carimages/renault_twizy_top_base.png'),
    topMask: require('@/assets/carimages/renault_twizy_top_mask.png'),
    map: require('@/assets/carimages/renault_twizy_map_base.png'),
    mapMask: require('@/assets/carimages/renault_twizy_map_mask.png')
  },
  'renault-zoe': {
    name: 'Renault Zoe',
    types: {
      'RZ': 'Renault Zoe/Kangoo',
      'RZ2': 'Renault Zoe Ph2',
    },
    side: require('@/assets/carimages/renault_zoe_side_base.png'),
    sideMask: require('@/assets/carimages/renault_zoe_side_mask.png'),
    top: require('@/assets/carimages/renault_zoe_top_base.png'),
    topMask: require('@/assets/carimages/renault_zoe_top_mask.png'),
    map: require('@/assets/carimages/renault_zoe_map_base.png'),
    mapMask: require('@/assets/carimages/renault_zoe_map_mask.png')
  },
  'smart-ed': {
    name: 'Smart ED',
    types: {
      'SE': 'Smart ED',
    },
    side: require('@/assets/carimages/smart_ed_side_base.png'),
    sideMask: require('@/assets/carimages/smart_ed_side_mask.png'),
    top: require('@/assets/carimages/smart_ed_top_base.png'),
    topMask: require('@/assets/carimages/smart_ed_top_mask.png'),
    map: require('@/assets/carimages/smart_ed_map_base.png'),
    mapMask: require('@/assets/carimages/smart_ed_map_mask.png')
  },
  'tesla-3': {
    name: 'Tesla Model 3',
    types: {
      'T3': 'Tesla Model 3',
    },
    side: require('@/assets/carimages/tesla_model3_side_base.png'),
    sideMask: require('@/assets/carimages/tesla_model3_side_mask.png'),
    top: require('@/assets/carimages/tesla_model3_top_base.png'),
    topMask: require('@/assets/carimages/tesla_model3_top_mask.png'),
    map: require('@/assets/carimages/tesla_model3_map_base.png'),
    mapMask: require('@/assets/carimages/tesla_model3_map_mask.png')
  },
  'tesla-s': {
    name: 'Tesla Model S',
    types: {
      'TS': 'Tesla Model S',
    },
    side: require('@/assets/carimages/tesla_models_side_base.png'),
    sideMask: require('@/assets/carimages/tesla_models_side_mask.png'),
    top: require('@/assets/carimages/tesla_models_top_base.png'),
    topMask: require('@/assets/carimages/tesla_models_top_mask.png'),
    map: require('@/assets/carimages/tesla_models_map_base.png'),
    mapMask: require('@/assets/carimages/tesla_models_map_mask.png')
  },
  'tesla-x': {
    name: 'Tesla Model X',
    types: {
      'TX': 'Tesla Model X',
    },
    side: require('@/assets/carimages/tesla_modelx_side_base.png'),
    sideMask: require('@/assets/carimages/tesla_modelx_side_mask.png'),
    top: require('@/assets/carimages/tesla_modelx_top_base.png'),
    topMask: require('@/assets/carimages/tesla_modelx_top_mask.png'),
    map: require('@/assets/carimages/tesla_modelx_map_base.png'),
    mapMask: require('@/assets/carimages/tesla_modelx_map_mask.png')
  },
  'tesla-y': {
    name: 'Tesla Model Y',
    types: {
      'TY': 'Tesla Model Y',
    },
    side: require('@/assets/carimages/tesla_modely_side_base.png'),
    sideMask: require('@/assets/carimages/tesla_modely_side_mask.png'),
    top: require('@/assets/carimages/tesla_modely_top_base.png'),
    topMask: require('@/assets/carimages/tesla_modely_top_mask.png'),
    map: require('@/assets/carimages/tesla_modely_map_base.png'),
    mapMask: require('@/assets/carimages/tesla_modely_map_mask.png')
  },
  'tesla-roadster-classic': {
    name: 'Tesla Roadster (2008-2012)',
    types: {
      'TR': 'Tesla Roadster (2008-2012)',
      'TR1N': 'Tesla Roadster v1.x',
      'TR2N': 'Tesla Roadster v2.x',
      'TR2S': 'Tesla Roadster Sport v2.x',
      'TRDM': 'Tesla Roadster Demonstration'
    },
    side: require('@/assets/carimages/tesla_roadster_classic_side_base.png'),
    sideMask: require('@/assets/carimages/tesla_roadster_classic_side_mask.png'),
    top: require('@/assets/carimages/tesla_roadster_classic_top_base.png'),
    topMask: require('@/assets/carimages/tesla_roadster_classic_top_mask.png'),
    map: require('@/assets/carimages/tesla_roadster_classic_map_base.png'),
    mapMask: require('@/assets/carimages/tesla_roadster_classic_map_mask.png')
  },
  'think-city': {
    name: 'Think City',
    types: {
      'TGTC': 'Think City'
    },
    side: require('@/assets/carimages/think_city_side_base.png'),
    sideMask: require('@/assets/carimages/think_city_side_mask.png'),
    top: require('@/assets/carimages/think_city_top_base.png'),
    topMask: require('@/assets/carimages/think_city_top_mask.png'),
    map: require('@/assets/carimages/think_city_map_base.png'),
    mapMask: require('@/assets/carimages/think_city_map_mask.png')
  },
  'vw-eup': {
    name: 'VW e-Up',
    types: {
      'VWUP': 'VW e-Up'
    },
    side: require('@/assets/carimages/vw_eup_side_base.png'),
    sideMask: require('@/assets/carimages/vw_eup_side_mask.png'),
    top: require('@/assets/carimages/vw_eup_top_base.png'),
    topMask: require('@/assets/carimages/vw_eup_top_mask.png'),
    map: require('@/assets/carimages/vw_eup_map_base.png'),
    mapMask: require('@/assets/carimages/vw_eup_map_mask.png')
  },
}

const undefinedCarImages = {
  side: require('@/assets/carimages/undefined_car_side.png'),
  top: require('@/assets/carimages/undefined_car_top.png'),
  map: require('@/assets/carimages/undefined_car_map.png'),
}

const getVehicleType = (imageName: string | null) => {
  const key = imageName ?? DEFAULT_IMAGE_NAME;
  return VehicleTypes[key as keyof typeof VehicleTypes] || VehicleTypes[DEFAULT_IMAGE_NAME];
};

export const GetVehicleName = (type: string) => {
  for (const obj in VehicleTypes) {
    //@ts-ignore
    if (type in VehicleTypes[obj].types) {
      //@ts-ignore
      return VehicleTypes[obj].types[type]
    }
  }

  return null
}

export function VehicleSideImage({ image }: { image: VehicleImage, continuouslyPollSource?: boolean }): React.JSX.Element {
  const ASPECT_RATIO = 600 / 300

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
    <ImageBackground
      imageStyle={{ width: '100%', height: undefined, resizeMode: 'contain', zIndex: -3 }}
      style={{ aspectRatio: ASPECT_RATIO, width: "100%", height: undefined }}
      source={getVehicleType(image.imageName).side}>
      {/* @ts-ignore */}
      <ImageBackground
        imageStyle={{ width: '100%', height: undefined, resizeMode: 'contain', zIndex: -2 }}
        style={{ aspectRatio: ASPECT_RATIO, width: "100%", height: undefined }}
        source={getVehicleType(image.imageName).sideMask}>
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
          source={getVehicleType(image.imageName).sideMask}
        />
      </ImageBackground>
    </ImageBackground>
  )
}

export function VehicleTopImage({ image }: { image: VehicleImage }): React.JSX.Element {
  const ASPECT_RATIO = 300 / 600

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
    <ImageBackground
      imageStyle={{ width: '100%', height: undefined, resizeMode: 'contain', zIndex: -3 }}
      style={{ width: '100%', height: undefined, aspectRatio: ASPECT_RATIO }}
      source={getVehicleType(image.imageName).top}>
      {/* @ts-ignore */}
      <ImageBackground
        imageStyle={{ width: '100%', height: undefined, resizeMode: 'contain', zIndex: -2 }}
        style={{ width: '100%', height: undefined, aspectRatio: ASPECT_RATIO }}
        source={getVehicleType(image.imageName).topMask}>
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
  const ASPECT_RATIO = 100 / 100

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
    <ImageBackground
      imageStyle={{ width: '100%', height: undefined, resizeMode: 'contain' }}
      style={{ width: '100%', height: undefined, aspectRatio: ASPECT_RATIO }}
      source={getVehicleType(image.imageName).map}>
      {/* @ts-ignore */}
      <ImageBackground
        imageStyle={{ width: '100%', height: undefined, resizeMode: 'contain' }}
        style={{ width: '100%', height: undefined, aspectRatio: ASPECT_RATIO }}
        source={getVehicleType(image.imageName).mapMask}>
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
          source={getVehicleType(image.imageName).mapMask}
        />
      </ImageBackground>
    </ImageBackground>
  )
}