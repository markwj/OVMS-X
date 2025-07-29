import React, { ComponentProps } from "react";
import { useTheme, Text, IconButton, Icon } from 'react-native-paper';
import { View, StyleSheet, StyleProp, Image, Alert } from 'react-native';
import { VehicleTopImage } from "@/components/ui/VehicleImages";
import { useSelector } from "react-redux";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { store } from "@/store/root";
import { selectLocalisedMetricValue, selectMetricIsStale, selectMetricValue } from "@/store/metricsSlice";
import { GetCurrentUTCTimeStamp } from "@/components/utils/datetime";
import { MetricValue } from "@/components/ui/MetricValue";
import { BatteryIcon } from "@/components/ui/BatteryIcon";
import { ConnectionCommand } from "@/components/platforms/connection";
import { useTranslation } from "react-i18next";
import { CommandCode } from "@/components/platforms/Commands";

const auxBattery = require("@/assets/images/aux_battery.png")

export default function ControlsScreen() {
  const vehicle = useSelector(getSelectedVehicle)
  const theme = useTheme()

  const {t} = useTranslation()

  const carLocked = useSelector(selectMetricValue('v.e.locked'))  === "locked"
  const valetMode = useSelector(selectMetricValue('v.e.valet'))

  const vDFL = useSelector(selectMetricValue("v.d.fl")) == "open"
  const vDFR = useSelector(selectMetricValue("v.d.fr")) == "open"
  const vDRL = useSelector(selectMetricValue("v.d.rl")) == "open"
  const vDRR = useSelector(selectMetricValue("v.d.rr")) == "open"
  const vDHood = useSelector(selectMetricValue("v.d.hood")) == "open"
  const vDTrunk = useSelector(selectMetricValue("v.d.trunk")) == "open"
  const vDChargeport = useSelector(selectMetricValue("v.d.chargeport")) == "open"

  const getPIN = () => {
    return new Promise((resolve, reject) => {
      Alert.prompt(
        t('Enter PIN'),
        '',
        [
          {
            text: t('Cancel'),
            onPress: () => reject('User canceled'),
            style: 'cancel',
          },
          {
            text: t('OK'),
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
    <View style={styles.primaryContainer}>
      {vehicle != null &&
        <View style={styles.screenContainer}>

            {/* Car display */}
            <View style={styles.vehicleImageBoundary}>
              <View style={styles.vehicleImageContainer}>
                <VehicleTopImage image={vehicle.image}></VehicleTopImage>
              </View>
            </View>

            {/* TPMS displays */}
            <View style={{ ...styles.absoluteCentering, left: '10%', top: '20%', borderColor: theme.colors.outline, borderWidth: 2 }}>
              <MetricValue style={styles.metricValue} metricKey={"v.tp.fl.t"} />
              <MetricValue style={{ ...styles.metricValue, borderColor: theme.colors.outline, borderTopWidth: 1 }} metricKey={"v.tp.fl.p"} />
            </View>

            <View style={{ ...styles.absoluteCentering, left: '90%', top: '20%', borderColor: theme.colors.outline, borderWidth: 2 }}>
              <MetricValue style={styles.metricValue} metricKey={"v.tp.fr.t"} />
              <MetricValue style={{ ...styles.metricValue, borderColor: theme.colors.outline, borderTopWidth: 1 }} metricKey={"v.tp.fr.p"} />
            </View>

            <View style={{ ...styles.absoluteCentering, left: '10%', top: '80%', borderColor: theme.colors.outline, borderWidth: 2 }}>
              <MetricValue style={styles.metricValue} metricKey={"v.tp.rl.t"} />
              <MetricValue style={{ ...styles.metricValue, borderColor: theme.colors.outline, borderTopWidth: 1 }} metricKey={"v.tp.rl.p"} />
            </View>

            <View style={{ ...styles.absoluteCentering, left: '90%', top: '80%', borderColor: theme.colors.outline, borderWidth: 2 }}>
              <MetricValue style={styles.metricValue} metricKey={"v.tp.rr.t"} />
              <MetricValue style={{ ...styles.metricValue, borderColor: theme.colors.outline, borderTopWidth: 1 }} metricKey={"v.tp.rr.p"} />
            </View>

            {/* Temperature displays */}
            <View style={{ ...styles.absoluteCentering, left: '80%', top: '92.5%', borderColor: theme.colors.outline, borderWidth: 2 }}>
              <View style={{ ...styles.metricValue, flexDirection: 'row', alignItems: 'center' }}>
                <BatteryIcon />
                <Text style={{ marginLeft: 5 }}>Battery</Text>
              </View>
              <MetricValue style={{ ...styles.metricValue, borderColor: theme.colors.outline, borderTopWidth: 1 }} metricKey={"v.b.temp"} />
            </View>

            <View style={{ ...styles.absoluteCentering, left: '20%', top: '92.5%', borderColor: theme.colors.outline, borderWidth: 2 }}>
              <View style={{ ...styles.metricValue, flexDirection: 'row', alignItems: 'center' }}>
                <Icon size={20} source={"axis-x-rotate-clockwise"} />
                <Text style={{ marginLeft: 5 }}>Motor</Text>
              </View>
              <MetricValue style={{ ...styles.metricValue, borderColor: theme.colors.outline, borderTopWidth: 1 }} metricKey={"v.m.temp"} />
            </View>

            {/* Door displays */}
            {vDTrunk &&
              <View style={{...styles.absoluteCentering, left: '50%', top: '90%' }}>
                <Text variant="headlineSmall">{t('OPEN')}</Text>
              </View>
            }
            {vDHood &&
              <View style={{...styles.absoluteCentering, left: '50%', top: '12%' }}>
                <Text variant="headlineSmall">{t('OPEN')}</Text>
              </View>
            }
            {vDChargeport &&
              <View style={{...styles.absoluteCentering, left: '10%', top: '72%', flexDirection: 'row', alignItems: 'center' }}>
                <Icon size={20} source={"ev-plug-type2"}></Icon>
                <Text variant="headlineSmall">{t('OPEN')}</Text>
              </View>
            }
            {vDRL &&
              <View style={{...styles.absoluteCentering, left: '10%', top: '60%' }}>
                <Text variant="headlineSmall">{t('OPEN')}</Text>
              </View>
            }
            {vDFL &&
              <View style={{...styles.absoluteCentering, left: '10%', top: '40%' }}>
                <Text variant="headlineSmall">{t('OPEN')}</Text>
              </View>
            }
            {vDRR &&
              <View style={{...styles.absoluteCentering, left: '90%', top: '60%' }}>
                <Text variant="headlineSmall">{t('OPEN')}</Text>
              </View>
            }
            {vDFR &&
              <View style={{...styles.absoluteCentering, left: '90%', top: '40%' }}>
                <Text variant="headlineSmall">{t('OPEN')}</Text>
              </View>
            }

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
              <Image width={50} height={50} source={auxBattery} tintColor={theme.colors.outline}/>
              <MetricValue metricKey={"v.b.12v.voltage"} style={{position: 'absolute', top: '35%', left: '20%'}}></MetricValue>
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
    </View>
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
  const theme = useTheme()

  return (
    <IconButton
      {...props}
      icon={typeof props.icon == 'string' ? props.icon : props.icon(value, unit)}
      iconColor={props.iconColor != undefined ? (typeof props.iconColor == 'string' ? props.iconColor : props.iconColor(value, unit)) : undefined}
      style={stale && {opacity: 0.5}}
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
