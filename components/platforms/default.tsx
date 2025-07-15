import React, { useEffect } from "react"
import { Icon } from "react-native-paper"
import { useSelector } from "react-redux";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { ConnectionDisplay } from "@/components/ui/ConnectionDisplay";

export function DefaultConnectionIcon(): React.JSX.Element {
  const selectedVehicle = useSelector(getSelectedVehicle);
  
  useEffect(() => {
    console.log("[connection DEFAULT] start",selectedVehicle?.name)
    return () => {
      console.log("[connection DEFAULT] cleanup",selectedVehicle?.name)
    }
  }, [selectedVehicle])

  return (
    <ConnectionDisplay />
  )
}