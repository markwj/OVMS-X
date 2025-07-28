import React, { ComponentProps } from "react";
import { useTheme, Text, IconButton, Icon } from 'react-native-paper';
import { View, StyleSheet, StyleProp, Modal, Alert } from 'react-native';
import { VehicleTopImage } from "@/components/ui/VehicleImages";
import { useSelector } from "react-redux";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { store } from "@/store/root";
import { selectLocalisedMetricValue, selectMetricIsStale, selectMetricValue } from "@/store/metricsSlice";
import { GetCurrentUTCTimeStamp } from "@/components/utils/datetime";
import { MetricValue } from "@/components/ui/MetricValue";
import { BatteryIcon } from "@/components/ui/BatteryIcon";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ConnectionCommand } from "@/components/platforms/connection";
import { CommandCode } from "@/components/platforms/Commands";

const auxBattery = require("@/assets/images/aux_battery.png")

export default function ControlsScreen() {
  const vehicle = useSelector(getSelectedVehicle)

  const carLocked = useSelector(selectMetricValue('v.e.locked'))
  const valetMode = useSelector(selectMetricValue('v.e.valet'))

  const theme = useTheme()

  const getPIN = () => {
    return new Promise((resolve, reject) => {
      Alert.prompt(
        'Enter PIN',
        '',
        [
          {
            text: 'Cancel',
            onPress: () => reject('User canceled'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: (text) => resolve(text),
          },
        ],
        'secure-text',
        '',
        'numeric'
      );
    });
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.primaryContainer}>

        {vehicle != null &&
          <View style={styles.screenContainer}>

            {/* Car display */}
            <View style={styles.vehicleImageBoundary}>
              <View style={styles.vehicleImageContainer}>
                <VehicleTopImage image={vehicle.image}></VehicleTopImage>
              </View>
            </View>

            {/* TPMS displays */}
            <View style={{ ...styles.absoluteCentering, left: '10%', top: '20%', borderColor: 'white', borderWidth: 2 }}>
              <MetricValue style={styles.metricValue} metricKey={"v.tp.fl.t"} />
              <MetricValue style={{ ...styles.metricValue, borderColor: 'white', borderTopWidth: 1 }} metricKey={"v.tp.fl.p"} />
            </View>

            <View style={{ ...styles.absoluteCentering, left: '90%', top: '20%', borderColor: 'white', borderWidth: 2 }}>
              <MetricValue style={styles.metricValue} metricKey={"v.tp.fr.t"} />
              <MetricValue style={{ ...styles.metricValue, borderColor: 'white', borderTopWidth: 1 }} metricKey={"v.tp.fr.p"} />
            </View>

            <View style={{ ...styles.absoluteCentering, left: '10%', top: '80%', borderColor: 'white', borderWidth: 2 }}>
              <MetricValue style={styles.metricValue} metricKey={"v.tp.rl.t"} />
              <MetricValue style={{ ...styles.metricValue, borderColor: 'white', borderTopWidth: 1 }} metricKey={"v.tp.rl.p"} />
            </View>

            <View style={{ ...styles.absoluteCentering, left: '90%', top: '80%', borderColor: 'white', borderWidth: 2 }}>
              <MetricValue style={styles.metricValue} metricKey={"v.tp.rr.t"} />
              <MetricValue style={{ ...styles.metricValue, borderColor: 'white', borderTopWidth: 1 }} metricKey={"v.tp.rr.p"} />
            </View>

            {/* Temperature displays */}
            <View style={{ ...styles.absoluteCentering, left: '70%', top: '92.5%', borderColor: 'white', borderWidth: 2 }}>
              <View style={{ ...styles.metricValue, flexDirection: 'row', alignItems: 'center' }}>
                <BatteryIcon />
                <Text style={{ marginLeft: 5 }}>Battery</Text>
              </View>
              <MetricValue style={{ ...styles.metricValue, borderColor: 'white', borderTopWidth: 1 }} metricKey={"v.b.temp"} />
            </View>

            <View style={{ ...styles.absoluteCentering, left: '30%', top: '92.5%', borderColor: 'white', borderWidth: 2 }}>
              <View style={{ ...styles.metricValue, flexDirection: 'row', alignItems: 'center' }}>
                <Icon size={20} source={"axis-x-rotate-clockwise"} />
                <Text style={{ marginLeft: 5 }}>Motor</Text>
              </View>
              <MetricValue style={{ ...styles.metricValue, borderColor: 'white', borderTopWidth: 1 }} metricKey={"v.m.temp"} />
            </View>

            {/* Lock Display */}
            <View style={{ position: 'absolute', left: '50%', top: '0%', transform: [{translateX: '-50%'}] }}>
              <MetricIcon
                metricKey={"v.e.locked"}
                icon={(v) => v == "locked" ? "lock" : 'lock-open'}
                size={50}
                onPress={async () => {
                  const pin = await getPIN()
                  if(pin == "User cancelled") { return }
                  if (carLocked) {
                    await ConnectionCommand(vehicle, {commandCode: CommandCode.UNLOCK_CAR, params: {pin: pin}})
                    return
                  }
                  await ConnectionCommand(vehicle, {commandCode: CommandCode.LOCK_CAR, params: {pin: pin}})
                }}
              />
            </View>

            {/* Valet Display */}
            <View style={{ position: 'absolute', left: '35%', top: '0%', transform: [{translateX: '-50%'}]}}>
              <MetricIcon
                metricKey={"v.e.valet"}
                icon={'bow-tie'}
                iconColor={(v) => v == "yes" ? "green" : 'red'}
                size={50}
                onPress={async () => {
                  const pin = await getPIN()
                  if(pin == "User cancelled") { return }
                  if (valetMode) {
                    await ConnectionCommand(vehicle, {commandCode: CommandCode.ACTIVATE_VALET_MODE, params: {pin: pin}})
                    return
                  }
                  await ConnectionCommand(vehicle, {commandCode: CommandCode.DEACTIVATE_VALET_MODE, params: {pin: pin}})
                }}
              />
            </View>

            {/* 12v Battery Display */}
            <View style={{ position: 'absolute', left: '15%', top: '2.5%', transform: [{translateX: '-50%'}]}}>
              <Icon size={50} source={auxBattery}/>
              <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.b.12v.voltage"} style={{...styles.absoluteCentering, top: '33%', left: '20%'}}></MetricValue>
            </View>

            {/* Odometer */}
            <View style={{ ...styles.absoluteCentering, left: '50%', top: '15%' }}>
              <MetricValue variant="labelLarge" metricKey={"v.p.odometer"} />
            </View>

            {/*Homelink buttons*/}
            <View style={{ position: 'absolute', right: '20%', top: '0%' }}>
              <IconButton
                icon={'home-floor-0'}
                size={35}
                onPress={async () => {
                  await ConnectionCommand(vehicle, {commandCode: CommandCode.HOME_LINK, params: {button: 0}})
                }}
              />
            </View>
            <View style={{ position: 'absolute', right: '10%', top: '0%' }}>
              <IconButton
                icon={'home-floor-1'}
                size={35}
                onPress={async () => {
                  await ConnectionCommand(vehicle, {commandCode: CommandCode.HOME_LINK, params: {button: 1}})
                }}
              />
            </View>
            <View style={{ position: 'absolute', right: '0%', top: '0%' }}>
              <IconButton
                icon={'home-floor-2'}
                size={35}
                onPress={async () => {
                  await ConnectionCommand(vehicle, {commandCode: CommandCode.HOME_LINK, params: {button: 2}})
                }}
              />
            </View>

          </View>
        }
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

type MetricIconProps = Omit<ComponentProps<typeof IconButton>, 'icon' | 'iconColor'> & { 
  metricKey: string, 
  icon: string | ((value: string, unit: string) => string) 
  iconColor?: string | ((value: string, unit: string) => string) 
}

function MetricIcon(props: MetricIconProps) {
  const { value, unit } = store.dispatch(selectLocalisedMetricValue(props.metricKey))
  const stale = useSelector(selectMetricIsStale(props.metricKey, GetCurrentUTCTimeStamp()))

  return (
    <IconButton
      {...props}
      icon={typeof props.icon == 'string' ? props.icon : props.icon(value, unit)}
      iconColor={props.iconColor != undefined ? 
        typeof props.iconColor == 'string' ? props.iconColor : props.iconColor(value, unit)
        : (stale ? 'grey' : 'white')
      }
    ></IconButton>
  )
}

const styles = StyleSheet.create({
  primaryContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  screenContainer: { width: '100%', height: '100%', borderWidth: 0, borderColor: 'blue' },
  vehicleImageBoundary: { position: 'absolute', left: '20%', top: '15%', width: '60%', height: '70%', borderWidth: 0, borderColor: 'blue' },
  vehicleImageContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  metricValue: { fontSize: 15, padding: 5 },

  absoluteCentering: { position: 'absolute', transform: [{ 'translateX': '-50%' }, { 'translateY': "-50%" }] }
})
