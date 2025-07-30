// Base platform class

import { Vehicle } from "@/store/vehiclesSlice";
import { store } from "@/store/root";
import { metricsSlice } from "@/store/metricsSlice";
import { CommandCode } from "./commands";
import { connectionSlice, VehicleConnectionState } from "@/store/connectionSlice";

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

  async sendCommand(command: { commandCode: CommandCode, params?: any }): Promise<string> {
    return new Promise((resolve, reject) => {
      reject(new Error("Not yet implemented"));
    });
  }

  setMetric(metric: {key: string, value: string, currentTime?: string, unit?: string, stale?: boolean | null}) {
    //console.log('[platform] setMetric', JSON.stringify(metric))
    store.dispatch(
      metricsSlice.actions.setMetric(
        { key: metric.key, value: metric.value, currentTime: metric.currentTime, unit: metric.unit, stale: metric.stale }));
  }

  setConnectionState(newState: VehicleConnectionState) {
    store.dispatch(connectionSlice.actions.setConnectionState(newState))
  }

  setLastUpdateTime(seconds: number) {
    store.dispatch(connectionSlice.actions.setLastUpdateTime((Date.now() / 1000) - seconds))
  }

  setCarConnected(connected: boolean) {
    store.dispatch(connectionSlice.actions.setCarConnected(connected))
  }
}