import React, { useEffect } from "react"
import { Icon } from "react-native-paper"
import { useSelector } from "react-redux";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { ConnectionDisplay } from "../ui/ConnectionDisplay";

/**
 * Sends a textual command to Tesla platform
 * @param commandText - The command text to send
 * @returns Promise<string> - The textual result of the command
 */
export async function sendTeslaTextCommand(commandText: string): Promise<string> {
  // Tesla platform is not yet implemented
  return new Promise((resolve, reject) => {
    console.log('[sendTeslaTextCommand] commandText', commandText)
    reject(new Error("Not yet implemented"));
    return;
  });
}

export async function sendTeslaStandardCommand(command: any): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log('[sendTeslaStandardCommand] command', command)
    reject(new Error("Not implemented"));
    return;
  });
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
