import React, { useRef, useState } from "react";
import { useTheme, Text, Button, SegmentedButtons, Card, Icon, TextInput, DataTable, IconButton, Portal, Modal, Switch, Checkbox } from 'react-native-paper';
import { KeyboardAvoidingView, Platform, StyleSheet, View, Appearance } from 'react-native';
import { ScrollView } from "react-native-gesture-handler"
import { useSelector, useDispatch } from "react-redux";
import {
  getTemperaturePreference, getDistancePreference, getPressurePreference,
  TemperatureChoiceType, DistanceChoiceType, PressureChoiceType,
  setTemperaturePreference, setPressurePreference, setDistancePreference,
  getColorScheme,
  getLanguage,
  setLanguage,
  setColorScheme
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
import { Dropdown } from "react-native-element-dropdown";
import { fallbackLng, resources, SupportedLanguages, TSupportedLanguages } from "@/i18n";
import { getLocales } from "expo-localization";
import { DashboardButton, DashboardEditButton } from "@/components/ui/DashboardButtons";
import { dashboardSlice, selectDashboard, selectDashboards, selectSerializedDashboards } from "@/store/dashboardSlice";
import { router } from "expo-router";
import { NestableDraggableFlatList, NestableScrollContainer } from "react-native-draggable-flatlist";
import { dashboardRegistry } from "@/components/dashboard/registry";
import { Dashboard } from "@/components/dashboard/types";

interface FormData {
  temperaturePreference: TemperatureChoiceType;
  distancePreference: DistanceChoiceType;
  pressurePreference: PressureChoiceType;
  colorMode: "light" | "dark" | "null",
  language: TSupportedLanguages | null
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
  const { t, i18n } = useTranslation();

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
  const colorMode = useSelector(getColorScheme)
  const language = useSelector(getLanguage)

  const serializedDashboards = useSelector(selectSerializedDashboards)
  const dashboards = useSelector(selectDashboards)

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: {
      temperaturePreference: temperaturePreference,
      distancePreference: distancePreference,
      pressurePreference: pressurePreference,
      language: language,
      colorMode: colorMode ?? (useTheme().dark ? "dark" : "light")
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

  const locales = getLocales()
  const defaultLanguage = locales[0].languageCode

  const LanguageOptions = [{
    label: `${t('System')} (${resources[((defaultLanguage && i18n.exists(defaultLanguage)) ? defaultLanguage : fallbackLng) as TSupportedLanguages].name})`, value: "null"
  },
  ...SupportedLanguages.map((k) => {
    const displayName = resources[k].name
    return { label: displayName, value: k }
  })]

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
          contentContainerStyle={{ backgroundColor: theme.colors.elevation.level5, padding: 20, borderColor: 'grey', borderWidth: 2, gap: 10 }}
          onDismiss={() => setEditCommandModalParams(null)}
        >
          {(editCommandModalParams?.index ?? -1) < storedCommands.length &&
            <IconButton
              style={{ position: 'absolute', right: '2%', top: '2%' }}
              icon={"delete"}
              onPress={() => { dispatch(storedCommandsSlice.actions.removeCommand(editCommandModalParams!.index)); setEditCommandModalParams(null) }}
            ></IconButton>
          }
          <View style={{ flexShrink: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="titleMedium">{t("Edit stored command")}</Text>
          </View>
          <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
              label={t("Name")}
              clearButtonMode="always"
              value={editCommandModalParams?.command.name}
              onChangeText={(t) => setEditCommandModalParams({ ...editCommandModalParams!, command: { ...editCommandModalParams!.command, name: t } })}
              style={{ flex: 1 }}
            />
          </View>
          <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
              label={t("Command")}
              clearButtonMode="always"
              value={editCommandModalParams?.command.command}
              onChangeText={(t) => setEditCommandModalParams({ ...editCommandModalParams!, command: { ...editCommandModalParams!.command, command: t } })}
              style={{ flex: 1 }}
              autoCapitalize="none"
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative', padding: 10 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text variant="labelMedium" style={{ marginRight: 10 }}>Autosend</Text>
              <View style={{ borderWidth: 2, borderColor: theme.colors.primary, borderRadius: 5 }}>
                <Checkbox
                  status={editCommandModalParams?.command.autosend ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setEditCommandModalParams({ ...editCommandModalParams!, command: { ...editCommandModalParams!.command, autosend: !editCommandModalParams?.command.autosend } })
                  }}
                >
                </Checkbox>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
            <View style={{ flex: 1 }}>
              <Button
                mode="contained"
                onPress={() => { dispatch(storedCommandsSlice.actions.setCommand(editCommandModalParams!)); setEditCommandModalParams(null) }}>
                {t("Save")}
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      <ScrollView style={styles.scrollview} nestedScrollEnabled={true} scrollEnabled={mainScrollEnabled}>

        {(os !== 'web') && (
          <>
            <Card>
              <Card.Title
                title={t("App") + ': ' + Application?.applicationName + ' v' + Application?.nativeApplicationVersion}
                subtitle={t("Build") + ': ' + os + ' ' + Application?.nativeBuildVersion +
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

        <SettingsSection title={"User Interface"}>
          <Text variant="labelMedium">{t("Language")}</Text>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Controller
                  control={control}
                  name="language"
                  render={({ field: { value } }) => (
                    <Dropdown
                      iconColor={theme.colors.onSurface}
                      selectedTextStyle={{ color: theme.colors.onSurface }}
                      itemTextStyle={{ color: theme.colors.onSurface }}
                      containerStyle={{ backgroundColor: theme.colors.surfaceVariant }}
                      itemContainerStyle={{ backgroundColor: theme.colors.surfaceVariant }}
                      activeColor={theme.colors.surface}
                      style={{ backgroundColor: theme.colors.surfaceVariant, padding: 10, flex: 1 }}
                      data={LanguageOptions}
                      onChange={async (v) => {
                        setValue("language", v.value)
                        dispatch(setLanguage(v.value))
                        if (v == null) {
                          i18n.changeLanguage(v.value)
                        } else {
                          i18n.changeLanguage(defaultLanguage ?? fallbackLng)
                        }
                      }}
                      labelField={"label"} valueField={"value"}
                      value={value}
                    />
                  )}
                />
              </View>
            </View>
          </View>

          <Text variant="labelMedium">{t("Appearence")}</Text>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Controller
                control={control}
                name="colorMode"
                render={({ field: { value } }) => (
                  <SegmentedButtons
                    value={value}
                    onValueChange={async (value) => {
                      setValue("colorMode", value)
                      if (value != "null") {
                        Appearance.setColorScheme(value)
                        dispatch(setColorScheme(value))
                      } else {
                        Appearance.setColorScheme(undefined)
                        dispatch(setColorScheme(value))
                      }
                    }}
                    buttons={[{ label: t("System"), value: "null" }, { label: t("Light"), value: "light" }, { label: t("Dark"), value: "dark" }]}
                  />
                )}
              />
            </View>
          </View>
        </SettingsSection>

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

        <SettingsSection title={"Stored Commands"} headerRight={() => <IconButton size={15} icon={"plus"} onPress={() => openEditCommandModal(storedCommands.length, { name: "New Command", command: "", key: 0, autosend: true })}></IconButton>}>
          <StoredCommandsTable setMainScrollEnabled={setMainScrollEnabled} openEditMenu={openEditCommandModal} />
        </SettingsSection>

        <SettingsSection title={"Dashboards"} headerRight={() => <IconButton size={15} icon={"plus"} onPress={() => {
          const constructor = dashboardRegistry.get("1x1")!
          const dashboard = new constructor("New Dashboard", [])
          const serializedDashboard = dashboard.serialize()
          console.log(`[settings] Created dashboard ${serializedDashboard}`)
          dispatch(dashboardSlice.actions.addSerializedDashboard(dashboard.serialize()))
          router.push({ pathname: "/dashboard/edit/[id]", params: { id: dashboards.length } })
        }}></IconButton>}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
              {dashboards.map((d, i) => (
                <DashboardEditButton index={i} key={`${d}-${i}`}></DashboardEditButton>
              ))}
            </View>
          </View>
        </SettingsSection>
        <Button style={{marginBottom: 50}} onPress={() => dispatch(dashboardSlice.actions.wipeDashboards())}>WIPE</Button>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SettingsSection({ title, children, headerRight }: { title?: string, children?: any, headerRight?: () => React.JSX.Element }) {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <View style={[styles.settingsSection, { backgroundColor: theme.colors.elevation.level4 }]}>
      <View style={{ flex: 1, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10 }}>
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
    padding: 10,
    paddingBottom: 20,
    gap: 10,
    marginBottom: 20,
    alignItems: 'flex-start',
    borderColor: 'grey',
    borderWidth: 2,
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