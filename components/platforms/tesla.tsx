import React, { useEffect } from "react"
import { Icon } from "react-native-paper"
import { useSelector } from "react-redux";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { ConnectionDisplay } from "../ui/ConnectionDisplay";
import { Vehicle } from "@/store/vehiclesSlice";
import { CommandCode } from "./Commands";

export async function sendTeslaCommand(command: {commandCode : CommandCode, params? : any}): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log('[sendTeslaStandardCommand] command', command)
    reject(new Error("Not implemented"));
    return;
  });
}

export function handleTeslaNotificationResponse(response: any, vehicles: Vehicle[], dispatch: any) {
}

export function handleTeslaNotificationIncoming(notification: any, vehicles: Vehicle[], dispatch: any) {
}

export function TeslaConnectionIcon(): React.JSX.Element {
  const selectedVehicle = useSelector(getSelectedVehicle);
  
  useEffect(() => {
    console.log("[connection TESLA] start",selectedVehicle?.name)
    return () => {
      console.log("[connection TESLA] cleanup",selectedVehicle?.name)
    }
  }, [selectedVehicle])

  return (
    <ConnectionDisplay />
  )
}
