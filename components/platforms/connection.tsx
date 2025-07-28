import React, { useEffect, useRef, useState } from "react"
import { AppState } from "react-native"
import { useSelector } from "react-redux"
import { getSelectedVehicle } from "@/store/selectionSlice"
import { Vehicle } from "@/store/vehiclesSlice"
import { OVMSv2ConnectionIcon,
  sendOVMSv2Command,
  handleOVMSv2NotificationResponse, handleOVMSv2NotificationIncoming } from "./ovmsv2"
import { TeslaConnectionIcon,
  sendTeslaCommand,
  handleTeslaNotificationResponse, handleTeslaNotificationIncoming } from "./tesla"
import { DefaultConnectionIcon } from "./default"
import { InactiveConnectionIcon } from "./inactive"
import { handleUrlParams } from "expo-router/build/fork/getStateFromPath-forks"
import { CommandCode } from "./Commands"

export function HandleNotificationResponse(response: any, vehicles: Vehicle[], dispatch: any) {
  handleOVMSv2NotificationResponse(response, vehicles, dispatch);
  handleTeslaNotificationResponse(response, vehicles, dispatch);
}

export function HandleNotificationIncoming(notification: any, vehicles: Vehicle[], dispatch: any) {
  handleOVMSv2NotificationIncoming(notification, vehicles, dispatch);
  handleTeslaNotificationIncoming(notification, vehicles, dispatch);
}

export async function ConnectionCommand(vehicle: Vehicle | null, command: {commandCode : CommandCode, params? : any}): Promise<string> {
  if (vehicle == null) {
    throw new Error("Vehicle is not selected");
  }
  try {
    let result: string;
    switch (vehicle.platform) {
      case "ovmsv2api":
        return await sendOVMSv2Command(command);
      case "teslawebapi":
        return await sendTeslaCommand(command);
      default:
        throw new Error(`Unsupported platform: ${vehicle.platform}`);
    }
  } catch (error) {
    console.error(`[ConnectionCommand] Error sending command to ${vehicle.platform}:`, error);
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

export { CommandCode }
