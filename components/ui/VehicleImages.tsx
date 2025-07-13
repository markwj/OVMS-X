import React from "react"
import { View } from "react-native"
import { VehicleImage } from "@/store/vehiclesSlice"

export const VehicleTypes = {
  'ampera': {
    name: 'Opel Ampera-e',
    side: require('@/assets/carimages/ampera-side-base.png'),
    sideMask: require('@/assets/carimages/ampera-side-mask.png'),
    top: require('@/assets/carimages/ampera-top-base.png'),
    topMask: require('@/assets/carimages/ampera-top-mask.png'),
    map: require('@/assets/carimages/ampera-map-base.png'),
    mapMask: require('@/assets/carimages/ampera-map-mask.png')
  },
  'roadster': {
    name: 'Tesla Roadster (2008-2012)',
    side: require('@/assets/carimages/roadster-side-base.png'),
    sideMask: require('@/assets/carimages/roadster-side-mask.png'),
    top: require('@/assets/carimages/roadster-top-base.png'),
    topMask: require('@/assets/carimages/roadster-top-mask.png'),
    map: require('@/assets/carimages/roadster-map-base.png'),
    mapMask: require('@/assets/carimages/roadster-map-mask.png')
  },
  'thinkcity': {
    name: 'Think City',
    side: require('@/assets/carimages/thinkcity-side-base.png'),
    sideMask: require('@/assets/carimages/thinkcity-side-mask.png'),
    top: require('@/assets/carimages/thinkcity-top-base.png'),
    topMask: require('@/assets/carimages/thinkcity-top-mask.png'),
    map: require('@/assets/carimages/thinkcity-map-base.png'),
    mapMask: require('@/assets/carimages/thinkcity-map-mask.png')
  },
  'twizy': {
    name: 'Renault Twizy',
    side: require('@/assets/carimages/twizy-side-base.png'),
    sideMask: require('@/assets/carimages/twizy-side-mask.png'),
    top: require('@/assets/carimages/twizy-top-base.png'),
    topMask: require('@/assets/carimages/twizy-top-mask.png'),
    map: require('@/assets/carimages/twizy-map-base.png'),
    mapMask: require('@/assets/carimages/twizy-map-mask.png')
  },
  'volt': {
    name: 'Chevrolet Volt',
    side: require('@/assets/carimages/volt-side-base.png'),
    sideMask: require('@/assets/carimages/volt-side-mask.png'),
    top: require('@/assets/carimages/volt-top-base.png'),
    topMask: require('@/assets/carimages/volt-top-mask.png'),
    map: require('@/assets/carimages/volt-map-base.png'),
    mapMask: require('@/assets/carimages/volt-map-mask.png')
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