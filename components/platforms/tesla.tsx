import React, { useEffect } from "react"
import { Icon } from "react-native-paper"
import { useSelector } from "react-redux";
import { getSelectedVehicle } from "@/store/vehiclesSlice";

export function TeslaConnectionIcon(): React.JSX.Element {
  const selectedVehicle = useSelector(getSelectedVehicle);
  
  useEffect(() => {
    console.log("[connection] Tesla start",selectedVehicle?.name)
    return () => {
      console.log("[connection] Tesla cleanup",selectedVehicle?.name)
    }
  }, [selectedVehicle])

  return (
    <Icon source='antenna' size={20} />
  )
}
