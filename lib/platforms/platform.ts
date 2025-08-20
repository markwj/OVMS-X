/**
 * Platform Management Module
 * 
 * This module serves as the central hub for managing vehicle platform connections.
 * It provides a unified interface for connecting to different vehicle platforms
 * (OVMS, Tesla, etc.) and handles platform lifecycle management including
 * connection/disconnection, command sending, and notification handling.
 */

import { Vehicle } from "@/store/vehiclesSlice";
import { Platform } from "./baseplatform";
import { CommandCode } from "@/lib/platforms/commands";
import { platformRegistry } from "./platformRegistry";

console.log("[platform] Module loaded");

/**
 * Global reference to the currently active platform instance.
 * Only one platform can be connected at a time.
 */
var currentPlatform: Platform | null = null;

/**
 * Connects to a specific vehicle using its platform.
 * 
 * This function:
 * 1. Disconnects from any currently active platform
 * 2. Creates a new platform instance based on the vehicle's platform type
 * 3. Establishes a connection to the vehicle
 * 
 * @param vehicle - The vehicle object containing platform information and connection details
 */
export function connectToVehicle(vehicle: Vehicle) {
  console.log("[platform] connectToVehicle", vehicle.name, "platform", vehicle.platform);
  
  // Disconnect from any existing platform before connecting to a new one
  if (currentPlatform) {
    currentPlatform.disconnect();
    currentPlatform = null;
  }
  
  // Use the platform registry to create the appropriate platform instance
  // based on the vehicle's platform type (OVMS, Tesla, etc.)
  currentPlatform = platformRegistry.createPlatform(vehicle.platform, vehicle);
  
  if (currentPlatform) { 
    currentPlatform.connect(); 
  } else {
    console.error("[platform] Failed to create platform for:", vehicle.platform);
  }
}

/**
 * Disconnects from the currently connected vehicle.
 * 
 * This function:
 * 1. Disconnects the current platform
 * 2. Clears the platform reference
 * 3. Logs the disconnection for debugging purposes
 */
export function disconnectFromVehicle() {
  console.log("[platform] disconnect from vehicle");
  if (currentPlatform) {
    currentPlatform.disconnect();
    currentPlatform = null;
  }
}

/**
 * Handles app foreground events.
 * 
 * When the app comes to the foreground, this function attempts to
 * reconnect to the vehicle if a platform was previously connected.
 * This ensures the connection is restored when the user returns to the app.
 */
export function appForeground() {
  console.log("[platform] app Foreground");
  if (currentPlatform) {
    currentPlatform.connect();
  }
}

/**
 * Handles app background events.
 * 
 * When the app goes to the background, this function disconnects
 * from the vehicle to conserve resources and battery life.
 */
export function appBackground() {
  console.log("[platform] app Background");
  if (currentPlatform) {
    currentPlatform.disconnect();
  }
}

/**
 * Handles app inactive events.
 * 
 * When the app becomes inactive (e.g., user switches to another app),
 * this function disconnects from the vehicle to free up resources.
 */
export function appInactive() {
  console.log("[platform] app Inactive");
  if (currentPlatform) {
    currentPlatform.disconnect();
  }
}

/**
 * Sends a command to the connected vehicle.
 * 
 * This function provides a unified interface for sending commands to any
 * connected vehicle platform. It handles the command routing and error
 * handling for disconnected states.
 * 
 * @param command - Object containing the command code and optional parameters
 * @returns Promise that resolves with the command response or rejects with an error
 */
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

/**
 * Handles notification responses from the vehicle platform.
 * 
 * This function routes notification responses to the appropriate platform
 * for processing. Used for handling responses to commands or status updates.
 * 
 * @param response - The notification response data from the platform
 */
export function handleNotificationResponse(response: any) {
  console.log("[platform] handleNotificationResponse", JSON.stringify(response));
  if (currentPlatform) {
    currentPlatform.handleNotificationResponse(response);
  }
}

/**
 * Handles incoming notifications from the vehicle platform.
 * 
 * This function routes incoming notifications (like status updates, alerts)
 * to the appropriate platform for processing and UI updates.
 * 
 * @param notification - The incoming notification data from the platform
 */
export function handleNotificationIncoming(notification: any) {
  console.log("[platform] handleNotificationIncoming", JSON.stringify(notification));
  if (currentPlatform) {
    currentPlatform.handleNotificationIncoming(notification);
  }
}

/**
 * Handles push notification registration.
 * 
 * This function registers the app's push token with the vehicle platform
 * to enable push notifications for vehicle events and status updates.
 * 
 * @param pushTokenString - The push notification token string for this device
 */
export function handleNotificationRegistration(pushTokenString: string) {
  console.log("[platform] handleNotificationRegistration", pushTokenString);
  if (currentPlatform) {
    currentPlatform.handleNotificationRegistration(pushTokenString);
  }
}

