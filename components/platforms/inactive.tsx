import React, { useEffect } from "react"
import { Icon } from "react-native-paper"
import { useSelector } from "react-redux";
import { getSelectedVehicle } from "@/store/selectionSlice";

export function InactiveConnectionIcon(): React.JSX.Element {
  const selectedVehicle = useSelector(getSelectedVehicle);
  
  useEffect(() => {
    console.log("[connection INACTIVE]")
  }, [selectedVehicle])

  return (
    <Icon source='sleep' size={20} />
  )
}
