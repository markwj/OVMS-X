// Base platform class

import { Vehicle } from "@/store/vehiclesSlice";
import { Platform } from "./baseplatform";
import { CommandCode } from "@/lib/platforms/commands";
import { platformRegistry } from "./platformRegistry";

console.log("[platform] Module loaded");

var currentPlatform: Platform | null = null;

export function connectToVehicle(vehicle: Vehicle) {
  console.log("[platform] connectToVehicle", vehicle.name, "platform", vehicle.platform);
  
  if (currentPlatform) {
    currentPlatform.disconnect();
    currentPlatform = null;
  }
  
  // Use the platform registry to create the appropriate platform instance
  currentPlatform = platformRegistry.createPlatform(vehicle.platform, vehicle);
  
  if (currentPlatform) { 
    currentPlatform.connect(); 
  } else {
    console.error("[platform] Failed to create platform for:", vehicle.platform);
  }
}

export function disconnectFromVehicle() {
  console.log("[platform] disconnect from vehicle");
  if (currentPlatform) {
    currentPlatform.disconnect();
    currentPlatform = null;
  }
}

export function appForeground() {
  console.log("[platform] app Foreground");
  if (currentPlatform) {
    currentPlatform.connect();
  }
}

export function appBackground() {
  console.log("[platform] app Background");
  if (currentPlatform) {
    currentPlatform.disconnect();
  }
}

export function appInactive() {
  console.log("[platform] app Inactive");
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

