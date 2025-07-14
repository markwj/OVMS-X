import React, { useEffect } from "react"
import { Icon } from "react-native-paper"
import { useDispatch, useSelector } from "react-redux";
import { getSelectedVehicle } from "@/store/vehiclesSlice";
import { metricsSlice} from "@/store/metricsSlice";
import { GetCurrentUTCTimeStamp } from "../utils/datetime";
import { useInterval } from "@/hooks/useInterval";

let connection: WebSocket | null = null;

export function OVMSv2ConnectionIcon(): React.JSX.Element {
  const selectedVehicle = useSelector(getSelectedVehicle);
  const dispatch = useDispatch();
  
  useInterval(() => {
    if (connection && connection.readyState === WebSocket.OPEN) {
      console.log('[connection OVMSv2] tx ping')
      connection.send('A')
    }
  }, 60000);

  useEffect(() => {
    console.log("[connection OVMSv2] start",selectedVehicle?.name)

    const serverurl = `wss://${selectedVehicle?.platformParameters?.server}:${selectedVehicle?.platformParameters?.wssport}/apiv2`;
    connection = new WebSocket(serverurl)
    console.log('[connection OVMSv2] connection',serverurl,connection)        

    // Send authentication message when connection opens
    const openListener = () => {
      console.log('[connection OVMSv2] connection opened')
      const authMessage = `MP-A 1 ${selectedVehicle?.platformParameters?.username} ${selectedVehicle?.platformParameters?.password} ${selectedVehicle?.name}`
      console.log('[connection OVMSv2] tx auth', authMessage)
      connection?.send(authMessage)
    }
  
    const closeListener = () => {
      console.log('[connection OVMSv2] connection closed')
    }

    const messageListener = (event: MessageEvent) => {

      if (event.data.startsWith('MP-S')) {
        console.log('[connection OVMSv2] rx LOGIN(RESULT)',event.data)

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

        dispatch(metricsSlice.actions.setMetric({ key: 's.v.vin', value: vin, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'm.version', value: firmwareVersion, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'm.net.sq', value: networkSignalQuality, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.type', value: vehicleTypeCode, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'm.net.provider', value: networkName, currentTime: GetCurrentUTCTimeStamp() }))

      } else if (event.data.startsWith('S')) {
        const parts = event.data.substring(1).split(',')
        console.log('[connection OVMSv2] rx STATE', parts)
        const soc = parts[0]
        const units = parts[1]
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
        const chargeSubStateN = parts[13]
        const chargeModeN = parts[14]
        const chargeTimerMode = parts[15]
        const chargeTimerStartTime = parts[16]
        const chargeTimerStale = parts[17]
        const vehicleCac100 = parts[18]
        const accMinsRemainingUntilFull = parts[19]
        const accMinsRemainingUntilLimit = parts[20]
        const accConfiguredRangeLimit = parts[21]
        const accConfiguredSOCLimit = parts[22]
        const cooldown = parts[23]
        const cooldownLowerLimit = parts[24]
        const cooldownTimeLimit = parts[25]
        const accMinsRemainingCurrentCondition = parts[26]
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

        dispatch(metricsSlice.actions.setMetric({ key: 'v.bat.soc', value: soc, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.bat.range.ideal', value: idealRange, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.bat.range.est', value: estimatedRange, currentTime: GetCurrentUTCTimeStamp() }))

      } else if (event.data.startsWith('L')) {
        const parts = event.data.substring(1).split(',')
        console.log('[connection OVMSv2] rx LOCATION', parts)
        const latitude = parts[0]
        const longitude = parts[1]
        const carDirection = parts[2]
        const carAltitude = parts[3]
        const carGpsLock = parts[4]
        const staleGpsIndicator = parts[5]
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

        dispatch(metricsSlice.actions.setMetric({ key: 'v.pos.latitude', value: latitude, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.pos.longitude', value: longitude, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.pos.dire', value: carDirection, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.pos.altitude', value: carAltitude, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.pos.speed', value: carSpeed, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.pos.gpsspeed', value: gpsSpeed, currentTime: GetCurrentUTCTimeStamp() }))

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
        const staleTpmsIndicator = parts[8]

      } else if (event.data.startsWith('T')) {
        const parts = event.data.substring(1).split(',')
        console.log('[connection OVMSv2] rx TIME', parts)
        const seconds = parts[0]

      } else if (event.data.startsWith('Z')) {
        const parts = event.data.substring(1).split(',')
        console.log('[connection OVMSv2] rx PEERS', parts)
        const peerConnectionCount = parts[0]

        dispatch(metricsSlice.actions.setMetric({ key: 's.v2.peers', value: peerConnectionCount, currentTime: GetCurrentUTCTimeStamp() }))

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
        const doorState1 = parts[0]
        const doorState2 = parts[1]
        const lockUnlockState = parts[2]
        const pemTemperature = parts[3]
        const motorTemperature = parts[4]
        const batteryTemperature = parts[5]
        const carTripMeter = parts[6]
        const carOdometer = parts[7]
        const carSpeed = parts[8]
        const carParkingTimer = parts[9]
        const ambientTemperature = parts[10]
        const doorState3 = parts[11]
        const staleTemperatures = parts[12]
        const staleAmbientTemperature = parts[13]
        const vehicle12VLineVoltage = parts[14]
        const doorState4 = parts[15]
        const vehicle12VReferenceVoltage = parts[16]
        const doorState5 = parts[17]
        const vehicleChargerTemperature = parts[18]
        const vehicle12VCurrent = parts[19]
        const vehicleCabinTemperature = parts[20]

        dispatch(metricsSlice.actions.setMetric({ key: 'v.pos.odometer', value: carOdometer, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.pos.speed', value: carSpeed, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.pos.trip', value: carTripMeter, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.env.cabintemp', value: vehicleCabinTemperature, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.bat.temp', value: batteryTemperature, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.mot.temp', value: motorTemperature, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.inv.temp', value: pemTemperature, currentTime: GetCurrentUTCTimeStamp() }))
        dispatch(metricsSlice.actions.setMetric({ key: 'v.env.temp', value: ambientTemperature, currentTime: GetCurrentUTCTimeStamp() }))

      } else {
        console.log('[connection] rx event data', event.data)
      }
    }

    connection?.addEventListener('open', openListener)
    connection?.addEventListener('message', messageListener)
    connection?.addEventListener('close', closeListener)

    return () => {
      console.log("[connection OVMSv2] cleanup",selectedVehicle?.name)
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
    <Icon source='antenna' size={20} />
  )
}
