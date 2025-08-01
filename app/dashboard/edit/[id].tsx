//Edit dashboard screen brought up by settings

import { ConnectionDisplay } from "@/components/ui/ConnectionDisplay";
import { dashboardSlice, selectDashboard } from "@/store/dashboardSlice";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button, HelperText, IconButton, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper'
import { Controller, FieldValues, useForm} from "react-hook-form";
import { Dropdown } from "react-native-element-dropdown";
import { ConfirmationMessage } from "@/components/ui/ConfirmationMessage";
import { dashboardRegistry } from "@/components/dashboard/registry";

type ConfigFormData = {
  name: string,
  dashboardID: string
}

export default function EditDashboard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const index = +id

  if (index == undefined || Number.isNaN(index)) {
    throw new Error(`Could not retrieve dashboard index`)
  }

  const theme = useTheme()
  const { t } = useTranslation()
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const dashboard = useSelector(selectDashboard(index))

  const [configVisible, setConfigVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setConfigVisible(dashboard?.ID == "")
    }, 300)
    return () => {
      clearTimeout(t)
    }
  }, [])

  const { control: configControl, handleSubmit: handleConfigSubmit, formState: { errors: configErrors } } = useForm<ConfigFormData>({
    defaultValues: {
      name: dashboard?.name,
      dashboardID: dashboard?.ID,
    }
  })
  const dashboardIDs = dashboardRegistry.getDashboardOptions()

  const onConfigSubmit = (data: ConfigFormData) => {
    if(dashboard == undefined) {return}
    let newDashboard = dashboard
    
    if(dashboard.ID != data.dashboardID) {
      const constructor = dashboardRegistry.get(data.dashboardID)!
      newDashboard = new constructor(data.name, dashboard.getWidgets())
    } else {
      newDashboard.setParameter("name", data.name)
    }
    console.log(`[EditDashboard] Pushing dashboard ${newDashboard}`)
    dispatch(dashboardSlice.actions.updateDashboard({index: index, newValue: newDashboard.serialize()}))
    setConfigVisible(false)
  }

  useEffect(() => {
    navigation.setOptions({
      title: `${t('Edit')} ${dashboard?.name}`,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon={"cog"} onPress={() => setConfigVisible(true)}></IconButton>
          <ConnectionDisplay />
        </View>
      )
    })
  }, [navigation, dashboard])

  if(dashboard == null) {
    return (
      <View>
        <Text>{t('Could not load dashboard')}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* Display for config of dashboard itself */}
      <Portal>
        <Modal
          visible={configVisible}
          contentContainerStyle={{ backgroundColor: theme.colors.elevation.level5, padding: 20, borderColor: 'grey', borderWidth: 2, gap: 10 }}
          onDismiss={() => setConfigVisible(false)}
        >
          <View style={{ flexDirection: 'column', gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text variant="titleMedium">{t('Edit Dashboard')}</Text>
              <IconButton
                style={{ position: 'absolute', right: '0%' }}
                icon={"delete"}
                onPress={() => { ConfirmationMessage(t, () => {
                  setTimeout(() => {dispatch(dashboardSlice.actions.removeDashboard(index))}, 500)
                  router.back()
                }, "Warning!", `Are you sure you want to delete ${dashboard.name ?? t("dashboard")}? This action cannot be undone.`, "Delete") }}
              ></IconButton>
            </View>
            <View>
              <View style={{ flexDirection: 'row' }}>
                {(typeof configErrors.name !== 'undefined') &&
                  <HelperText type="error" visible={typeof configErrors.name !== 'undefined'}>
                    {t('Error')}: {configErrors.name?.message}
                  </HelperText>
                }
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text variant="labelMedium" style={{ fontWeight: 'bold' }}>{t('Name')}: </Text>
                <Controller
                  rules={{ required: "Name required", maxLength: 30 }}
                  render={({ field: { value, onChange } }) => (
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <TextInput
                        value={value ?? ""}
                        onChangeText={(v: string) => {
                          onChange(v);
                        }}
                        clearButtonMode="always"
                        style={{ color: theme.colors.secondary, flexDirection: 'row', backgroundColor: theme.colors.surfaceVariant }}
                        dense={true}
                        placeholder="Name..."
                      />
                    </View>
                  )}
                  name={"name"}
                  control={configControl}
                />
              </View>
            </View>
            <View>
              <View style={{ flexDirection: 'row' }}>
                {(typeof configErrors.dashboardID !== 'undefined') &&
                  <HelperText type="error" visible={typeof configErrors.name !== 'undefined'}>
                    {t('Error')}: {configErrors.dashboardID?.message}
                  </HelperText>
                }
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text variant="labelMedium" style={{ fontWeight: 'bold' }}>{t('Style')}: </Text>
                <Controller
                  control={configControl}
                  name="dashboardID"
                  rules={{ required: "Please select a dashboard style" }}
                  render={({ field: { value = dashboard.ID, onChange } }) => (
                    <Dropdown
                      iconColor={theme.colors.onSurface}
                      selectedTextStyle={{ color: theme.colors.onSurface }}
                      itemTextStyle={{ color: theme.colors.onSurface }}
                      containerStyle={{ backgroundColor: theme.colors.surfaceVariant }}
                      itemContainerStyle={{ backgroundColor: theme.colors.surfaceVariant }}
                      activeColor={theme.colors.surface}
                      style={{ backgroundColor: theme.colors.surfaceVariant, padding: 10, flex: 1 }}
                      data={dashboardIDs.map((k) => { return { 'label': k, 'value': k } })}
                      onChange={(v) => onChange(v.value)}
                      labelField={"label"} valueField={"value"}
                      value={value}
                    />
                  )} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {dashboard.renderForm(() => {setConfigVisible(false)})}
            </View>
            <Button style={{ marginTop: 20 }} onPress={handleConfigSubmit(onConfigSubmit)} mode="contained">{t("Save")}</Button>
          </View>
        </Modal>
      </Portal>

      <View style={{ flex: 1 }}>
        {dashboard.renderEdit()}
      </View>
    </View >
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
  }
});