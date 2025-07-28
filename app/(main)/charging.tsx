import React, { useRef, useState } from "react";
import { Text, Icon, Button, IconButton, useTheme } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { HorizontalBatteryIcon } from "@/components/ui/BatteryIcon";
import { MetricValue } from "@/components/ui/MetricValue";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { selectLocalisedMetricValue, selectMetricValue } from "@/store/metricsSlice";
import { Dropdown } from "react-native-element-dropdown";
import { CommandCode, ConnectionStandardCommand } from "@/components/platforms/connection";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { useTranslation } from "react-i18next";
import { store } from "@/store/root";
import { ScrollView } from "react-native-gesture-handler";
import Slider from "@react-native-community/slider";
import { numericalUnitConvertor } from "@/components/utils/numericalUnitConverter";
import { ConfirmationMessage } from "@/components/ui/ConfirmationMessage";

const vCModes = [
  { value: "standard", label: "Standard" },
  { value: "range", label: "Range" },
  { value: "performance", label: "Performance" },
  { value: "storage", label: "Storage" }
]

export default function ChargingScreen() {
  const vehicle = useSelector(getSelectedVehicle)
  const sufficientSOC = useSelector(selectMetricValue("v.c.limit.soc"))
  const { value: sufficientRange, unit: sufficientRangeUnit } = store.dispatch(selectLocalisedMetricValue("v.c.limit.range")) //These should already be same unit
  const { value: chargeCurrent, unit: chargeCurrentUnit } = store.dispatch(selectLocalisedMetricValue("v.c.current"))

  const { t } = useTranslation()

  const charging = useSelector(selectMetricValue("v.c.inprogress")) == "yes"

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      chargeMode: useSelector(selectMetricValue("v.c.mode")),
    }
  });

  const theme = useTheme()

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, flexDirection: 'column', margin: 20 }}>
        <View style={{ flex: 1, flexDirection: 'column', padding: 20 }}>
          <HorizontalBatteryIcon></HorizontalBatteryIcon>
        </View>
        <View style={{ flex: 10, gap: 10 }}>
          <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <MetricValue metricKey={"v.b.health"} emptyOverride="Undescribed SOH"></MetricValue>
            <Text> (</Text>
            <MetricValue metricKey={"v.b.soh"} emptyOverride="N/A"></MetricValue>
            <Text>)</Text>
          </View>

          <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon source='thermometer' size={20}></Icon>
              <MetricValue metricKey={"v.b.temp"} variant='bodyLarge' emptyOverride="N/A"></MetricValue>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon source='lightning-bolt' size={20}></Icon>
              <MetricValue metricKey={"v.b.voltage"} variant='bodyLarge' emptyOverride="N/A"></MetricValue>
            </View>
            <MetricValue metricKey={"v.b.range.est"} variant='bodyLarge' emptyOverride="N/A"></MetricValue>
          </View>

          <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text>{t('Trip odometer')}: </Text>
            <MetricValue metricKey={"v.p.trip"}></MetricValue>
          </View>

          <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text>{t('Last charge')}: ß</Text>
            <MetricValue metricKey={"v.c.timestamp"} showUnit={false}></MetricValue>
          </View>

          <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <Button
              style={[styles.button, (!charging ? styles.buttonActive : styles.buttonInactive)]}
              onPress={() => {
                if (charging) { return; }
                ConnectionStandardCommand(vehicle, { commandCode: CommandCode.START_CHARGE })
              }}
            >
              <Text style={styles.buttonText}>{t('START CHARGING')}</Text>
            </Button>
            <Button
              style={[styles.button, (charging ? styles.buttonActive : styles.buttonInactive)]}
              onPress={() => {
                if (!charging) { return; }
                ConnectionStandardCommand(vehicle, { commandCode: CommandCode.STOP_CHARGE })
              }}
            >
              <Text style={styles.buttonText}>{t('STOP CHARGING')}</Text>
            </Button>
          </View>

          <ScrollView style={{ flex: 1 }}>

            {charging &&
              <Section title={"Time until..."} visibilityToggle={false}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>100%: </Text>
                  <MetricValue metricKey={"v.c.duration.full"} emptyOverride="N/A" toBest={true} abbreviateUnit={false}></MetricValue>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{sufficientSOC ?? t("Sufficient SOC")}%: </Text>
                  <MetricValue metricKey={"v.c.duration.soc"} emptyOverride="N/A" toBest={true} abbreviateUnit={false}></MetricValue>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{sufficientSOC ?? t("Sufficient range")} {sufficientRangeUnit ?? ""}: </Text>
                  <MetricValue metricKey={"v.c.duration.range"} emptyOverride="N/A" toBest={true} abbreviateUnit={false}></MetricValue>
                </View>
              </Section>
            }

            <Section title="Charge Mode" visibilityToggle={false}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <Controller
                    control={control}
                    name={"chargeMode"}
                    render={({ field: { value } }) => {
                      return (
                        <Dropdown
                          iconColor={theme.colors.secondary}
                          selectedTextStyle={{ color: theme.colors.secondary }}
                          itemTextStyle={{ color: theme.colors.secondary }}
                          containerStyle={{ backgroundColor: theme.colors.surfaceVariant }}
                          itemContainerStyle={{ backgroundColor: theme.colors.surfaceVariant }}
                          activeColor={theme.colors.surface}
                          style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.secondary, borderWidth: 2, padding: 5 }}
                          value={value}
                          onChange={(v) => {
                            setValue('chargeMode', v.value)
                            ConnectionStandardCommand(vehicle, { commandCode: CommandCode.SET_CHARGE_MODE, params: [v.value] })
                          }}
                          data={vCModes.map((v) => {return {...v, label: t(v.label)}})}
                          labelField={"label"}
                          valueField={"value"}
                        />
                      )
                    }
                    }
                  />
                </View>
              </View>
            </Section>

            {/*
            Though these were in the android app, these are only applicable to certain cars

            <Section title={"Sufficient Range"} visibilityToggle={false}>
              <View style={{ flexGrow: 1, flexDirection: 'row' }}>
                <Slider
                  style={{ flex: 1 }}
                  value={sufficientRange}
                  maximumValue={fullRange}
                  minimumValue={0}
                  lowerLimit={0}
                  step={1}
                  StepMarker={({ stepMarked, currentValue }) => {
                    if (!stepMarked) { return <></> }
                    return (
                      <Text style={{ transform: [{ translateY: -40 }], backgroundColor: 'grey', padding: 5 }}>{currentValue} {t(fullRangeUnit)}</Text>
                    )
                  }}
                  onSlidingComplete={(v: number) => {
                    if (v == +sufficientSOC) { return }
                    console.error("Need to define setting of sufficient range!")
                  }}
                ></Slider>
              </View>
              <View style={{ height: 10 }}></View>
            </Section>

            <Section title={"Sufficient SOC"} visibilityToggle={false}>
              <View style={{ flexGrow: 1, flexDirection: 'row' }}>
                <Slider
                  style={{ flex: 1 }}
                  value={sufficientSOC}
                  maximumValue={100}
                  minimumValue={0}
                  lowerLimit={20}
                  step={1}
                  StepMarker={({ stepMarked, currentValue }) => {
                    if (!stepMarked) { return <></> }
                    return (
                      <Text style={{ transform: [{ translateY: -40 }], backgroundColor: 'grey', padding: 5 }}>{currentValue}%</Text>
                    )
                  }}
                  onSlidingComplete={(v: number) => {
                    if (v == +sufficientSOC) { return }
                    console.error("Need to define setting of sufficient SOC!")
                  }}
                ></Slider>
              </View>
              <View style={{ height: 10 }}></View>
            </Section> */}

            <Section title={"Charge Current"} visibilityToggle={true}>
              <Text style={{ color: 'red' }}>{t("Incorrect settings may damage electric systems.")}</Text>
              <View style={{ flexGrow: 1, flexDirection: 'row' }}>
                <Slider
                  style={{ flex: 1 }}
                  value={chargeCurrent}
                  maximumValue={70}
                  minimumValue={0}
                  lowerLimit={10}
                  step={1}
                  StepMarker={({ stepMarked, currentValue }) => {
                    if (!stepMarked) { return <></> }
                    return (
                      <Text style={{ transform: [{ translateY: 30 }], backgroundColor: 'grey', padding: 5 }}>{currentValue} {t(chargeCurrentUnit)}</Text>
                    )
                  }}
                  onSlidingComplete={(v: number) => {
                    const A = numericalUnitConvertor(v).from(chargeCurrentUnit).to("A")
                    ConfirmationMessage(() => {
                      ConnectionStandardCommand(vehicle, { commandCode: CommandCode.SET_CHARGE_CURRENT, params: [numericalUnitConvertor(v).from(chargeCurrentUnit).to("A")] })
                    }, "Warning!", `Are you sure you want to set the charge current to ${v} ${chargeCurrentUnit} (${A} amps)?`)
                  }}
                ></Slider>
              </View>
              <View style={{ height: 10 }}></View>
            </Section>

            <Section title={"Energy"}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Consumption: ")}</Text>
                <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.b.consumption"} emptyOverride="N/A"></MetricValue>
              </View>

              <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 5 }}>
                <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Energy: ")}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Consumed: ")}</Text>
                    <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.b.energy.used"} emptyOverride="N/A"></MetricValue>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}> ({t('Lifetime: ')}</Text>
                    <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.b.energy.used.total"} emptyOverride="N/A"></MetricValue>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}>)</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Recovered: ")}</Text>
                    <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.b.energy.recd"} emptyOverride="N/A"></MetricValue>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}> ({t('Lifetime: ')}</Text>
                    <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.b.energy.recd.total"} emptyOverride="N/A"></MetricValue>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}>)</Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 5 }}>
                <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Power: ")}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Battery: ")}</Text>
                    <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.b.power"} emptyOverride="N/A"></MetricValue>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Generator: ")}</Text>
                    <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.g.power"} emptyOverride="N/A"></MetricValue>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Motor: ")}</Text>
                    <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.i.power"} emptyOverride="N/A"></MetricValue>
                  </View>
                </View>
              </View>
            </Section>

            <Section title={"More Details"} visibleDefault={true}>

              <Section title={"Charger"}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t('State')}: </Text>
                  <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.c.state"} emptyOverride="N/A"></MetricValue>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', marginLeft: 10 }}>
                  <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t('Substate')}: </Text>
                  <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.c.substate"} emptyOverride="N/A"></MetricValue>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t('Current')}: </Text>
                    <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.c.current"} emptyOverride="N/A"></MetricValue>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}>({t('Maximum')}: </Text>
                    <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.c.climit"} emptyOverride="N/A"></MetricValue>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}>)</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Voltage")}: </Text>
                  <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.c.voltage"} emptyOverride="N/A"></MetricValue>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 5 }}>
                  <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Energy")}: </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Sum: ")}</Text>
                    <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.c.kwh"} emptyOverride="N/A"></MetricValue>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Drawn")}: </Text>
                      <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.c.kwh.grid"} emptyOverride="N/A"></MetricValue>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <Text numberOfLines={1} adjustsFontSizeToFit={true}> ({t('Lifetime')}: </Text>
                      <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.c.kwh.grid.total"} emptyOverride="N/A"></MetricValue>
                      <Text numberOfLines={1} adjustsFontSizeToFit={true}>)</Text>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Efficiency")}: </Text>
                  <MetricValue numberOfLines={1} adjustsFontSizeToFit={true} metricKey={"v.c.efficiency"} emptyOverride="N/A"></MetricValue>
                </View>
              </Section>

              <Section title={"12V DC/DC Converter"} visibilityToggle={true}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{t("Current")}: </Text>
                  <MetricValue metricKey={"v.c.12v.current"} emptyOverride="N/A"></MetricValue>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{t("Power")}: </Text>
                  <MetricValue metricKey={"v.c.12v.power"} emptyOverride="N/A"></MetricValue>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{t("Temperature")}: </Text>
                  <MetricValue metricKey={"v.c.12v.temp"} emptyOverride="N/A"></MetricValue>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{t("Voltage")}: </Text>
                  <MetricValue metricKey={"v.c.12v.voltage"} emptyOverride="N/A"></MetricValue>
                </View>
              </Section>

            </Section>

          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider >
  );
}

