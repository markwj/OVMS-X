import React, { useEffect, useRef, useState } from "react"
import { AppState } from "react-native"
import { useSelector } from "react-redux"
import { getSelectedVehicle } from "@/store/selectionSlice"
import { Vehicle } from "@/store/vehiclesSlice"
import { OVMSv2ConnectionIcon, sendOVMSv2TextCommand } from "./ovmsv2"
import { TeslaConnectionIcon, sendTeslaTextCommand } from "./tesla"
import { DefaultConnectionIcon } from "./default"
import { InactiveConnectionIcon } from "./inactive"

/**
 * Sends a textual command to the specified vehicle and returns the result
 * @param vehicle - The vehicle to send the command to
 * @param commandText - The command text to send
 * @returns Promise<string> - The textual result of the command
 */
export async function ConnectionTextualCommand(vehicle: Vehicle | null, commandText: string): Promise<string> {
  if (vehicle == null) {
    throw new Error("Vehicle is not selected");
  }
  try {
    let result: string;
    switch (vehicle.platform) {
      case "ovmsv2api":
        result = await sendOVMSv2TextCommand(commandText);
        console.log("[ConnectionTextualCommand sendOVMSv2TextCommand] result", result)
        return result;
      case "teslawebapi":
        result = await sendTeslaTextCommand(commandText);
        console.log("[ConnectionTextualCommand sendTeslaTextCommand] result", result)
        return result;
      default:
        throw new Error(`Unsupported platform: ${vehicle.platform}`);
    }
  } catch (error) {
    console.error(`[ConnectionTextualCommand] Error sending command to ${vehicle.platform}:`, error);
    throw error;
  }
}

export function ConnectionIcon(): React.JSX.Element {
  const selectedVehicle = useSelector(getSelectedVehicle)
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('[connection] app state changed to active');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('[connection] app state', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (appState.current != "active") {
    return (<InactiveConnectionIcon />)
  } else if (selectedVehicle?.platform == "ovmsv2api") {
    return (<OVMSv2ConnectionIcon />)
  } else if (selectedVehicle?.platform == "teslawebapi") {
    return (<TeslaConnectionIcon />)
  } else {
    return (<DefaultConnectionIcon />)
  }
}
