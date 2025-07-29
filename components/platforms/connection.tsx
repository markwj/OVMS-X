import React, { useEffect, useRef, useState } from "react"
import { AppState } from "react-native"
import { useSelector } from "react-redux"
import { getSelectedVehicle } from "@/store/selectionSlice"
import { Vehicle } from "@/store/vehiclesSlice"
import {
  OVMSv2ConnectionIcon,
  sendOVMSv2Command,
  handleOVMSv2NotificationResponse, handleOVMSv2NotificationIncoming
} from "./ovmsv2"
import {
  TeslaConnectionIcon,
  sendTeslaCommand,
  handleTeslaNotificationResponse, handleTeslaNotificationIncoming
} from "./tesla"
import { DefaultConnectionIcon } from "./default"
import { InactiveConnectionIcon } from "./inactive"
import { CommandCode } from "./Commands"
import { View } from "react-native"

export function HandleNotificationResponse(response: any, vehicles: Vehicle[], dispatch: any) {
  handleOVMSv2NotificationResponse(response, vehicles, dispatch);
  handleTeslaNotificationResponse(response, vehicles, dispatch);
}

export function HandleNotificationIncoming(notification: any, vehicles: Vehicle[], dispatch: any) {
  handleOVMSv2NotificationIncoming(notification, vehicles, dispatch);
  handleTeslaNotificationIncoming(notification, vehicles, dispatch);
}

export async function ConnectionCommand(vehicle: Vehicle | null, command: { commandCode: CommandCode, params?: any }): Promise<string> {
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

let connectionCount = 0;

export function ConnectionIcon(): React.JSX.Element {
  const selectedVehicle = useSelector(getSelectedVehicle)
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    connectionCount++;
    var subscription: any;
    if (connectionCount == 1) {
      console.log('[connection main] startup', connectionCount);
      subscription = AppState.addEventListener('change', nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('[connection main] app state changed to active');
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log('[connection main] app state', appState.current);
      });
    }

    return () => {
      connectionCount--;
      if(connectionCount != undefined) { console.error("[connection main] Connection count is undefined"); return; }
      if (connectionCount == 0) {
        console.log('[connection main] cleanup', connectionCount);
        subscription.remove();
      }
    };
  }, []);

  if (appState.current != "active") {
    return (<View style={{ marginRight: 10 }}><InactiveConnectionIcon /></View>)
  } else if (selectedVehicle?.platform == "ovmsv2api") {
    return (<View style={{ marginRight: 10 }}><OVMSv2ConnectionIcon /></View>)
  } else if (selectedVehicle?.platform == "teslawebapi") {
    return (<View style={{ marginRight: 10 }}><TeslaConnectionIcon /></View>)
  } else {
    return (<View style={{ marginRight: 10 }}><DefaultConnectionIcon /></View>)
  }
}