function Section({ title, children, visibilityToggle, visibleDefault }: { title: string, children?: any, visibilityToggle?: boolean, visibleDefault?: boolean }) {
  const { t } = useTranslation()
  visibleDefault ??= false
  const [childrenVisible, setChildrenVisible] = useState(visibleDefault)

  visibilityToggle ??= true
  if (visibilityToggle == false && !childrenVisible) {
    setChildrenVisible(true)
  }

  return (
    <View style={styles.sectionContainer}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[{ flex: 1 }, childrenVisible && { marginBottom: 0 }]} variant="bodyLarge">{t(title)}</Text>
        {visibilityToggle &&
          <IconButton icon={childrenVisible ? 'eye' : 'eye-off'} size={15} onPress={() => setChildrenVisible(!childrenVisible)}></IconButton>
        }
      </View>
      {childrenVisible &&
        <View style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 5,
          flex: 1
        }}>
          {children}
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    borderColor: 'grey',
    borderWidth: 2,
    borderRadius: 20,
    padding: 15,
    gap: 5,
    marginBottom: 10
  },
  button: {
    backgroundColor: 'grey',
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
  },
  buttonActive: {
    backgroundColor: 'green',
  },
  buttonInactive: {
    opacity: 0.5
  },
  buttonText: {
    color: 'white'
  }
})