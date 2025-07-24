import React, { useEffect, useState } from "react"
import { Icon } from "react-native-paper"
import { useDispatch, useSelector } from "react-redux";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { vehiclesSlice } from "@/store/vehiclesSlice";
import { metricsSlice } from "@/store/metricsSlice";
import { VehicleConnectionState, connectionSlice, setConnectionState, setLastUpdateTime } from "@/store/connectionSlice";
import { GetCurrentUTCTimeStamp } from "../utils/datetime";
import { useInterval } from "@/hooks/useInterval";
import { messagesSlice } from "@/store/messagesSlice";
import { ConnectionDisplay } from "../ui/ConnectionDisplay";
import { notificationsEnabled, notificationsToken, notificationsUniqueID } from "@/store/notificationSlice";

let connection: WebSocket | null = null;

// Queue for pending command promises
interface PendingCommand {
  resolve: (value: string) => void;
  reject: (reason: any) => void;
  timeoutId: number;
}

let pendingCommands: PendingCommand[] = [];

/**
 * Sends a textual command to OVMSv2 platform via WebSocket
 * @param commandText - The command text to send
 * @returns Promise<string> - The textual result of the command
 */
export async function sendOVMSv2TextCommand(commandText: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log('[sendOVMSv2TextCommand] commandText', commandText)
    if (!connection || connection.readyState !== WebSocket.OPEN) {
      console.log('[sendOVMSv2TextCommand] connection is not available')
      reject(new Error("OVMSv2 WebSocket connection is not available"));
      return;
    }

    // Set up timeout for this command
    const timeoutId = setTimeout(() => {
      // Remove this command from the queue
      console.log('[sendOVMSv2TextCommand] command timed out', timeoutId)
      const index = pendingCommands.findIndex(cmd => cmd.timeoutId === timeoutId);
      if (index !== -1) {
        pendingCommands[index].resolve('ERROR: command timed out');
        pendingCommands.splice(index, 1);
      }
    }, 10000); // 10 second timeout

    // Add command to the queue
    pendingCommands.push({ resolve, reject, timeoutId });

    // Send the command in OVMSv2 format: 'C' + command code + comma + parameters
    // For textual commands, use code 7
    const commandMessage = `C7,${commandText}`;
    console.log(`[sendOVMSv2TextCommand] Sending command: ${commandMessage}`);
    connection.send(commandMessage);
  });
}

/**
 * Resolves the next pending command with the given response
 * @param response - The response from the vehicle
 */
function resolveNextPendingCommand(response: string) {
  console.log('[resolveNextPendingCommand] response', response)
  if (pendingCommands.length > 0) {
    const nextCommand = pendingCommands.shift();
    if (nextCommand) {
      clearTimeout(nextCommand.timeoutId);
      nextCommand.resolve(response);
    }
  }
}

