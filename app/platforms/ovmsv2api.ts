// Platform class implementing OVMS v2 API

import { Platform } from "./baseplatform";
import { Vehicle } from "@/store/vehiclesSlice";
import { store } from "@/store/root";
import { notificationsUniqueID } from "@/store/notificationSlice";
import { metricsSlice } from "@/store/metricsSlice";
import { stackRouterOverride } from "expo-router/build/layouts/StackClient";

export class OvmsV2Api extends Platform {
  constructor(vehicle: Vehicle) {
    super(vehicle);
  }

  connect() {
    console.log("[platform OVMSv2Api] connect", this.currentVehicle.name);
    //store.dispatch(metricsSlice.actions.setMetric({ key: 'm.egpio.input', value: "Yo dude!" }));
    //const dispatch = store.dispatch;
  }

  disconnect() {
    console.log("[platform OVMSv2Api] disconnect", this.currentVehicle.name);
  }

  handleNotificationResponse(response: any) {
    console.log("[platform OVMSv2Api] handleNotificationResponse", response);
  }

  handleNotificationIncoming(notification: any) {
    console.log("[platform OVMSv2Api] handleNotificationIncoming", notification);
  }

  handleNotificationRegistration(pushTokenString: string) {
    const notificationUniqueID = notificationsUniqueID(store.getState());
    console.log("[platform OVMSv2Api] handleNotificationRegistration", pushTokenString, 'for', notificationUniqueID);
  }

}