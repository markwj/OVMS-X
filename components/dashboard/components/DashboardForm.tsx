import { Controller, useForm } from "react-hook-form";
import { Dashboard } from "../types";
import { dashboardRegistry } from "../registry";
import { TextInput, Modal, Portal, useTheme, Text, HelperText } from "react-native-paper";
import React, { useState } from "react";
import { View } from "react-native";
import { StandardSubmitButton } from "./FormModal";
import { useTranslation } from "react-i18next";
import { Dropdown } from "react-native-element-dropdown";
import { FormDashboardComponent } from "../components";
import { newBlankDashboard, selectDashboardNames } from "@/store/dashboardSlice";
import { store } from "@/store/root";
import { useSelector } from "react-redux";

export function DashboardForm({ visible, setVisible, dashboard, index, submit }: { index: number, visible: boolean, setVisible: (visible: boolean) => void, dashboard: Dashboard, submit: (newState: Dashboard) => void }) {
  const theme = useTheme()

  const { t } = useTranslation()

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<{
    holdingDashboard: Dashboard
  }>({
    defaultValues: {
      holdingDashboard: dashboard ? dashboard : newBlankDashboard({})(store.getState())
    }
  })

  const dashboardNames = useSelector(selectDashboardNames)

  //Alternates between 1 and 0. Set to change props passed to form (and hence trigger manual rerender).
  const [rerenderFormFlip, setRerenderFormFlip] = useState(0)

  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={{ backgroundColor: theme.colors.elevation.level5, padding: 20, borderColor: 'grey', borderWidth: 2, gap: 10 }}
        onDismiss={() => { setVisible(false); setValue("holdingDashboard", dashboard); }}
      >
        <View style={{ flexShrink: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text variant="titleMedium">{`${t('Edit')}`} {dashboard.name}</Text>
          </View>
          <Controller
            control={control}
            name={"holdingDashboard.name"}
            rules={{
              required: t('Name required'), validate: (v) => {
                const exists = dashboardNames.indexOf(v)
                if (exists == -1) { return true }
                if (exists == index) { return true }
                return t("Duplicate names are not permitted")
              }
            }}
            render={({ field: { value, onChange } }) => {
              return (
                <>
                  {errors.holdingDashboard?.name && (
                    <HelperText type={"error"}>
                      {errors.holdingDashboard.name.message}
                    </HelperText>
                  )}
                  <View style={{ flexDirection: 'row' }}>
                    <TextInput
                      label={t("Name")}
                      clearButtonMode="always"
                      value={value}
                      onChangeText={(t) => { onChange(t) }}
                      style={{ flex: 1 }}
                      autoCapitalize="none"
                    />
                  </View>
                </>
              )
            }}>
          </Controller>
          <Controller
            control={control}
            name={"holdingDashboard"}
            render={({ field: { value, onChange } }) => {
              return (
                <>
                  <View style={{ flexDirection: 'row' }}>
                    <Dropdown
                      iconColor={theme.colors.onSurface}
                      selectedTextStyle={{ color: theme.colors.onSurface }}
                      itemTextStyle={{ color: theme.colors.onSurface }}
                      containerStyle={{ backgroundColor: theme.colors.surfaceVariant }}
                      itemContainerStyle={{ backgroundColor: theme.colors.surfaceVariant }}
                      activeColor={theme.colors.surface}
                      style={{ backgroundColor: theme.colors.surfaceVariant, padding: 10, flex: 1 }}
                      value={value.type}
                      data={dashboardRegistry.getDashboardOptions().map((v) => { return { "label": v, "value": v }; })}
                      labelField={"label"}
                      valueField={"value"}
                      onChange={(v) => {
                        onChange(new (dashboardRegistry.get(v.value)!)({
                          name: value.name,
                          type: v.value,
                          params: "{}"
                        }))
                      }} />
                  </View>

                  {value.formComponent && <View style={{ flexDirection: 'row', backgroundColor: theme.colors.elevation.level5, padding: 20, borderColor: 'grey', borderWidth: 2 }}>
                    <FormDashboardComponent item={value} key={rerenderFormFlip} setItem={(v: any) => { setRerenderFormFlip(rerenderFormFlip == 0 ? 1 : 0); onChange(v); }}></FormDashboardComponent>
                  </View>}
                </>
              );
            }}>
          </Controller>
          <StandardSubmitButton onPress={handleSubmit((v) => {
            submit(v.holdingDashboard);
            setVisible(false)
          })}></StandardSubmitButton>
        </View>
      </Modal>
    </Portal>
  )
}