export function OVMSv2ConnectionIcon(): React.JSX.Element {
  const selectedVehicle = useSelector(getSelectedVehicle);
  const notificationEnabled = useSelector(notificationsEnabled);
  const notificationToken = useSelector(notificationsToken);
  const notificationUniqueID = useSelector(notificationsUniqueID);

  const dispatch = useDispatch();

  const [distanceUnits, setDistanceUnits] = useState("km")
  const speedUnits = distanceUnits == "km" ? "km/h" : "mph"

  useInterval(() => {
    if (connection && connection.readyState === WebSocket.OPEN) {
      console.log('[connection OVMSv2] tx ping')
      connection.send('A')
    }
  }, 60000);

  useEffect(() => {
    console.log("[connection OVMSv2] start", selectedVehicle?.name)

    const serverurl = `wss://${selectedVehicle?.platformParameters?.server}:${selectedVehicle?.platformParameters?.wssport}/apiv2`;
    dispatch(connectionSlice.actions.setConnectionState(VehicleConnectionState.CONNECTING))
    connection = new WebSocket(serverurl)
    console.log('[connection OVMSv2] connection', serverurl, connection)

    // Send authentication message when connection opens
    const openListener = () => {
      console.log('[connection OVMSv2] connection opened')
      dispatch(connectionSlice.actions.setConnectionState(VehicleConnectionState.AUTHENTICATING))
      const authMessage = `MP-A 1 ${selectedVehicle?.platformParameters?.username} ${selectedVehicle?.platformParameters?.password} ${selectedVehicle?.platformParameters?.id}`
      console.log('[connection OVMSv2] tx auth', authMessage)
      connection?.send(authMessage)
    }

    const closeListener = () => {
      console.log('[connection OVMSv2] connection closed')
      dispatch(connectionSlice.actions.setConnectionState(VehicleConnectionState.DISCONNECTED))
    }

    const messageListener = (event: MessageEvent) => {

      if (event.data.startsWith('MP-S')) {
        console.log('[connection OVMSv2] rx LOGIN(RESULT)', event.data)
        dispatch(connectionSlice.actions.setConnectionState(VehicleConnectionState.CONNECTED))
        if (notificationEnabled) {
          const subscribeMessage = `p${notificationUniqueID},expo,simple,${notificationToken}`
          connection?.send(subscribeMessage)
          console.log('[connection OVMSv2] tx subscribe', subscribeMessage)
        }

      } else if (event.data.startsWith('F')) {
        const parts = event.data.substring(1).split(',')
        console.log('[connection OVMSv2] rx FIRMWARE', parts)
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
          dispatch(metricsSlice.actions.setMetric({ key: 's.v.vin', value: vin }))
          if ((vin != selectedVehicle?.vin) && (selectedVehicle?.key)) {
            console.log('[connection OVMSv2] update vehicle vin', vin, selectedVehicle?.vin)
            dispatch(vehiclesSlice.actions.updateVehicleVIN({ key: selectedVehicle?.key, newValue: vin }))
          }
        }
        if (firmwareVersion !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'm.version', value: firmwareVersion })) }
        if (networkSignalQuality !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'm.net.sq', value: networkSignalQuality, unit: "SQ" })) }
        if (vehicleTypeCode !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.type', value: vehicleTypeCode })) }
        if (networkName !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'm.net.provider', value: networkName })) }
        if (ovmsHardwareVersion !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'm.hardware', value: ovmsHardwareVersion })) }
        if (distanceToNextMaintenance !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'e.service.range', value: distanceToNextMaintenance, unit: distanceUnits })) }
        if (timeToNextMaintenance !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'e.service.time', value: timeToNextMaintenance, unit: "s" })) }
        if (cellularConnectionMode !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'm.net.mdm.mode', value: cellularConnectionMode })) }

      } else if (event.data.startsWith('S')) {
        const parts = event.data.substring(1).split(',')
        console.log('[connection OVMSv2] rx STATE', parts)
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

        if (distanceUnits != units) { setDistanceUnits(units) }
        if (soc !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.soc', value: soc })) }
        if (lineVoltage !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.voltage', value: lineVoltage, unit: "V" })) }
        if (chargeCurrent !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.current', value: chargeCurrent, unit: "A" })) }
        if (chargeState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.state', value: chargeState })) }
        if (chargeMode !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.mode', value: chargeMode })) }
        if (idealRange !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.range.ideal', value: idealRange, unit: units })) }
        if (estimatedRange !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.range.est', value: estimatedRange, unit: units })) }
        if (chargeLimit !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.climit', value: chargeLimit, unit: "A" })) }
        if (chargeDuration !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.time', value: chargeDuration, unit: "min" })) }
        if (chargeEnergyConsumed !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.kwh', value: chargeEnergyConsumed, unit: "kWh" })) }
        if (chargeSubState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.substate', value: chargeSubState })) }
        if (chargeTimerMode !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.timermode', value: chargeTimerMode, stale: staleChargeTimerIndicator })) }
        if (chargeTimerStartTime !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.timerstart', value: chargeTimerStartTime, unit: "s", stale: staleChargeTimerIndicator })) }
        if (vehicleCac100 !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.cac100', value: vehicleCac100, unit: "Ah" })) }
        if (accMinsRemainingUntilFull !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.duration.full', value: accMinsRemainingUntilFull, unit: "min" })) }
        if (accMinsRemainingUntilLimit !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.duration.range', value: accMinsRemainingUntilLimit, unit: "min" })) }
        if (accConfiguredRangeLimit !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.limit.range', value: accConfiguredRangeLimit, unit: units })) }
        if (accConfiguredSOCLimit !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.limit.soc', value: accConfiguredSOCLimit, unit: "%" })) }
        if (cooldown !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.cooling', value: cooldown })) }
        if (etrMinsRemainingUntilRange !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.duration.range', value: etrMinsRemainingUntilRange, unit: "min" })) }
        if (etrMinsRemainingUntilLimit !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.duration.soc', value: etrMinsRemainingUntilLimit, unit: "min" })) }
        if (maxIdealRange !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.range.full', value: maxIdealRange, unit: units })) }
        if (chargePowerOutput !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.power', value: chargePowerOutput, unit: "W" })) }
        if (batteryVoltage !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.voltage', value: batteryVoltage, unit: "V" })) }
        if (batterySOH !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.soh', value: batterySOH })) }
        if (chargePowerInput !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.power', value: chargePowerInput, unit: "W" })) }
        if (chargerEfficiency !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.efficiency', value: chargerEfficiency, unit: "%" })) }
        if (batteryCurrent !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.current', value: batteryCurrent, unit: "A" })) }
        if (batteryIdealRangeGainLossSpeed !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.range.speed', value: batteryIdealRangeGainLossSpeed, unit: speedUnits })) }
        if (energySumForRunningCharge !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.kwh_grid', value: energySumForRunningCharge, unit: "kWh" })) }
        if (energyDrawnForRunningCharge !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.kwh_grid_total', value: energyDrawnForRunningCharge, unit: "kWh" })) }
        if (mainBatteryUsableCapacity !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.capacity', value: mainBatteryUsableCapacity, unit: "Ah" })) }
        if (dateAndTimeOfLastChargeEnd !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.timestamp', value: dateAndTimeOfLastChargeEnd })) }

      } else if (event.data.startsWith('L')) {
        const parts = event.data.substring(1).split(',')
        console.log('[connection OVMSv2] rx LOCATION', parts)
        const latitude = parts[0]
        const longitude = parts[1]
        const carDirection = parts[2]
        const carAltitude = parts[3]
        const carGpsLock = parts[4]
        const staleGpsIndicator = parts[5] < 0 ? undefined : (parts[5] == 0)
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

        if (latitude !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.latitude', value: latitude, stale: staleGpsIndicator })) }
        if (longitude !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.longitude', value: longitude, stale: staleGpsIndicator })) }
        if (carDirection !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.direction', value: carDirection, stale: staleGpsIndicator })) }
        if (carAltitude !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.altitude', value: carAltitude, stale: staleGpsIndicator })) }
        if (carGpsLock !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.gpslock', value: carGpsLock, stale: staleGpsIndicator })) }
        if (carSpeed !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.speed', value: carSpeed, unit: speedUnits, stale: staleGpsIndicator })) }
        if (carTripMeter !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.trip', value: carTripMeter, unit: distanceUnits, stale: staleGpsIndicator })) }
        if (driveMode !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.drivemode', value: driveMode })) }
        if (batteryPowerLevel !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.power', value: batteryPowerLevel, unit: "W" })) }
        if (energyUsed !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.energy_used', value: energyUsed, unit: "kWh" })) }
        if (energyRecovered !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.energy_recd', value: energyRecovered, unit: "kWh" })) }
        if (inverterMotorPower !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.i.power', value: inverterMotorPower, unit: "W" })) }
        if (inverterEfficiency !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.i.efficiency', value: inverterEfficiency, unit: "%" })) }
        if (gpsModeIndicator !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.gpsmode', value: gpsModeIndicator })) }
        if (gpsSatelliteCount !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.satcount', value: gpsSatelliteCount, stale: staleGpsIndicator })) }
        if (gpsHdop !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.gpshdop', value: gpsHdop, stale: staleGpsIndicator })) }
        if (gpsSpeed !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.gpsspeed', value: gpsSpeed, unit: speedUnits, stale: staleGpsIndicator })) }
        if (gpsSignalQuality !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.gpssq', value: gpsSignalQuality, unit: "%", stale: staleGpsIndicator })) }

      } else if (event.data.startsWith('W')) {
        const parts = event.data.substring(1).split(',')
        console.log('[connection OVMSv2] rx TPMS(W)', parts)
        const frontRightWheelPressure = parts[0]
        const frontRightWheelTemperature = parts[1]
        const rearRightWheelPressure = parts[2]
        const rearRightWheelTemperature = parts[3]
        const frontLeftWheelPressure = parts[4]
        const frontLeftWheelTemperature = parts[5]
        const rearLeftWheelPressure = parts[6]
        const rearLeftWheelTemperature = parts[7]
        const staleTpmsIndicator = parts[8] < 0 ? undefined : (parts[8] == 0)

        if (frontLeftWheelPressure !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.tp.fl.p', value: frontLeftWheelPressure, unit: "psi", stale: staleTpmsIndicator })) }
        if (frontLeftWheelTemperature !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.tp.fl.t', value: frontLeftWheelTemperature, unit: "C", stale: staleTpmsIndicator })) }
        if (frontRightWheelPressure !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.tp.fr.p', value: frontRightWheelPressure, unit: "psi", stale: staleTpmsIndicator })) }
        if (frontRightWheelTemperature !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.tp.fr.t', value: frontRightWheelTemperature, unit: "C", stale: staleTpmsIndicator })) }
        if (rearRightWheelPressure !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.tp.rr.p', value: rearRightWheelPressure, unit: "psi", stale: staleTpmsIndicator })) }
        if (rearRightWheelTemperature !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.tp.rr.t', value: rearRightWheelTemperature, unit: "C", stale: staleTpmsIndicator })) }
        if (rearLeftWheelPressure !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.tp.rl.p', value: rearLeftWheelPressure, unit: "psi", stale: staleTpmsIndicator })) }
        if (rearLeftWheelTemperature !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.tp.rl.t', value: rearLeftWheelTemperature, unit: "C", stale: staleTpmsIndicator })) }

      } else if (event.data.startsWith('T')) {
        const parts = event.data.substring(1).split(',')
        console.log('[connection OVMSv2] rx TIME', parts)
        const seconds = Number(parts[0])
        dispatch(connectionSlice.actions.setLastUpdateTime((Date.now() / 1000) - seconds))

      } else if (event.data.startsWith('Z')) {
        const parts = event.data.substring(1).split(',')
        console.log('[connection OVMSv2] rx PEERS', parts)
        const peerConnectionCount = parts[0]

        dispatch(metricsSlice.actions.setMetric({ key: 's.v2.peers', value: peerConnectionCount }))
        dispatch(connectionSlice.actions.setCarConnected(peerConnectionCount > 0))

      } else if (event.data.startsWith('f')) {
        const parts = event.data.substring(1).split(',')
        console.log('[connection OVMSv2] rx SERVER', parts)
        const serverFirmwareVersion = parts[0]

      } else if (event.data.startsWith('a')) {
        const parts = event.data.substring(1).split(',')
        console.log('[connection OVMSv2] rx PING RESPONSE', parts)

      } else if (event.data.startsWith('D')) {
        const parts = event.data.substring(1).split(',')
        console.log('[connection OVMSv2] rx DOORS', parts)

        const frontLeftDoorState = (1 & parts[0]) != 0
        const frontRightDoorState = (1<<1 & parts[0]) != 0
        const ChargePortState = (1<<2 & parts[0]) != 0
        const pilotState = (1<<3 & parts[0]) != 0
        const chargingState = (1<<4 & parts[0]) != 0
        const handbrakeState = (1<<6 & parts[0]) != 0
        const carOnState = (1<<7 & parts[0]) != 0
        const carLockedState = (1<<3 & parts[1]) != 0
        const carValetState = (1<<4 & parts[1]) != 0
        const carHoodState = (1<<6 & parts[1]) != 0
        const carTrunkState = (1<<7& parts[1]) != 0
        const pemTemperature = parts[3]
        const motorTemperature = parts[4]
        const batteryTemperature = parts[5]
        const carTripMeter = parts[6]
        const carOdometer = parts[7]
        const carSpeed = parts[8]
        const carParkingTimer = parts[9]
        const ambientTemperature = parts[10]
        const carAwakeState = (1 & parts[11]) != 0
        const carCoolingState = (1<<1 & parts[11]) != 0
        const carLoggedInState = (1<<6 & parts[11]) != 0
        const carConfigState = (1<<7 & parts[11]) != 0
        const staleTemperatures = parts[12] < 0 ? undefined : (parts[8] == 0)
        const staleAmbientTemperature = parts[12] < 0 ? undefined : (parts[8] == 0)
        const vehicle12VLineVoltage = parts[14]
        const alarmSoundingState = (1<<2 & parts[15]) != 0
        const vehicle12VReferenceVoltage = parts[16]
        const rearLeftDoorState = (1 & parts[17]) != 0
        const rearRightDoorState = (1<<1 & parts[17]) != 0
        const frunkState = (1<<2 & parts[17]) != 0
        const charging12vState = (1<<4 & parts[17]) != 0
        const aux12VState = (1<<5 & parts[17]) != 0
        const hvacState = (1<<7 & parts[17]) != 0
        const vehicleChargerTemperature = parts[18]
        const vehicle12VCurrent = parts[19]
        const vehicleCabinTemperature = parts[20]

        if (frontLeftDoorState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.d.fl', value: frontLeftDoorState ? "open" : "closed" })) }
        if (frontRightDoorState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.d.fr', value: frontRightDoorState ? "open" : "closed" })) }
        if (ChargePortState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.d.chargeport', value: ChargePortState ? "open" : "closed" })) }
        if (pilotState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.pilot', value: pilotState ? "yes" : "no" })) }
        if (chargingState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.inprogress', value: chargingState ? "yes" : "no" })) }
        if (handbrakeState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.handbrake', value: handbrakeState ? "on" : "off" })) }
        if (carOnState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.on', value: carOnState ? "on" : "off" })) }
        if (carLockedState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.locked', value: carLockedState ? "locked" : "unlocked" })) }
        if (carValetState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.valet', value: carValetState ? "yes" : "no" })) }
        if (carHoodState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.d.hood', value: carHoodState ? "open" : "closed" })) }
        if (carTrunkState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.d.trunk', value: carTrunkState ? "open" : "closed" })) }
        if (carOdometer !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.odometer', value: (carOdometer / 10).toString(), unit: distanceUnits })) }
        if (carSpeed !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.speed', value: carSpeed, unit: speedUnits })) }
        if (carParkingTimer !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.parktime', value: carParkingTimer, unit: "s" })) }
        if (carTripMeter !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.p.trip', value: (carTripMeter / 10).toString(), unit: distanceUnits })) }
        if (vehicleCabinTemperature !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.cabintemp', value: vehicleCabinTemperature })) }
        if (batteryTemperature !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.temp', value: batteryTemperature, unit: "C", stale: staleTemperatures })) }
        if (motorTemperature !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.m.temp', value: motorTemperature, unit: "C", stale: staleTemperatures })) }
        if (pemTemperature !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.i.temp', value: pemTemperature, unit: "C", stale: staleTemperatures })) }
        if (ambientTemperature !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.temp', value: ambientTemperature, unit: "C", stale: staleAmbientTemperature })) }
        if (carAwakeState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.awake12', value: carAwakeState ? "awake" : "sleeping" })) }
        if (carCoolingState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.cooling', value: carCoolingState ? "on" : "off" })) }
        if (carLoggedInState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.ctrl.login', value: carLoggedInState ? "yes" : "no" })) }
        if (carConfigState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.ctrl.config', value: carConfigState ? "yes" : "no" })) }
        if (vehicle12VLineVoltage !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.12v.voltage', value: vehicle12VLineVoltage, unit: "V" })) }
        if (alarmSoundingState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.alarm', value: alarmSoundingState ? "on" : "off" })) }
        if (vehicle12VReferenceVoltage !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.12v.voltage_ref', value: vehicle12VReferenceVoltage, unit: "V" })) }
        if (rearLeftDoorState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.d.rl', value: rearLeftDoorState ? "open" : "closed" })) }
        if (rearRightDoorState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.d.rr', value: rearRightDoorState ? "open" : "closed" })) }
        if (frunkState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.d.hood', value: frunkState ? "open" : "closed" })) }
        if (charging12vState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.charging12', value: charging12vState ? "on" : "off" })) }
        if (aux12VState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.aux12v', value: aux12VState ? "on" : "off" })) }
        if (hvacState !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.hvac', value: hvacState ? "on" : "off" })) }
        if (vehicleChargerTemperature !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.c.temp', value: vehicleChargerTemperature, unit: "C", stale: staleTemperatures })) }
        if (vehicle12VCurrent !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.b.12v.current', value: vehicle12VCurrent, unit: "A" })) }
        if (vehicleCabinTemperature !== undefined) { dispatch(metricsSlice.actions.setMetric({ key: 'v.e.cabintemp', value: vehicleCabinTemperature })) }

      } else if (event.data.startsWith('P')) {
        const type = event.data.substring(1, 2)
        const message = event.data.substring(2)
        console.log('[connection OVMSv2] rx MESSAGE(PUSH)', type, message)

        dispatch(messagesSlice.actions.addVehicleMessage({ text: message, vehicleKey: selectedVehicle?.key, vehicleName: selectedVehicle?.name }))

      } else if (event.data.startsWith('c')) {

        // This is a command response - parse and handle appropriately
        // Format: 'c' + command code + comma + result + comma + parameters
        // Command code can be more than one digit, so we need to find the first comma after 'c'
        const afterC = event.data.substring(1) // Everything after 'c'
        const firstCommaIndex = afterC.indexOf(',')
        if (firstCommaIndex !== -1) {
          const commandCode = afterC.substring(0, firstCommaIndex) // Get the command code (can be multi-digit)
          const afterCommandCode = afterC.substring(firstCommaIndex + 1) // Everything after the command code and first comma
          console.log('[connection OVMSv2] rx COMMAND RESPONSE', commandCode, afterCommandCode)
          // Find the second comma to separate result from parameters
          const secondCommaIndex = afterCommandCode.indexOf(',')
          if (secondCommaIndex !== -1) {
            const result = parseInt(afterCommandCode.substring(0, secondCommaIndex))
            const parameters = afterCommandCode.substring(secondCommaIndex + 1) // Everything after the second comma
            console.log('[connection OVMSv2] rx COMMAND RESPONSE', result, parameters)

            // Handle textual commands (code 7)
            if (commandCode === '7') {
              if (result === 0) {
                // Success - resolve with the parameters (which contain the textual response)
                resolveNextPendingCommand(parameters)
              } else {
                // Command failed - reject with appropriate error message
                let errorMessage = "Command failed"
                switch (result) {
                  case 1:
                    errorMessage = "Command failed"
                    break
                  case 2:
                    errorMessage = "Command unsupported"
                    break
                  case 3:
                    errorMessage = "Command unimplemented"
                    break
                  default:
                    errorMessage = `Command failed with result code ${result}`
                }
                resolveNextPendingCommand(`ERROR: ${errorMessage}`)
              }

            } else {
              // Non-textual command - just log for now
              console.log(`[connection OVMSv2] Non-textual command response: code=${commandCode}, result=${result}, params=${parameters}`)
            }
          } else {
            console.log('[connection OVMSv2] Invalid command response format:', event.data)
          }
        } else {
          console.log('[connection OVMSv2] Invalid command response format:', event.data)
        }

      } else {
        console.log('[connection] rx event data', event.data)
      }
    }

    connection?.addEventListener('open', openListener)
    connection?.addEventListener('message', messageListener)
    connection?.addEventListener('close', closeListener)

    return () => {
      console.log("[connection OVMSv2] cleanup", selectedVehicle?.name)
      if (connection) {
        connection.removeEventListener('open', openListener)
        connection.removeEventListener('message', messageListener)
        connection.removeEventListener('close', closeListener)
        connection.close()
        connection = null
      }
    }
  }, [selectedVehicle])

  return (
    <ConnectionDisplay />
  )
}
