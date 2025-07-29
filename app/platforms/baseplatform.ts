// Base platform class

import { Vehicle } from "@/store/vehiclesSlice";

export abstract class Platform {
  protected currentVehicle: Vehicle;

  constructor(vehicle: Vehicle) {
    console.log("[platform] constructor", vehicle.name);
    this.currentVehicle = vehicle;
  }

  abstract connect(): void;
  abstract disconnect(): void;
  abstract handleNotificationResponse(response: any): void;
  abstract handleNotificationIncoming(notification: any): void;
  abstract handleNotificationRegistration(pushTokenString: string): void;
}