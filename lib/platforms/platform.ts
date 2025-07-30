// Base platform class

import { Vehicle } from "@/store/vehiclesSlice";
import { Platform } from "./baseplatform";
import { OvmsV2Api } from "./ovmsv2api";
import { TeslaFleetApi } from "./teslafleetapi";
import { CommandCode } from "@/lib/platforms/commands";

var currentPlatform: Platform | null = null;

export function connectToVehicle(vehicle: Vehicle) {
  console.log("[platform] connectToVehicle", vehicle.name);
  if (currentPlatform) {
    currentPlatform.disconnect();
    currentPlatform = null;
  }
  switch (vehicle.platform) {
    case "ovmsv2api":
      currentPlatform = new OvmsV2Api(vehicle);
      break;
    case "teslafleetapi":
      currentPlatform = new TeslaFleetApi(vehicle);
      break;
  }
  if (currentPlatform) { currentPlatform.connect(); }
}

export function disconnectFromVehicle() {
  console.log("[platform] disconnectFromVehicle");
  if (currentPlatform) {
    currentPlatform.disconnect();
    currentPlatform = null;
  }
}

export function appForeground() {
  console.log("[platform] appForeground");
  if (currentPlatform) {
    currentPlatform.connect();
  }
}

export function appBackground() {
  console.log("[platform] appBackground");
  if (currentPlatform) {
    currentPlatform.disconnect();
  }
}

export function appInactive() {
  console.log("[platform] appInactive");
  if (currentPlatform) {
    currentPlatform.disconnect();
  }
}

export async function sendCommand(command: { commandCode: CommandCode, params?: any }): Promise<string> {
  console.log("[platform] sendCommand", command.commandCode, JSON.stringify(command.params));
  if (currentPlatform) {
    return currentPlatform.sendCommand(command);
  }
  else {
    return new Promise((resolve, reject) => {
      reject(new Error("Vehicle not connected"));
    });
  }
}

export function handleNotificationResponse(response: any) {
  console.log("[platform] handleNotificationResponse", JSON.stringify(response));
  if (currentPlatform) {
    currentPlatform.handleNotificationResponse(response);
  }
}

export function handleNotificationIncoming(notification: any) {
  console.log("[platform] handleNotificationIncoming", JSON.stringify(notification));
  if (currentPlatform) {
    currentPlatform.handleNotificationIncoming(notification);
  }
}

export function handleNotificationRegistration(pushTokenString: string) {
  console.log("[platform] handleNotificationRegistration", pushTokenString);
  if (currentPlatform) {
    currentPlatform.handleNotificationRegistration(pushTokenString);
  }
}

