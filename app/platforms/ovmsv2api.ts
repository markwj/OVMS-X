// Platform class implementing OVMS v2 API

import { Platform } from "./baseplatform";
import { Vehicle } from "@/store/vehiclesSlice";
import { store } from "@/store/root";
import { notificationsUniqueID } from "@/store/notificationSlice";
import { getVehicles, vehiclesSlice } from "@/store/vehiclesSlice";
import { selectionSlice } from "@/store/selectionSlice";
import { messagesSlice } from "@/store/messagesSlice";
import { CommandCode } from "./commands";
import { connectionSlice, VehicleConnectionState, getConnectionState } from "@/store/connectionSlice";
import { notificationsEnabled, notificationsToken } from "@/store/notificationSlice";

// PendingCommand is an object to store one pending protocol command
interface PendingCommand {
  resolve: (value: any | null) => void;
  reject: (reason: any) => void;
  timeoutId: number;
}

const COMMAND_TIMEOUT = 10000; // 10 seconds command timeout
const KEEPALIVE_INTERVAL = 60000; // 1 minute keepalive interval
const RECONNECT_DELAY = 10000; // 10 seconds reconnect delay

export class OvmsV2Api extends Platform {
  protected pendingCommands: Map<CommandCode, PendingCommand[]> = new Map();
  protected connection: WebSocket | null = null;
  protected distanceUnits: string = "km";
  protected speedUnits: string = (this.distanceUnits == "km") ? "km/h" : "mph";
  protected keepaliveTimer: number | null = null;
  protected reconnectTimer: number | null = null;

  constructor(vehicle: Vehicle) {
    super(vehicle);
  }

  async sendCommand(command: { commandCode: CommandCode, params?: any }): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('[platform OVMSv2Api sendCommand] command',
        CommandCode[command.commandCode] ?? command.commandCode, command.params || {})

      if (!this.connection || this.connection.readyState !== WebSocket.OPEN) {
        console.log('[platform OVMSv2Api sendCommand] not connected to vehicle')
        reject(new Error("Not connected to vehicle (via OVMSv2 API)"));
        return;
      }

      // Set up timeout for this command
      const timeoutId = setTimeout(() => {
        // Remove this command from the queue
        console.log('[platform OVMSv2Api sendCommand] command timed out', timeoutId)
        const pendingCommands = this.pendingCommands.get(command.commandCode) || [];
        const index = pendingCommands.findIndex((cmd: PendingCommand) => cmd.timeoutId === timeoutId);
        if (index !== -1) {
          pendingCommands[index].resolve('ERROR: command timed out');
          pendingCommands.splice(index, 1);
          this.pendingCommands.set(command.commandCode, pendingCommands);
        }
      }, COMMAND_TIMEOUT);

      // Send the command in OVMSv2 format: 'C' + command code + comma + parameters
      var commandMessage: string | undefined;
      switch (command.commandCode) {
        case CommandCode.SET_FEATURE:
          commandMessage = `C2,${command.params?.feature},${command.params?.value}`;
          break;
        case CommandCode.SET_PARAMETER:
          commandMessage = `C4,${command.params?.parameter},${command.params?.value}`;
          break;
        case CommandCode.REBOOT:
          commandMessage = `C5`;
          break;
        case CommandCode.CHARGE_ALERT:
          commandMessage = `C6`;
          break;
        case CommandCode.EXECUTE_SMS_COMMAND:
          commandMessage = `C7,${command.params?.text}`;
          break;
        case CommandCode.SET_CHARGE_MODE:
          commandMessage = `C10,${command.params?.mode}`;
          break;
        case CommandCode.START_CHARGE:
          commandMessage = `C11`;
          break;
        case CommandCode.STOP_CHARGE:
          commandMessage = `C12`;
          break;
        case CommandCode.SET_CHARGE_CURRENT:
          commandMessage = `C15,${command.params?.current}`;
          break;
        case CommandCode.SET_CHARGE_MODE_AND_CURRENT:
          commandMessage = `C16,${command.params?.mode},${command.params?.current}`;
          break;
        case CommandCode.SET_CHARGE_TIMER_MODE_TIME:
          commandMessage = `C17,${command.params?.timer},${command.params?.start}`;
          break;
        case CommandCode.WAKEUP_CAR:
          commandMessage = `C18`;
          break;
        case CommandCode.WAKEUP_TEMPERATURE_SUBSYSTEM:
          commandMessage = `C19`;
          break;
        case CommandCode.LOCK_CAR:
          commandMessage = `C20,${command.params?.pin}`;
          break;
        case CommandCode.ACTIVATE_VALET_MODE:
          commandMessage = `C21,${command.params?.pin}`;
          break;
        case CommandCode.UNLOCK_CAR:
          commandMessage = `C22,${command.params?.pin}`;
          break;
        case CommandCode.DEACTIVATE_VALET_MODE:
          commandMessage = `C23,${command.params?.pin}`;
          break;
        case CommandCode.HOME_LINK:
          commandMessage = `C24,${command.params?.button}`;
          break;
        case CommandCode.COOLDOWN:
          commandMessage = `C30`;
          break;
        case CommandCode.SEND_SMS:
          commandMessage = `C40,${command.params?.number},${command.params?.message}`;
          break;
        case CommandCode.SEND_USSD_CODE:
          commandMessage = `C41,${command.params?.ussdcode}`;
          break;
        case CommandCode.SEND_RAW_AT_COMMAND:
          commandMessage = `C49,${command.params?.atcommand}`;
          break;
      };

