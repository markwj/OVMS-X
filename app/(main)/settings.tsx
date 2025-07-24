import React from "react";
import { useTheme, Text, Button, SegmentedButtons, Card, Icon } from 'react-native-paper';
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
import { GetUnitAbbr, numericalUnitConvertor } from "@/components/utils/numericalUnitConverter";
import { ConfirmationMessage } from "@/components/ui/ConfirmationMessage";
import { messagesSlice } from "@/store/messagesSlice";
import { vehiclesSlice } from "@/store/vehiclesSlice";
import { os } from "@/utils/platform";
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Updates from 'expo-updates';
import * as Application from 'expo-application';
import { notificationsEnabled, notificationsToken } from "@/store/notificationSlice";

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
  { value: PressureChoiceType.kPa, label: 'kPa' }
]

export default function SettingsScreen() {
  const height = useHeaderHeight()
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const { isChecking, currentlyRunning } = Updates.useUpdates();
  const notificationEnabled = useSelector(notificationsEnabled);
  const notificationToken = useSelector(notificationsToken);

  const theme = useTheme()

  const temperaturePreference = useSelector(getTemperaturePreference)
  const distancePreference = useSelector(getDistancePreference)
  const pressurePreference = useSelector(getPressurePreference)

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: {
      temperaturePreference: temperaturePreference,
      distancePreference: distancePreference,
      pressurePreference: pressurePreference
    }
  });

  const updateVersion =
    (!__DEV__ &&
      !(Constants.executionEnvironment == ExecutionEnvironment.StoreClient) &&
      Platform.OS !== 'web' &&
      typeof currentlyRunning !== 'undefined' &&
      typeof currentlyRunning?.createdAt !== 'undefined' &&
      typeof currentlyRunning?.channel !== 'undefined' &&
      typeof currentlyRunning?.runtimeVersion !== 'undefined')
      ? currentlyRunning?.createdAt + "(" + currentlyRunning?.channel + ' / ' + currentlyRunning?.runtimeVersion + ')'
      : undefined;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={height + 100}
      enabled={true}
      style={styles.container}>

      <ScrollView style={styles.scrollview}>

        {(os !== 'web') && (
          <>
            <Card>
              <Card.Title
                title={'App: ' + Application?.applicationName + ' v' + Application?.nativeApplicationVersion}
                subtitle={'Build: ' + os + ' ' + Application?.nativeBuildVersion +
                  (typeof updateVersion !== 'undefined' ? "\nUpdate: " + updateVersion : "")}
                subtitleNumberOfLines={(typeof updateVersion !== 'undefined') ? 3 : 1}
                left={(props) => <Icon {...props} source="application-cog" />}
              />
            </Card>
            <View style={{ height: 10 }} />
          </>
        )}

        {(notificationEnabled) && (
          <>
            <View style={{ height: 10 }} />
            <Card>
              <Card.Title
                title={'Notification Token: '}
                subtitle={notificationToken}
                subtitleNumberOfLines={1}
                left={(props) => <Icon {...props} source="bell" />}
              />
            </Card>
            <View style={{ height: 10 }} />
          </>
        )}

        <SettingsSection title={"Metrics"}>

          <Text variant="labelMedium">{t('Temperature')}</Text>
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

          <Text variant="labelMedium">{t('Distance')}</Text>
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

          <Text variant="labelMedium">{t('Pressure')}</Text>
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
        </SettingsSection>

        <SettingsSection title={""}>
          <Button textColor="red" onPress={() => ConfirmationMessage(
            () => {dispatch(messagesSlice.actions.wipeMessages())},
            "Warning!",
            "Do you want to delete all your messages? This action cannot be undone.",
            "Delete"
          )}>DELETE MESSAGES</Button>
          <Button textColor="red" onPress={() => ConfirmationMessage(
            () => {dispatch(vehiclesSlice.actions.wipeVehicles())},
            "Warning!",
            "Do you want to delete all your vehicles? This action cannot be undone.",
            "Delete"
          )}>DELETE ALL VEHICLES</Button>
        </SettingsSection>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SettingsSection({ title, children }: { title?: string, children?: any }) {
  const { t } = useTranslation()

  return (
    <View style={styles.settingsSection}>
      {title && <Text variant="titleLarge" style={{ paddingBottom: 10 }}>{t(title)}</Text>}
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
    flexDirection: 'column',
    padding: 20
  },
  settingsSection: {
    backgroundColor: "rgba(50,47,55,0.4)",
    padding: 10,
    paddingBottom: 20,
    gap: 10,
    marginBottom: 30,
    alignItems: 'flex-start'
  }
});