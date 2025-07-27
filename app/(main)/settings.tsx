import React, { useRef, useState } from "react";
import { useTheme, Text, Button, SegmentedButtons, Card, Icon, List, DataTable, IconButton, Portal, Modal } from 'react-native-paper';
import { KeyboardAvoidingView, Platform, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { ScrollView } from "react-native-gesture-handler"
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
import { notificationsEnabled, notificationsToken } from "@/store/notificationSlice";
import StoredCommandsTable from "@/components/ui/StoredCommandsTable";
import { getCommands, StoredCommand, storedCommandsSlice } from "@/store/storedCommandsSlice";

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
  const [mainScrollEnabled, setMainScrollEnabled] = useState(true)
  const storedCommands = useSelector(getCommands)
  const [editCommandModalParams, setEditCommandModalParams] = useState<{ index: number, command: StoredCommand } | null>(null)

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

  const openEditCommandModal = async (index: number, command: StoredCommand) => {
    setEditCommandModalParams({ index: index, command: command })

  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={height + 100}
      enabled={true}
      style={styles.container}>

      {/* Editing custom command display */}
      <Portal>
        <Modal 
        visible={editCommandModalParams != null} 
        contentContainerStyle={{ backgroundColor: theme.colors.backdrop, padding: 20, borderColor: 'grey', borderWidth: 5, gap: 10 }} 
        onDismiss={() => setEditCommandModalParams(null)}
        
        >
          <View style={{ flexShrink: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="titleMedium">{t("Edit custom command")}</Text>
          </View>
          <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text variant="labelLarge">{t("Name: ")}</Text>
            <TextInput
              value={editCommandModalParams?.command.name}
              onChangeText={(t) => setEditCommandModalParams({ ...editCommandModalParams!, command: { ...editCommandModalParams!.command, name: t } })}
              style={{ color: 'white', flexDirection: 'row', backgroundColor: 'dimgrey', padding: 5, borderColor: 'black', borderWidth: 2, flex: 1 }}
              placeholder="Name"
            />
          </View>
          <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
            <Text variant="labelLarge">{t("Command: ")}</Text>
            <TextInput
              value={editCommandModalParams?.command.command}
              onChangeText={(t) => setEditCommandModalParams({ ...editCommandModalParams!, command: { ...editCommandModalParams!.command, command: t } })}
              style={{ color: 'white', flexDirection: 'row', backgroundColor: 'dimgrey', padding: 5, borderColor: 'black', borderWidth: 2, flex: 1 }}
              placeholder="Command"
              autoCapitalize="none"
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
            <View style={{ flex: 1 }}>
              <Button onPress={() => { dispatch(storedCommandsSlice.actions.setCommand(editCommandModalParams!)); setEditCommandModalParams(null) }}>Submit</Button>
            </View>
            {(editCommandModalParams?.index ?? -1) < storedCommands.length &&
              <IconButton
                style={{ position: 'absolute', right: '0%' }}
                icon={"delete"}
                onPress={() => { dispatch(storedCommandsSlice.actions.removeCommand(editCommandModalParams!.index)); setEditCommandModalParams(null) }}
              ></IconButton>
            }
          </View>
        </Modal>
      </Portal>

      <ScrollView style={styles.scrollview} nestedScrollEnabled={true} scrollEnabled={mainScrollEnabled}>

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

        <SettingsSection title={"Stored Commands"} headerRight={() => <IconButton size={15} icon={"plus"} onPress={() => openEditCommandModal(storedCommands.length, { name: "New Command", command: "", key: 0 })}></IconButton>}>
          <StoredCommandsTable setMainScrollEnabled={setMainScrollEnabled} openEditMenu={openEditCommandModal} />
        </SettingsSection>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SettingsSection({ title, children, headerRight }: { title?: string, children?: any, headerRight?: () => React.JSX.Element }) {
  const { t } = useTranslation()

  return (
    <View style={styles.settingsSection}>
      <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10 }}>
        {title && <Text variant="titleLarge">{t(title)}</Text>}
        {headerRight && headerRight()}
      </View>
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
    flex: 1,
    flexDirection: 'column',
    backgroundColor: "rgba(50,47,55,0.4)",
    padding: 10,
    paddingBottom: 20,
    gap: 10,
    marginBottom: 30,
    alignItems: 'flex-start'
  },
  headerRow: {
    flex: 1,
    flexDirection: 'row',
  },
  headerText: {
    flex: 1,
    flexDirection: 'row',
    color: 'white',
  },
  valueRow: {
    flex: 1,
  },
  valueText: {
    flex: 1,
    color: 'white',
  },
});