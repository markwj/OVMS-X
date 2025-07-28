import React from "react";
import { Text, Icon, Button } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { HorizontalBatteryIcon } from "@/components/ui/BatteryIcon";
import { MetricValue } from "@/components/ui/MetricValue";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { selectLocalisedMetricValue, selectMetricValue } from "@/store/metricsSlice";
import { Dropdown } from "react-native-element-dropdown";
import { ConnectionCommand } from "@/components/platforms/connection";
import { CommandCode } from "@/components/platforms/Commands";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { useTranslation } from "react-i18next";
import { store } from "@/store/root";
import { ScrollView } from "react-native-gesture-handler";

const vCModes = [
  { value: "standard", label: "Standard" },
  { value: "range", label: "Range" },
  { value: "performance", label: "Performance" },
  { value: "storage", label: "Storage" }
]

export default function ChargingScreen() {
  const vehicle = useSelector(getSelectedVehicle)
  const sufficientSOC = useSelector(selectMetricValue("v.c.limit.soc"))
  const sufficientRange = store.dispatch(selectLocalisedMetricValue("v.c.limit.range"))

  const { t } = useTranslation()

  const charging = useSelector(selectMetricValue("v.c.inprogress")) == "yes"
  console.log(charging)

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      chargeMode: useSelector(selectMetricValue("v.c.mode")),
    }
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, flexDirection: 'column', margin: 20 }}>
        <View style={{ flex: 1, flexDirection: 'column', padding: 20 }}>
          <HorizontalBatteryIcon></HorizontalBatteryIcon>
        </View>
        <View style={{ flex: 10, gap: 10 }}>

          <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <MetricValue metricKey={"v.b.health"} emptyOverride="Unknown health condition"></MetricValue>
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

          <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <Button
              style={[styles.button, (!charging ? styles.buttonActive : styles.buttonInactive)]}
              onPress={() => {
                if (charging) { return; }
                ConnectionCommand(vehicle, { commandCode: CommandCode.START_CHARGE })
              }}
            >
              <Text style={styles.buttonText}>{t('START CHARGING')}</Text>
            </Button>
            <Button
              style={[styles.button, (charging ? styles.buttonActive : styles.buttonInactive)]}
              onPress={() => {
                if (!charging) { return; }
                ConnectionCommand(vehicle, { commandCode: CommandCode.STOP_CHARGE })
              }}
            >
              <Text style={styles.buttonText}>{t('STOP CHARGING')}</Text>
            </Button>
          </View>

          <ScrollView style={{ flex: 1 }}>

            {charging &&
              <View style={styles.sectionContainer}>
                <Text style={{ flexShrink: 1 }} variant="bodyLarge">{t("Time until...")}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>100%: </Text>
                  <MetricValue metricKey={"v.c.duration.full"} emptyOverride="N/A"></MetricValue>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{sufficientSOC ?? "Sufficient SOC"}%: </Text>
                  <MetricValue metricKey={"v.c.duration.soc"} emptyOverride="N/A"></MetricValue>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text>{sufficientSOC ?? "Sufficient range"} {sufficientRange.unit}: </Text>
                  <MetricValue metricKey={"v.c.duration.range"} emptyOverride="N/A"></MetricValue>
                </View>
              </View>
            }

            <View style={styles.sectionContainer}>
              <View style={{ flexShrink: 1 }}>
                <Text variant="labelMedium">Charge Mode</Text>
              </View>
              <View style={{ flexGrow: 4, width: '100%' }}>
                <Controller
                  control={control}
                  name={"chargeMode"}
                  render={({ field: { value } }) => {
                    return (
                      <Dropdown
                        iconColor='white'
                        selectedTextStyle={{ color: 'white' }}
                        itemTextStyle={{ color: 'white' }}
                        containerStyle={{ backgroundColor: 'grey' }}
                        itemContainerStyle={{ backgroundColor: 'grey' }}
                        activeColor="dimgrey"
                        style={{ backgroundColor: 'dimgrey', borderColor: 'black', borderWidth: 2, padding: 5 }}
                        value={value}
                        onChange={(v) => {
                          setValue('chargeMode', v.value)
                          ConnectionCommand(vehicle, { commandCode: CommandCode.SET_CHARGE_MODE, params: {mode: v.value} })
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

            <View style={styles.sectionContainer}>
              <Text style={{ flexShrink: 1 }} variant="labelMedium">Charge Power Limit</Text>
              <Text>Pretend there's a slider here for now...</Text>
            </View>

          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider >
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flexShrink: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    padding: 20,
    borderColor: 'grey',
    borderWidth: 2,
    borderRadius: 20,
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