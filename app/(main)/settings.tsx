import React from "react";
import { useTheme, Text, SegmentedButtons, Card, Icon } from 'react-native-paper';
import { KeyboardAvoidingView, ScrollView, Platform, StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import {
  getTemperaturePreference, getDistancePreference, getPressurePreference,
  TemperatureChoiceType, DistanceChoiceType, PressureChoiceType,
  setTemperaturePreference, setPressurePreference, setDistancePreference
} from "@/store/preferencesSlice";
import { useForm, Controller } from "react-hook-form";
import { useHeaderHeight } from '@react-navigation/elements'
import { useTranslation } from "react-i18next";
import { os } from "@/utils/platform";
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Updates from 'expo-updates';
import * as Application from 'expo-application';
interface FormData {
  temperaturePreference: TemperatureChoiceType;
  distancePreference: DistanceChoiceType;
  pressurePreference: PressureChoiceType;
}

const TEMPERATURE_BUTTONS = [
  { value: TemperatureChoiceType.SYSTEM, label: 'System' },
  { value: TemperatureChoiceType.CELSIUS, label: 'Celsius' },
  { value: TemperatureChoiceType.FAHRENHEIT, label: 'Fahrenheit' }
]

const DISTANCE_BUTTONS = [
  { value: DistanceChoiceType.SYSTEM, label: 'System' },
  { value: DistanceChoiceType.KILOMETERS, label: 'Kilometers' },
  { value: DistanceChoiceType.MILES, label: 'Miles' }
]

const PRESSURE_BUTTONS = [
  { value: PressureChoiceType.SYSTEM, label: 'System' },
  { value: PressureChoiceType.PSI, label: 'PSI' },
  { value: PressureChoiceType.BAR, label: 'Bar' },
  { value: PressureChoiceType.KPA, label: 'kPa' }
]

export default function SettingsScreen() {
  const height = useHeaderHeight()
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const { isChecking, currentlyRunning } = Updates.useUpdates();

  const temperaturePreference = useSelector(getTemperaturePreference)
  const distancePreference = useSelector(getDistancePreference)
  const pressurePreference = useSelector(getPressurePreference)

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: {
      temperaturePreference: temperaturePreference,
      distancePreference: distancePreference,
      pressurePreference: pressurePreference,
    }
  });

  const updateVersion =
    (!__DEV__ &&
      !(Constants.executionEnvironment == ExecutionEnvironment.StoreClient) &&
      Platform.OS !== 'web' &&
      typeof currentlyRunning !== 'undefined')
      ? currentlyRunning?.createdAt + "\n" + currentlyRunning?.channel + ' / ' + currentlyRunning?.runtimeVersion
      : undefined;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={height + 100}
      enabled={true}
      style={styles.container}>

      <ScrollView style={styles.scrollview}>

        {(os !== 'web') && (
          <Card>
            <Card.Title
              title={'App: ' + Application?.applicationName + ' v' + Application?.nativeApplicationVersion}
              subtitle={'Build: ' + os + ' ' + Application?.nativeBuildVersion +
                (typeof updateVersion !== 'undefined' ? "\n" + updateVersion : "")}
              subtitleNumberOfLines={(typeof updateVersion !== 'undefined') ? 3 : 1}
              left={(props) => <Icon {...props} source="application-cog" />}
            />
          </Card>
        )}

        <View style={{ height: 10 }} />

        <Text>{t('Temperature')}</Text>
        <Controller
          control={control}
          name="temperaturePreference"
          render={({ field: { value } }) => (
            <SegmentedButtons
              value={value}
              onValueChange={(value) => {
                {
                  setValue('temperaturePreference', value)
                }
                dispatch(setTemperaturePreference(value))
              }}
              buttons={TEMPERATURE_BUTTONS}
            />
          )}
        />

        <View style={{ height: 10 }} />

        <Text>{t('Distance')}</Text>
        <Controller
          control={control}
          name="distancePreference"
          render={({ field: { value } }) => (
            <SegmentedButtons
              value={value}
              onValueChange={(value) => {
                setValue('distancePreference', value)
                dispatch(setDistancePreference(value))
              }}
              buttons={DISTANCE_BUTTONS}
            />
          )}
        />

        <View style={{ height: 10 }} />

        <Text>{t('Pressure')}</Text>
        <Controller
          control={control}
          name="pressurePreference"
          render={({ field: { value } }) => (
            <SegmentedButtons
              value={value}
              onValueChange={(value) => {
                setValue('pressurePreference', value)
                dispatch(setPressurePreference(value))
              }}
              buttons={PRESSURE_BUTTONS}
            />
          )}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
    flexDirection: 'column',
    gap: 20,
    padding: 20
  },
  gap: {
    height: 20
  }
});