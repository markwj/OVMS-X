// Platform class implementing Tesla Fleet API

import { Platform } from "./baseplatform";
import { Vehicle } from "@/store/vehiclesSlice";

export class TeslaFleetApi extends Platform {
  constructor(vehicle: Vehicle) {
    super(vehicle);
  }

  connect() {
    console.log("[platform TeslaFleetApi] connect", this.currentVehicle.name);
  }

  disconnect() {
    console.log("[platform TeslaFleetApi] disconnect", this.currentVehicle.name);
  }

  handleNotificationResponse(response: any) {
    console.log("[platform TeslaFleetApi] handleNotificationResponse", response);
  }

  handleNotificationIncoming(notification: any) {
    console.log("[platform TeslaFleetApi] handleNotificationIncoming", notification);
  }

  handleNotificationRegistration(pushTokenString: string) {
    console.log("[platform TeslaFleetApi] handleNotificationRegistration", pushTokenString);
  }
}