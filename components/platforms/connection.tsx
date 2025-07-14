import React from "react"
import { Icon } from "react-native-paper"
import { useSelector } from "react-redux"
import { getSelectedVehicle } from "@/store/vehiclesSlice"
import { OVMSv2ConnectionIcon } from "./ovmsv2"
import { TeslaConnectionIcon } from "./tesla"
import { DefaultConnectionIcon } from "./default"

export function ConnectionIcon(): React.JSX.Element {
  const selectedVehicle = useSelector(getSelectedVehicle)

 if (selectedVehicle?.platform == "ovmsv2api") {
    return (<OVMSv2ConnectionIcon />)
  } else if (selectedVehicle?.platform == "teslawebapi") {
    return (<TeslaConnectionIcon />)
  } else {
    return (<DefaultConnectionIcon />)
  }
}
