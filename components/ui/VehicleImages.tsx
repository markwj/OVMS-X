import React from "react"
import { View } from "react-native"
import { VehicleImage } from "@/store/vehiclesSlice"

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

  return (<View></View>);
}

export function VehicleTopImage({ image }: { image: VehicleImage }): React.JSX.Element {

  return (<View></View>);
}

export function VehicleMapImage({ image }: { image: VehicleImage }): React.JSX.Element {

  return (<View></View>);
}