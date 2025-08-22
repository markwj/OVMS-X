import React, { useLayoutEffect, useRef, useState } from "react";
import { Text, Icon, Button, IconButton, useTheme } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { HorizontalBatteryIcon } from "@/components/ui/BatteryIcon";
import { MetricVal } from "@/components/ui/MetricValue";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { selectLocalisedMetricValue, selectMetricValue, selectMetricRecord } from "@/store/metricsSlice";
import { Dropdown } from "react-native-element-dropdown";
import { sendCommand } from "@/lib/platforms/platform";
import { CommandCode } from "@/lib/platforms/commands";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { useTranslation } from "react-i18next";
import { store } from "@/store/root";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "expo-router";

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

  const { t } = useTranslation()

  const charging = useSelector(selectMetricValue("v.c.inprogress", "bool"))

  // Get all metric records at the start
  const vBatHealth = useSelector(selectMetricRecord("v.b.health"))
  const vBatSoh = useSelector(selectMetricRecord("v.b.soh"))
  const vBatTemp = useSelector(selectMetricRecord("v.b.temp"))
  const vBatVoltage = useSelector(selectMetricRecord("v.b.voltage"))
  const vBatRangeEst = useSelector(selectMetricRecord("v.b.range.est"))
  const vPTrip = useSelector(selectMetricRecord("v.p.trip"))
  const vCTimestamp = useSelector(selectMetricRecord("v.c.timestamp"))
  const vCDurationFull = useSelector(selectMetricRecord("v.c.duration.full", true))
  const vCDurationSoc = useSelector(selectMetricRecord("v.c.duration.soc", true))
  const vCDurationRange = useSelector(selectMetricRecord("v.c.duration.range", true))
  const vBPower = useSelector(selectMetricRecord("v.b.power"))
  const vGPower = useSelector(selectMetricRecord("v.g.power"))
  const vIPower = useSelector(selectMetricRecord("v.i.power"))
  const vCState = useSelector(selectMetricRecord("v.c.state"))
  const vCSubstate = useSelector(selectMetricRecord("v.c.substate"))
  const vCCurrent = useSelector(selectMetricRecord("v.c.current"))
  const vCLimit = useSelector(selectMetricRecord("v.c.climit"))
  const vCVoltage = useSelector(selectMetricRecord("v.c.voltage"))
  const vCKwh = useSelector(selectMetricRecord("v.c.kwh"))
  const vCKwhGrid = useSelector(selectMetricRecord("v.c.kwh.grid"))
  const vCKwhGridTotal = useSelector(selectMetricRecord("v.c.kwh.grid.total"))
  const vCEfficiency = useSelector(selectMetricRecord("v.c.efficiency"))
  const vC12vCurrent = useSelector(selectMetricRecord("v.c.12v.current"))
  const vC12vPower = useSelector(selectMetricRecord("v.c.12v.power"))
  const vC12vTemp = useSelector(selectMetricRecord("v.c.12v.temp"))
  const vC12vVoltage = useSelector(selectMetricRecord("v.c.12v.voltage"))

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      chargeMode: useSelector(selectMetricValue("v.c.mode")),
    }
  });

  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({title: charging ? "Charging" : "Not Charging"})
  }, [navigation, charging])

  const theme = useTheme()

  return (
    <View style={{ flex: 1, flexDirection: 'column', margin: 20 }}>
      <View style={{ flex: 1, flexDirection: 'column', padding: 20 }}>
        <HorizontalBatteryIcon></HorizontalBatteryIcon>
      </View>
      <View style={{ flex: 10, gap: 10 }}>
        <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <MetricVal metricRecord={vBatHealth}></MetricVal>
          <Text> ({t("SOH")}: </Text>
          <MetricVal metricRecord={vBatSoh} emptyOverride="N/A"></MetricVal>
          <Text>)</Text>
        </View>

        <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon source='thermometer' size={20}></Icon>
            <MetricVal metricRecord={vBatTemp} variant='bodyLarge' emptyOverride="N/A"></MetricVal>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon source='lightning-bolt' size={20}></Icon>
            <MetricVal metricRecord={vBatVoltage} variant='bodyLarge' emptyOverride="N/A"></MetricVal>
          </View>
          <MetricVal metricRecord={vBatRangeEst} variant='bodyLarge' emptyOverride="N/A"></MetricVal>
        </View>

        <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text>{t('Trip odometer')}: </Text>
          <MetricVal metricRecord={vPTrip}></MetricVal>
        </View>

        <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text>{t('Last charge')}: </Text>
          <MetricVal metricRecord={vCTimestamp}></MetricVal>
        </View>

        <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
          <Button
            mode="contained"
            onPress={() => {
              if (charging) {
                sendCommand({ commandCode: CommandCode.STOP_CHARGE })
                return;
              }
              sendCommand({ commandCode: CommandCode.START_CHARGE })
            }}
          >
            <Text style={{color: theme.colors.onPrimary}}>{charging ? t('Stop Charging') : t('Start Charging')}</Text>
          </Button>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

          {charging &&
            <Section title={"Time until..."} visibilityToggle={false}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>100%: </Text>
                <MetricVal metricRecord={vCDurationFull} emptyOverride="N/A"></MetricVal>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>{sufficientSOC ?? t("Sufficient SOC")}%: </Text>
                <MetricVal metricRecord={vCDurationSoc} emptyOverride="N/A"></MetricVal>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>{sufficientRange ?? t("Sufficient range")} {sufficientRangeUnit ?? ""}: </Text>
                <MetricVal metricRecord={vCDurationRange} emptyOverride="N/A"></MetricVal>
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
                        iconColor={theme.colors.onSurface}
                        selectedTextStyle={{ color: theme.colors.onSurface }}
                        itemTextStyle={{ color: theme.colors.onSurface }}
                        containerStyle={{ backgroundColor: theme.colors.surfaceVariant }}
                        itemContainerStyle={{ backgroundColor: theme.colors.surfaceVariant }}
                        activeColor={theme.colors.surface}
                        style={{ backgroundColor: theme.colors.surfaceVariant, padding: 10 }}
                        value={value}
                        onChange={(v) => {
                          setValue('chargeMode', v.value)
                          sendCommand({ commandCode: CommandCode.SET_CHARGE_MODE, params: [v.value] })
                        }}
                        data={vCModes}
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

          <Section title={"Power"}>
            <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
              <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Power: ")}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Battery: ")}</Text>
                  <MetricVal numberOfLines={1} adjustsFontSizeToFit={true} metricRecord={vBPower} emptyOverride="N/A"></MetricVal>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Generator: ")}</Text>
                  <MetricVal numberOfLines={1} adjustsFontSizeToFit={true} metricRecord={vGPower} emptyOverride="N/A"></MetricVal>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Motor: ")}</Text>
                  <MetricVal numberOfLines={1} adjustsFontSizeToFit={true} metricRecord={vIPower} emptyOverride="N/A"></MetricVal>
                </View>
              </View>
            </View>
          </Section>

          <Section title={"More Details"} visibleDefault={true}>

            <Section title={"Charger"}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t('State')}: </Text>
                <MetricVal numberOfLines={1} adjustsFontSizeToFit={true} metricRecord={vCState} emptyOverride="N/A"></MetricVal>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', marginLeft: 10 }}>
                <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t('Substate')}: </Text>
                <MetricVal numberOfLines={1} adjustsFontSizeToFit={true} metricRecord={vCSubstate} emptyOverride="N/A"></MetricVal>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t('Current')}: </Text>
                  <MetricVal numberOfLines={1} adjustsFontSizeToFit={true} metricRecord={vCCurrent} emptyOverride="N/A"></MetricVal>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text numberOfLines={1} adjustsFontSizeToFit={true}>({t('Maximum')}: </Text>
                  <MetricVal numberOfLines={1} adjustsFontSizeToFit={true} metricRecord={vCLimit} emptyOverride="N/A"></MetricVal>
                  <Text numberOfLines={1} adjustsFontSizeToFit={true}>)</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Voltage")}: </Text>
                <MetricVal numberOfLines={1} adjustsFontSizeToFit={true} metricRecord={vCVoltage} emptyOverride="N/A"></MetricVal>
              </View>
                              <View style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 5 }}>
                <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Energy")}: </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                  <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Sum: ")}</Text>
                  <MetricVal numberOfLines={1} adjustsFontSizeToFit={true} metricRecord={vCKwh} emptyOverride="N/A"></MetricVal>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Drawn")}: </Text>
                    <MetricVal numberOfLines={1} adjustsFontSizeToFit={true} metricRecord={vCKwhGrid} emptyOverride="N/A"></MetricVal>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}> ({t('Lifetime')}: </Text>
                    <MetricVal numberOfLines={1} adjustsFontSizeToFit={true} metricRecord={vCKwhGridTotal} emptyOverride="N/A"></MetricVal>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true}>)</Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text numberOfLines={1} adjustsFontSizeToFit={true}>{t("Efficiency")}: </Text>
                <MetricVal numberOfLines={1} adjustsFontSizeToFit={true} metricRecord={vCEfficiency} emptyOverride="N/A"></MetricVal>
              </View>
            </Section>

            <Section title={"12V DC/DC Converter"} visibilityToggle={true}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>{t("Current")}: </Text>
                <MetricVal metricRecord={vC12vCurrent} emptyOverride="N/A"></MetricVal>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>{t("Power")}: </Text>
                <MetricVal metricRecord={vC12vPower} emptyOverride="N/A"></MetricVal>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>{t("Temperature")}: </Text>
                <MetricVal metricRecord={vC12vTemp} emptyOverride="N/A"></MetricVal>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>{t("Voltage")}: </Text>
                <MetricVal metricRecord={vC12vVoltage} emptyOverride="N/A"></MetricVal>
              </View>
            </Section>

          </Section>

        </ScrollView>
      </View>
    </View>
  );
}

function Section({ title, children, visibilityToggle, visibleDefault }: { title: string, children?: any, visibilityToggle?: boolean, visibleDefault?: boolean }) {
  const { t } = useTranslation()
  const theme = useTheme()
  
  visibleDefault ??= false
  const [childrenVisible, setChildrenVisible] = useState(visibleDefault)

  visibilityToggle ??= true
  if (visibilityToggle == false && !childrenVisible) {
    setChildrenVisible(true)
  }

  return (
    <View style={[styles.section, { backgroundColor: theme.colors.elevation.level4 }]}>
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10 }}>
        {title && <Text variant="titleLarge">{t(title)}</Text>}
        {visibilityToggle &&
          <IconButton icon={childrenVisible ? 'eye' : 'eye-off'} size={15} onPress={() => setChildrenVisible(!childrenVisible)}></IconButton>
        }
      </View>
      {childrenVisible && children}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    borderColor: 'grey',
    borderWidth: 2,
    flexDirection: 'column',
    padding: 10,
    gap: 10,
    marginBottom: 20,
    alignItems: 'flex-start'
  },
  button: {
    backgroundColor: 'grey',
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
  }
})