      console.log('[platform OVMSv2Api sendCommand] PendingCommands size:', this.pendingCommands.size,
        'for command code:', command.commandCode,
        'pending count:', this.pendingCommands.get(command.commandCode)?.length || 0)

      if (commandMessage !== undefined) {
        // Add command to the queue
        const pendingCommands = this.pendingCommands.get(command.commandCode) || [];
        pendingCommands.push({ resolve, reject, timeoutId });
        this.pendingCommands.set(command.commandCode, pendingCommands);

        // Send the command
        console.log(`[platform OVMSv2Api sendCommand] Sending command: ${commandMessage}`);
        this.connection.send(commandMessage);
      } else {
        reject(new Error("Unsupported command code"));
      }
    });
  }

  resolveNextPendingCommand(commandCode: number, result: number, parameters: string) {
    console.log('[platform OVMSv2Api resolveNextPendingCommand] response', commandCode, result, parameters)

    const pendingCommands = this.pendingCommands.get(commandCode) || [];
    if (pendingCommands.length > 0) {
      const nextCommand = pendingCommands.shift();
      if (pendingCommands.length > 0) {
        this.pendingCommands.set(commandCode, pendingCommands);
      }
      else {
        this.pendingCommands.delete(commandCode);
      }

      console.log('[platform OVMSv2Api resolveNextPendingCommand] PendingCommands size:',
        this.pendingCommands.size,
        'for command code:', commandCode, 'pending count:',
        this.pendingCommands.get(commandCode)?.length || 0)

      if (nextCommand) {
        clearTimeout(nextCommand.timeoutId);
        switch (result) {
          case 0: // Success!
            switch (commandCode) {
              case CommandCode.EXECUTE_SMS_COMMAND:
                nextCommand.resolve(parameters);
                break
              default:
                // Default (for most commands) is no result
                nextCommand.resolve(null);
                break
            }
            break
          case 1: // Command failed
            nextCommand.reject(new Error(`Command failed`));
            break;
          case 2: // Command unsupported
            nextCommand.reject(new Error(`Command unsupported`));
            break
          case 3: // Command unimplemented
            nextCommand.reject(new Error(`Command unimplemented`));
            break
          default: // Command failed
            nextCommand.reject(new Error(`Command failed with result code ${result}`));
        }
      }
    }
    else {
      console.log('[platform OVMSv2Api resolveNextPendingCommand] no pending commands for command code', commandCode)
    }
  }

  cleanupPendingCommands() {
    if (this.pendingCommands.size > 0) {
      console.log('[platform OVMSv2Api cleanupPendingCommands]');

      this.pendingCommands.forEach((pendingCommands, commandCode) => {
        pendingCommands.forEach((pendingCommand) => {
          clearTimeout(pendingCommand.timeoutId);
          pendingCommand.reject(new Error(`Vehicle disconnected`));
        });
      });
    }
  }

  handleNotificationResponse(response: any) {
    console.log("[platform OVMSv2Api] handleNotificationResponse", response);

    const vehicleid = response.data?.vehicleid;
    const vehicles = getVehicles(store.getState());

    const vehicle = vehicles.find((v: Vehicle) =>
      ((v.platform === "ovmsv2api") && (v.platformParameters.id === vehicleid)));
    if (vehicle) {
      store.dispatch(selectionSlice.actions.selectVehicle(vehicle.key));
    }
  }

  handleNotificationIncoming(notification: any) {
    console.log("[platform OVMSv2Api] handleNotificationIncoming", notification);

    const vehicleid = notification.data?.vehicleid;
    const message = notification.body;
    const vehicles = getVehicles(store.getState());

    const vehicle = vehicles.find((v: Vehicle) =>
      ((v.platform === "ovmsv2api") && (v.platformParameters.id === vehicleid)));
    if (vehicle) {
      store.dispatch(messagesSlice.actions.addVehicleMessage({
        text: message, vehicleKey: vehicle.key, vehicleName: vehicle.name
      }))
    }
  }

  handleNotificationRegistration(pushTokenString: string) {
    const notificationEnabled = notificationsEnabled(store.getState())
    const notificationToken = notificationsToken(store.getState())
    const notificationUniqueID = notificationsUniqueID(store.getState())
    const connectionState = getConnectionState(store.getState())

    console.log("[platform OVMSv2Api] handleNotificationRegistration", pushTokenString, 'for', notificationUniqueID);

    if (notificationEnabled && this.connection && (connectionState == VehicleConnectionState.CONNECTED)) {
      const subscribeMessage = `p${notificationUniqueID},expo,simple,${notificationToken}`
      this.connection?.send(subscribeMessage)
      console.log('[platform OVMSv2Api] tx subscribe', subscribeMessage)
    }
  }

  reconnectListener = () => {
    console.log("[platform OVMSv2Api] reconnectListener");
    const connectionState = getConnectionState(store.getState())
    if (connectionState == VehicleConnectionState.WAITRECONNECT) {
      this.connect()
    }
  }

  keepaliveListener = () => {
    console.log("[platform OVMSv2Api] keepaliveListener");

    const connectionState = getConnectionState(store.getState())
    if (this.connection && (connectionState == VehicleConnectionState.CONNECTED)) {
      this.connection.send('A')
    }
  }

  openListener = () => {
    console.log("[platform OVMSv2Api] connection opened");

    this.setConnectionState(VehicleConnectionState.AUTHENTICATING)
    const authMessage = `MP-A 1 ${this.currentVehicle.platformParameters?.username} ${this.currentVehicle.platformParameters?.password} ${this.currentVehicle.platformParameters?.id}`
    console.log('[platform OVMSv2Api] tx auth', authMessage)
    this.connection?.send(authMessage)
  }

  closeListener = () => {
    const connectionState = getConnectionState(store.getState())
    if (connectionState != VehicleConnectionState.DISCONNECTED) {
      console.log("[platform OVMSv2Api] connection closed, waiting for reconnect");
      this.disconnect();
      this.setConnectionState(VehicleConnectionState.WAITRECONNECT)
      this.reconnectTimer = setTimeout(this.reconnectListener, RECONNECT_DELAY)
    }
    else {
      console.log("[platform OVMSv2Api] connection closed");
    }
  }

  messageListener = (event: MessageEvent) => {

    if (event.data.startsWith('MP-S')) {
      console.log('[platform OVMSv2Api] rx LOGIN(RESULT)', event.data)
      this.setConnectionState(VehicleConnectionState.CONNECTED)

      if (this.keepaliveTimer) {
        clearInterval(this.keepaliveTimer)
        this.keepaliveTimer = null
      }
      this.keepaliveTimer = setInterval(this.keepaliveListener, KEEPALIVE_INTERVAL)

      const notificationEnabled = notificationsEnabled(store.getState())
      const notificationToken = notificationsToken(store.getState())
      const notificationUniqueID = notificationsUniqueID(store.getState())
      if (notificationEnabled) {
        const subscribeMessage = `p${notificationUniqueID},expo,simple,${notificationToken}`
        this.connection?.send(subscribeMessage)
        console.log('[platform OVMSv2Api] tx subscribe', subscribeMessage)
      }

    } else if (event.data.startsWith('F')) {
      const parts = event.data.substring(1).split(',')
      console.log('[platform OVMSv2Api] rx FIRMWARE', parts)

      const firmwareVersion = parts[0]
      const vin = parts[1]
      const networkSignalQuality = parts[2]
      const writeEnabledFirmware = parts[3]
      const vehicleTypeCode = parts[4]
      const networkName = parts[5]
      const distanceToNextMaintenance = parts[6]
      const timeToNextMaintenance = parts[7]
      const ovmsHardwareVersion = parts[8]
      const cellularConnectionMode = parts[9]
      const cellularConnectionStatus = parts[10]

      if (vin !== undefined) {
        this.setMetric({ key: 's.v.vin', value: vin })
        if (vin != this.currentVehicle.vin) {
          console.log('[platform OVMSv2Api] update vehicle vin', vin, this.currentVehicle.vin)
          store.dispatch(vehiclesSlice.actions.updateVehicleVIN({ key: this.currentVehicle.key, newValue: vin }))
        }
      }
      if (firmwareVersion !== undefined) { this.setMetric({ key: 'm.version', value: firmwareVersion }) }
      if (networkSignalQuality !== undefined) { this.setMetric({ key: 'm.net.sq', value: networkSignalQuality, unit: "SQ" }) }
      if (vehicleTypeCode !== undefined) { this.setMetric({ key: 'v.type', value: vehicleTypeCode }) }
      if (networkName !== undefined) { this.setMetric({ key: 'm.net.provider', value: networkName }) }
      if (ovmsHardwareVersion !== undefined) { this.setMetric({ key: 'm.hardware', value: ovmsHardwareVersion }) }
      if (distanceToNextMaintenance !== undefined) { this.setMetric({ key: 'e.service.range', value: distanceToNextMaintenance, unit: this.distanceUnits }) }
      if (timeToNextMaintenance !== undefined) { this.setMetric({ key: 'e.service.time', value: timeToNextMaintenance, unit: "s" }) }
      if (cellularConnectionMode !== undefined) { this.setMetric({ key: 'm.net.mdm.mode', value: cellularConnectionMode }) }

    } else if (event.data.startsWith('S')) {
      const parts = event.data.substring(1).split(',')
      console.log('[platform OVMSv2Api] rx STATE', parts)

      const soc = parts[0]
      const units = parts[1] == "K" ? "km" : "mi"
      const lineVoltage = parts[2]
      const chargeCurrent = parts[3]
      const chargeState = parts[4]
      const chargeMode = parts[5]
      const idealRange = parts[6]
      const estimatedRange = parts[7]
      const chargeLimit = parts[8]
      const chargeDuration = parts[9]
      const chargerB4 = parts[10]
      const chargeEnergyConsumed = parts[11]
      const chargeSubState = parts[12]
      const chargeStateN = parts[13]
      const chargeModeN = parts[14]
      const chargeTimerMode = parts[15]
      const chargeTimerStartTime = parts[16]
      const staleChargeTimerIndicator = parts[17] < 0 ? undefined : (parts[17] == 0)
      const vehicleCac100 = parts[18]
      const accMinsRemainingUntilFull = parts[19]
      const accMinsRemainingUntilLimit = parts[20]
      const accConfiguredRangeLimit = parts[21]
      const accConfiguredSOCLimit = parts[22]
      const cooldown = parts[23]
      const cooldownLowerLimit = parts[24]
      const cooldownTimeLimit = parts[25]
      const etrMinsRemainingCurrentCondition = parts[26]
      const etrMinsRemainingUntilRange = parts[27]
      const etrMinsRemainingUntilLimit = parts[28]
      const maxIdealRange = parts[29]
      const chargePlugType = parts[30]
      const chargePowerOutput = parts[31]
      const batteryVoltage = parts[32]
      const batterySOH = parts[33]
      const chargePowerInput = parts[34]
      const chargerEfficiency = parts[35]
      const batteryCurrent = parts[36]
      const batteryIdealRangeGainLossSpeed = parts[37]
      const energySumForRunningCharge = parts[38]
      const energyDrawnForRunningCharge = parts[39]
      const mainBatteryUsableCapacity = parts[40]
      const dateAndTimeOfLastChargeEnd = parts[41]

      if (this.distanceUnits != units) { this.distanceUnits = units }
      this.speedUnits = (this.distanceUnits == "km") ? "km/h" : "mph"

      if (soc !== undefined) { this.setMetric({ key: 'v.b.soc', value: soc }) }
      if (lineVoltage !== undefined) { this.setMetric({ key: 'v.c.voltage', value: lineVoltage, unit: "V" }) }
      if (chargeCurrent !== undefined) { this.setMetric({ key: 'v.c.current', value: chargeCurrent, unit: "A" }) }
      if (chargeState !== undefined) { this.setMetric({ key: 'v.c.state', value: chargeState }) }
      if (chargeMode !== undefined) { this.setMetric({ key: 'v.c.mode', value: chargeMode }) }
      if (idealRange !== undefined) { this.setMetric({ key: 'v.b.range.ideal', value: idealRange, unit: units }) }
      if (estimatedRange !== undefined) { this.setMetric({ key: 'v.b.range.est', value: estimatedRange, unit: units }) }
      if (chargeLimit !== undefined) { this.setMetric({ key: 'v.c.climit', value: chargeLimit, unit: "A" }) }
      if (chargeDuration !== undefined) { this.setMetric({ key: 'v.c.time', value: chargeDuration, unit: "min" }) }
      if (chargeEnergyConsumed !== undefined) { this.setMetric({ key: 'v.c.kwh', value: chargeEnergyConsumed, unit: "kWh" }) }
      if (chargeSubState !== undefined) { this.setMetric({ key: 'v.c.substate', value: chargeSubState }) }
      if (chargeTimerMode !== undefined) { this.setMetric({ key: 'v.c.timermode', value: chargeTimerMode, stale: staleChargeTimerIndicator }) }
      if (chargeTimerStartTime !== undefined) { this.setMetric({ key: 'v.c.timerstart', value: chargeTimerStartTime, unit: "s", stale: staleChargeTimerIndicator }) }
      if (vehicleCac100 !== undefined) { this.setMetric({ key: 'v.b.cac100', value: vehicleCac100, unit: "Ah" }) }
      if (accMinsRemainingUntilFull !== undefined) { this.setMetric({ key: 'v.c.duration.full', value: accMinsRemainingUntilFull, unit: "min" }) }
      if (accMinsRemainingUntilLimit !== undefined) { this.setMetric({ key: 'v.c.duration.range', value: accMinsRemainingUntilLimit, unit: "min" }) }
      if (accConfiguredRangeLimit !== undefined) { this.setMetric({ key: 'v.c.limit.range', value: accConfiguredRangeLimit, unit: units }) }
      if (accConfiguredSOCLimit !== undefined) { this.setMetric({ key: 'v.c.limit.soc', value: accConfiguredSOCLimit, unit: "%" }) }
      if (cooldown !== undefined) { this.setMetric({ key: 'v.e.cooling', value: cooldown }) }
      if (etrMinsRemainingUntilRange !== undefined) { this.setMetric({ key: 'v.c.duration.range', value: etrMinsRemainingUntilRange, unit: "min" }) }
      if (etrMinsRemainingUntilLimit !== undefined) { this.setMetric({ key: 'v.c.duration.soc', value: etrMinsRemainingUntilLimit, unit: "min" }) }
      if (maxIdealRange !== undefined) { this.setMetric({ key: 'v.b.range.full', value: maxIdealRange, unit: units }) }
      if (chargePowerOutput !== undefined) { this.setMetric({ key: 'v.b.power', value: chargePowerOutput, unit: "W" }) }
      if (batteryVoltage !== undefined) { this.setMetric({ key: 'v.b.voltage', value: batteryVoltage, unit: "V" }) }
      if (batterySOH !== undefined) { this.setMetric({ key: 'v.b.soh', value: batterySOH }) }
      if (chargePowerInput !== undefined) { this.setMetric({ key: 'v.c.power', value: chargePowerInput, unit: "W" }) }
      if (chargerEfficiency !== undefined) { this.setMetric({ key: 'v.c.efficiency', value: chargerEfficiency, unit: "%" }) }
      if (batteryCurrent !== undefined) { this.setMetric({ key: 'v.b.current', value: batteryCurrent, unit: "A" }) }
      if (batteryIdealRangeGainLossSpeed !== undefined) { this.setMetric({ key: 'v.b.range.speed', value: batteryIdealRangeGainLossSpeed, unit: this.speedUnits }) }
      if (energySumForRunningCharge !== undefined) { this.setMetric({ key: 'v.c.kwh_grid', value: energySumForRunningCharge, unit: "kWh" }) }
      if (energyDrawnForRunningCharge !== undefined) { this.setMetric({ key: 'v.c.kwh_grid_total', value: energyDrawnForRunningCharge, unit: "kWh" }) }
      if (mainBatteryUsableCapacity !== undefined) { this.setMetric({ key: 'v.b.capacity', value: mainBatteryUsableCapacity, unit: "Ah" }) }
      if (dateAndTimeOfLastChargeEnd !== undefined) { this.setMetric({ key: 'v.c.timestamp', value: dateAndTimeOfLastChargeEnd }) }

    } else if (event.data.startsWith('L')) {
      const parts = event.data.substring(1).split(',')
      console.log('[platform OVMSv2Api] rx LOCATION', parts)

      const latitude = parts[0]
      const longitude = parts[1]
      const carDirection = parts[2]
      const carAltitude = parts[3]
      const carGpsLock = parts[4]
      const staleGpsIndicator = parts[5] < 0 ? true : (parts[5] == 0)
      const carSpeed = parts[6]
      const carTripMeter = parts[7]
      const driveMode = parts[8]
      const batteryPowerLevel = parts[9]
      const energyUsed = parts[10]
      const energyRecovered = parts[11]
      const inverterMotorPower = parts[12]
      const inverterEfficiency = parts[13]
      const gpsModeIndicator = parts[14]
      const gpsSatelliteCount = parts[15]
      const gpsHdop = parts[16]
      const gpsSpeed = parts[17]
      const gpsSignalQuality = parts[18]

      if (latitude !== undefined) { this.setMetric({ key: 'v.p.latitude', value: latitude, stale: staleGpsIndicator }) }
      if (longitude !== undefined) { this.setMetric({ key: 'v.p.longitude', value: longitude, stale: staleGpsIndicator }) }
      if (carDirection !== undefined) { this.setMetric({ key: 'v.p.direction', value: carDirection, stale: staleGpsIndicator }) }
      if (carAltitude !== undefined) { this.setMetric({ key: 'v.p.altitude', value: carAltitude, stale: staleGpsIndicator }) }
      if (carGpsLock !== undefined) { this.setMetric({ key: 'v.p.gpslock', value: carGpsLock, stale: staleGpsIndicator }) }
      if (carSpeed !== undefined) { this.setMetric({ key: 'v.p.speed', value: carSpeed, unit: this.speedUnits, stale: staleGpsIndicator }) }
      if (carTripMeter !== undefined) { this.setMetric({ key: 'v.p.trip', value: carTripMeter, unit: this.distanceUnits, stale: staleGpsIndicator }) }
      if (driveMode !== undefined) { this.setMetric({ key: 'v.e.drivemode', value: driveMode }) }
      if (batteryPowerLevel !== undefined) { this.setMetric({ key: 'v.b.power', value: batteryPowerLevel, unit: "W" }) }
      if (energyUsed !== undefined) { this.setMetric({ key: 'v.b.energy_used', value: energyUsed, unit: "kWh" }) }
      if (energyRecovered !== undefined) { this.setMetric({ key: 'v.b.energy_recd', value: energyRecovered, unit: "kWh" }) }
      if (inverterMotorPower !== undefined) { this.setMetric({ key: 'v.i.power', value: inverterMotorPower, unit: "W" }) }
      if (inverterEfficiency !== undefined) { this.setMetric({ key: 'v.i.efficiency', value: inverterEfficiency, unit: "%" }) }
      if (gpsModeIndicator !== undefined) { this.setMetric({ key: 'v.p.gpsmode', value: gpsModeIndicator }) }
      if (gpsSatelliteCount !== undefined) { this.setMetric({ key: 'v.p.satcount', value: gpsSatelliteCount, stale: staleGpsIndicator }) }
      if (gpsHdop !== undefined) { this.setMetric({ key: 'v.p.gpshdop', value: gpsHdop, stale: staleGpsIndicator }) }
      if (gpsSpeed !== undefined) { this.setMetric({ key: 'v.p.gpsspeed', value: gpsSpeed, unit: this.speedUnits, stale: staleGpsIndicator }) }
      if (gpsSignalQuality !== undefined) { this.setMetric({ key: 'v.p.gpssq', value: gpsSignalQuality, unit: "%", stale: staleGpsIndicator }) }

    } else if (event.data.startsWith('W')) {
      const parts = event.data.substring(1).split(',')
      console.log('[platform OVMSv2Api] rx TPMS(W)', parts)

      const frontRightWheelPressure = parts[0]
      const frontRightWheelTemperature = parts[1]
      const rearRightWheelPressure = parts[2]
      const rearRightWheelTemperature = parts[3]
      const frontLeftWheelPressure = parts[4]
      const frontLeftWheelTemperature = parts[5]
      const rearLeftWheelPressure = parts[6]
      const rearLeftWheelTemperature = parts[7]
      const staleTpmsIndicator = parts[8] < 0 ? undefined : (parts[8] == 0)

      if (frontLeftWheelPressure !== undefined) { this.setMetric({ key: 'v.tp.fl.p', value: frontLeftWheelPressure, unit: "psi", stale: staleTpmsIndicator }) }
      if (frontLeftWheelTemperature !== undefined) { this.setMetric({ key: 'v.tp.fl.t', value: frontLeftWheelTemperature, unit: "°C", stale: staleTpmsIndicator }) }
      if (frontRightWheelPressure !== undefined) { this.setMetric({ key: 'v.tp.fr.p', value: frontRightWheelPressure, unit: "psi", stale: staleTpmsIndicator }) }
      if (frontRightWheelTemperature !== undefined) { this.setMetric({ key: 'v.tp.fr.t', value: frontRightWheelTemperature, unit: "°C", stale: staleTpmsIndicator }) }
      if (rearRightWheelPressure !== undefined) { this.setMetric({ key: 'v.tp.rr.p', value: rearRightWheelPressure, unit: "psi", stale: staleTpmsIndicator }) }
      if (rearRightWheelTemperature !== undefined) { this.setMetric({ key: 'v.tp.rr.t', value: rearRightWheelTemperature, unit: "°C", stale: staleTpmsIndicator }) }
      if (rearLeftWheelPressure !== undefined) { this.setMetric({ key: 'v.tp.rl.p', value: rearLeftWheelPressure, unit: "psi", stale: staleTpmsIndicator }) }
      if (rearLeftWheelTemperature !== undefined) { this.setMetric({ key: 'v.tp.rl.t', value: rearLeftWheelTemperature, unit: "°C", stale: staleTpmsIndicator }) }

    } else if (event.data.startsWith('T')) {
      const parts = event.data.substring(1).split(',')
      console.log('[platform OVMSv2Api] rx TIME', parts)

      const seconds = Number(parts[0])
      this.setLastUpdateTime(seconds)

    } else if (event.data.startsWith('Z')) {
      const parts = event.data.substring(1).split(',')
      console.log('[platform OVMSv2Api] rx PEERS', parts)
      const peerConnectionCount = parts[0]

      this.setMetric({ key: 's.v2.peers', value: peerConnectionCount })
      this.setCarConnected(peerConnectionCount > 0)

    } else if (event.data.startsWith('f')) {
      const parts = event.data.substring(1).split(',')
      console.log('[platform OVMSv2Api] rx SERVER', parts)

      const serverFirmwareVersion = parts[0]

    } else if (event.data.startsWith('a')) {
      const parts = event.data.substring(1).split(',')
      console.log('[platform OVMSv2Api] rx PING RESPONSE', parts)

    } else if (event.data.startsWith('D')) {
      const parts = event.data.substring(1).split(',')
      console.log('[platform OVMSv2Api] rx DOORS', parts)

      const frontLeftDoorState = (1 & parts[0]) != 0
      const frontRightDoorState = (1 << 1 & parts[0]) != 0
      const ChargePortState = (1 << 2 & parts[0]) != 0
      const pilotState = (1 << 3 & parts[0]) != 0
      const chargingState = (1 << 4 & parts[0]) != 0
      const handbrakeState = (1 << 6 & parts[0]) != 0
      const carOnState = (1 << 7 & parts[0]) != 0
      const carLockedState = (1 << 3 & parts[1]) != 0
      const carValetState = (1 << 4 & parts[1]) != 0
      const carHoodState = (1 << 6 & parts[1]) != 0
      const carTrunkState = (1 << 7 & parts[1]) != 0
      const pemTemperature = parts[3]
      const motorTemperature = parts[4]
      const batteryTemperature = parts[5]
      const carTripMeter = parts[6]
      const carOdometer = parts[7]
      const carSpeed = parts[8]
      const carParkingTimer = parts[9]
      const ambientTemperature = parts[10]
      const carAwakeState = (1 & parts[11]) != 0
      const carCoolingState = (1 << 1 & parts[11]) != 0
      const carLoggedInState = (1 << 6 & parts[11]) != 0
      const carConfigState = (1 << 7 & parts[11]) != 0
      const staleTemperatures = parts[12] < 0 ? undefined : (parts[8] == 0)
      const staleAmbientTemperature = parts[12] < 0 ? undefined : (parts[8] == 0)
      const vehicle12VLineVoltage = parts[14]
      const alarmSoundingState = (1 << 2 & parts[15]) != 0
      const vehicle12VReferenceVoltage = parts[16]
      const rearLeftDoorState = (1 & parts[17]) != 0
      const rearRightDoorState = (1 << 1 & parts[17]) != 0
      const frunkState = (1 << 2 & parts[17]) != 0
      const charging12vState = (1 << 4 & parts[17]) != 0
      const aux12VState = (1 << 5 & parts[17]) != 0
      const hvacState = (1 << 7 & parts[17]) != 0
      const vehicleChargerTemperature = parts[18]
      const vehicle12VCurrent = parts[19]
      const vehicleCabinTemperature = parts[20]

      if (frontLeftDoorState !== undefined) { this.setMetric({ key: 'v.d.fl', value: frontLeftDoorState ? "open" : "closed" }) }
      if (frontRightDoorState !== undefined) { this.setMetric({ key: 'v.d.fr', value: frontRightDoorState ? "open" : "closed" }) }
      if (ChargePortState !== undefined) { this.setMetric({ key: 'v.d.chargeport', value: ChargePortState ? "open" : "closed" }) }
      if (pilotState !== undefined) { this.setMetric({ key: 'v.c.pilot', value: pilotState ? "yes" : "no" }) }
      if (chargingState !== undefined) { this.setMetric({ key: 'v.c.inprogress', value: chargingState ? "yes" : "no" }) }
      if (handbrakeState !== undefined) { this.setMetric({ key: 'v.e.handbrake', value: handbrakeState ? "on" : "off" }) }
      if (carOnState !== undefined) { this.setMetric({ key: 'v.e.on', value: carOnState ? "on" : "off" }) }
      if (carLockedState !== undefined) { this.setMetric({ key: 'v.e.locked', value: carLockedState ? "locked" : "unlocked" }) }
      if (carValetState !== undefined) { this.setMetric({ key: 'v.e.valet', value: carValetState ? "yes" : "no" }) }
      if (carHoodState !== undefined) { this.setMetric({ key: 'v.d.hood', value: carHoodState ? "open" : "closed" }) }
      if (carTrunkState !== undefined) { this.setMetric({ key: 'v.d.trunk', value: carTrunkState ? "open" : "closed" }) }
      if (carOdometer !== undefined) { this.setMetric({ key: 'v.p.odometer', value: (carOdometer / 10).toString(), unit: this.distanceUnits }) }
      if (carSpeed !== undefined) { this.setMetric({ key: 'v.p.speed', value: carSpeed, unit: this.speedUnits }) }
      if (carParkingTimer !== undefined) { this.setMetric({ key: 'v.e.parktime', value: carParkingTimer, unit: "s" }) }
      if (carTripMeter !== undefined) { this.setMetric({ key: 'v.p.trip', value: (carTripMeter / 10).toString(), unit: this.distanceUnits }) }
      if (vehicleCabinTemperature !== undefined) { this.setMetric({ key: 'v.e.cabintemp', value: vehicleCabinTemperature }) }
      if (batteryTemperature !== undefined) { this.setMetric({ key: 'v.b.temp', value: batteryTemperature, unit: "°C", stale: staleTemperatures }) }
      if (motorTemperature !== undefined) { this.setMetric({ key: 'v.m.temp', value: motorTemperature, unit: "°C", stale: staleTemperatures }) }
      if (pemTemperature !== undefined) { this.setMetric({ key: 'v.i.temp', value: pemTemperature, unit: "°C", stale: staleTemperatures }) }
      if (ambientTemperature !== undefined) { this.setMetric({ key: 'v.e.temp', value: ambientTemperature, unit: "°C", stale: staleAmbientTemperature }) }
      if (carAwakeState !== undefined) { this.setMetric({ key: 'v.e.awake12', value: carAwakeState ? "awake" : "sleeping" }) }
      if (carCoolingState !== undefined) { this.setMetric({ key: 'v.e.cooling', value: carCoolingState ? "on" : "off" }) }
      if (carLoggedInState !== undefined) { this.setMetric({ key: 'v.e.ctrl.login', value: carLoggedInState ? "yes" : "no" }) }
      if (carConfigState !== undefined) { this.setMetric({ key: 'v.e.ctrl.config', value: carConfigState ? "yes" : "no" }) }
      if (vehicle12VLineVoltage !== undefined) { this.setMetric({ key: 'v.b.12v.voltage', value: vehicle12VLineVoltage, unit: "V" }) }
      if (alarmSoundingState !== undefined) { this.setMetric({ key: 'v.e.alarm', value: alarmSoundingState ? "on" : "off" }) }
      if (vehicle12VReferenceVoltage !== undefined) { this.setMetric({ key: 'v.b.12v.voltage_ref', value: vehicle12VReferenceVoltage, unit: "V" }) }
      if (rearLeftDoorState !== undefined) { this.setMetric({ key: 'v.d.rl', value: rearLeftDoorState ? "open" : "closed" }) }
      if (rearRightDoorState !== undefined) { this.setMetric({ key: 'v.d.rr', value: rearRightDoorState ? "open" : "closed" }) }
      if (frunkState !== undefined) { this.setMetric({ key: 'v.d.hood', value: frunkState ? "open" : "closed" }) }
      if (hvacState !== undefined) { this.setMetric({ key: 'v.e.hvac', value: hvacState ? "on" : "off" }) }
      if (vehicleChargerTemperature !== undefined) { this.setMetric({ key: 'v.c.temp', value: vehicleChargerTemperature, unit: "°C", stale: staleTemperatures }) }
      if (vehicle12VCurrent !== undefined) { this.setMetric({ key: 'v.b.12v.current', value: vehicle12VCurrent, unit: "A" }) }
      if (vehicleCabinTemperature !== undefined) { this.setMetric({ key: 'v.e.cabintemp', value: vehicleCabinTemperature }) }

    } else if (event.data.startsWith('P')) {
      const type = event.data.substring(1, 2)
      const message = event.data.substring(2)
      console.log('[platform OVMSv2Api] rx MESSAGE(PUSH)', type, message)

      // Assume this arrives as a push notification, so don't add the message directly
      // dispatch(messagesSlice.actions.addVehicleMessage({ text: message, vehicleKey: selectedVehicle?.key, vehicleName: selectedVehicle?.name }))

    } else if (event.data.startsWith('c')) {

      // This is a command response - parse and handle appropriately
      // Format: 'c' + command code + comma + result + comma + parameters
      // Command code can be more than one digit, so we need to find the first comma after 'c'
      const afterC = event.data.substring(1) // Everything after 'c'
      const firstCommaIndex = afterC.indexOf(',')
      if (firstCommaIndex !== -1) {
        const commandCodeStr = afterC.substring(0, firstCommaIndex) // Get the command code (can be multi-digit)
        const commandCode = parseInt(commandCodeStr) // Convert to number for Map lookup
        const afterCommandCode = afterC.substring(firstCommaIndex + 1) // Everything after the command code and first comma
        const secondCommaIndex = afterCommandCode.indexOf(',') // Find the second comma to separate result from parameters
        if (secondCommaIndex !== -1) {
          const result = parseInt(afterCommandCode.substring(0, secondCommaIndex))
          const parameters = afterCommandCode.substring(secondCommaIndex + 1) // Everything after the second comma
          console.log('[platform OVMSv2Api] rx COMMAND RESPONSE', commandCode, result, parameters)
          this.resolveNextPendingCommand(commandCode, result, parameters);
        } else {
          const result = parseInt(afterCommandCode)
          console.log('[platform OVMSv2Api] rx COMMAND RESPONSE (no parameters)', commandCode, result)
          this.resolveNextPendingCommand(commandCode, result, "");
        }
      } else {
        console.log('[platform OVMSv2Api] Invalid command response format:', event.data)
      }

    } else {
      console.log('[platform OVMSv2Api] rx event data', event.data)
    }
  }

  connect() {
    console.log("[platform OVMSv2Api] connect", this.currentVehicle.name);

    this.setConnectionState(VehicleConnectionState.CONNECTING)

    if (this.connection) {
      this.connection.removeEventListener('open', this.openListener)
      this.connection.removeEventListener('message', this.messageListener)
      this.connection.removeEventListener('close', this.closeListener)
      if (this.keepaliveTimer) {
        clearInterval(this.keepaliveTimer)
        this.keepaliveTimer = null
      }
      if (this.reconnectTimer) {
        clearInterval(this.reconnectTimer)
        this.reconnectTimer = null
      }
      this.cleanupPendingCommands()
      this.connection.close();
      this.connection = null;
    }

    const serverurl = `wss://${this.currentVehicle.platformParameters?.server}:${this.currentVehicle.platformParameters?.wssport}/apiv2`;
    console.log('[platform OVMSv2Api] connection', serverurl, this.connection)
    this.connection = new WebSocket(serverurl)
    this.connection.addEventListener('open', this.openListener)
    this.connection.addEventListener('message', this.messageListener)
    this.connection.addEventListener('close', this.closeListener)
    this.keepaliveTimer = setInterval(this.keepaliveListener, KEEPALIVE_INTERVAL)
  }

  disconnect() {
    if (this.connection) {
      console.log("[platform OVMSv2Api] disconnect", this.currentVehicle.name);

      this.setConnectionState(VehicleConnectionState.DISCONNECTED)
      this.connection.removeEventListener('open', this.openListener)
      this.connection.removeEventListener('message', this.messageListener)
      this.connection.removeEventListener('close', this.closeListener)
      if (this.keepaliveTimer) {
        clearInterval(this.keepaliveTimer)
        this.keepaliveTimer = null
      }
      if (this.reconnectTimer) {
        clearInterval(this.reconnectTimer)
        this.reconnectTimer = null
      }
      this.cleanupPendingCommands()
      this.connection.close();
      this.connection = null;
    }
  }

}