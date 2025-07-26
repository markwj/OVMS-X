import React, { useEffect, useRef, useState } from "react"
import { AppState } from "react-native"
import { useSelector } from "react-redux"
import { getSelectedVehicle } from "@/store/selectionSlice"
import { Vehicle } from "@/store/vehiclesSlice"
import { OVMSv2ConnectionIcon,
  sendOVMSv2TextCommand, sendOVMSv2StandardCommand,
  handleOVMSv2NotificationResponse, handleOVMSv2NotificationIncoming } from "./ovmsv2"
import { TeslaConnectionIcon,
  sendTeslaTextCommand, sendTeslaStandardCommand,
  handleTeslaNotificationResponse, handleTeslaNotificationIncoming } from "./tesla"
import { DefaultConnectionIcon } from "./default"
import { InactiveConnectionIcon } from "./inactive"
import { handleUrlParams } from "expo-router/build/fork/getStateFromPath-forks"

// Standard Commands
export enum CommandCode {
  REQUEST_FEATURE_LIST = 1,           // Params: none
  SET_FEATURE = 2,                    // Params: feature, value
  REQUEST_PARAMETER_LIST = 3,         // Params: none
  SET_PARAMETER = 4,                  // Params: parameter, value,
  REBOOT = 5,                         // Params: none
  CHARGE_ALERT = 6,                   // Params: none
  EXECUTE_SMS_COMMAND = 7,            // Params: smstext
  SET_CHARGE_MODE = 10,               // Params: mode ('standard', 'storage', 'range', 'performance')
  START_CHARGE = 11,                  // Params: none
  STOP_CHARGE = 12,                   // Params: none
  SET_CHARGE_CURRENT = 15,            // Params: current (specified in Amps)
  SET_CHARGE_MODE_AND_CURRENT = 16,   // Params: mode ('standard', 'storage', 'range', 'performance'), current (specified in Amps)
  SET_CHARGE_TIMER_MODE_TIME = 17,    // Params: timer ('plugin', 'timer'), start (HH:MM format)
  WAKEUP_CAR = 18,                    // Params: none
  WAKEUP_TEMPERATURE_SUBSYSTEM = 19,  // Params: none,
  LOCK_CAR = 20,                      // Params: pin
  ACTIVATE_VALET_MODE = 21,           // Params: pin
  UNLOCK_CAR = 22,                    // Params: pin
  DEACTIVATE_VALET_MODE = 23,         // Params: pin
  HOME_LINK = 24,                     // Params: button (0, 1 or 2)
  COOLDOWN = 30,                      // Params: none
  REQUEST_GPRS_UTILIZATION_DATA = 31, // Params: none
  REQUEST_HISTORICAL_SUMMARY = 32,    // Params: since (optional timestamp condition)
  REQUEST_HISTORICAL_RECORDS = 32,    // Params: type (the record type to retrieve), since (optional timestamp condition)
  SEND_SMS = 40,                      // Params: number (telephone number to send sms to), message (sms message to be sent)
  SEND_USSD_CODE = 41,                // Params: ussdcode (the ussd code to send)
  SEND_RAW_AT_COMMAND = 49,           // Params: atcommand (the AT command to send - including the AT prefix)
}

export function HandleNotificationResponse(response: any, vehicles: Vehicle[], dispatch: any) {
  handleOVMSv2NotificationResponse(response, vehicles, dispatch);
  handleTeslaNotificationResponse(response, vehicles, dispatch);
}

export function HandleNotificationIncoming(notification: any, vehicles: Vehicle[], dispatch: any) {
  handleOVMSv2NotificationIncoming(notification, vehicles, dispatch);
  handleTeslaNotificationIncoming(notification, vehicles, dispatch);
}

export async function ConnectionStandardCommand(vehicle: Vehicle | null, command: {commandCode : CommandCode, params? : any[]}): Promise<string> {
  if (vehicle == null) {
    throw new Error("Vehicle is not selected");
  }
  try {
    let result: string;
    switch (vehicle.platform) {
      case "ovmsv2api":
        return await sendOVMSv2StandardCommand(command);
      case "teslawebapi":
        return await sendTeslaStandardCommand(command);
      default:
        throw new Error(`Unsupported platform: ${vehicle.platform}`);
    }
  } catch (error) {
    console.error(`[ConnectionStandardCommand] Error sending command to ${vehicle.platform}:`, error);
    throw error;
  }
}

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
