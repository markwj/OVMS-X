import { Controller, useForm } from "react-hook-form";
import { Dashboard } from "../types";
import { dashboardRegistry } from "../registry";
import { TextInput, Modal, Portal, useTheme, Text, IconButton } from "react-native-paper";
import React from "react";
import { View } from "react-native";
import { StandardSubmitButton } from "./FormModal";
import { useTranslation } from "react-i18next";
import { ConfirmationMessage } from "@/components/ui/ConfirmationMessage";

export function DashboardForm({ visible, setVisible, dashboard, submit, deleteDashboard }: { deleteDashboard: () => void, visible: boolean, setVisible: (visible: boolean) => void, dashboard: Dashboard, submit: (newState: Dashboard) => void }) {
  const theme = useTheme()

  const { t } = useTranslation()

  const { control, handleSubmit } = useForm<{
    holdingDashboard: Dashboard
  }>({
    defaultValues: {
      holdingDashboard: dashboard ? dashboard : dashboardRegistry.generateDashboard({ name: "New Dashboard", type: "Blank", params: "{}" })
    }
  })

  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={{ backgroundColor: theme.colors.elevation.level5, padding: 20, borderColor: 'grey', borderWidth: 2, gap: 10 }}
        onDismiss={() => setVisible(false)}
      >
        <View style={{ flexShrink: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text variant="titleMedium">{`${t('Edit')}`} {dashboard.name}</Text>
          </View>
          <Controller
            control={control}
            name={"holdingDashboard.name"}
            render={({ field: { value, onChange } }) => {
              return (
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
              )
            }}>
          </Controller>
          {/* <Controller
            control={control}
            name={"holdingDashboard"}
            render={({ field: { value, onChange } }) => {
              return (
                <View style={{ flexDirection: 'row' }}>
                  {value.formComponent &&
                    <View style={{ flex: 1, backgroundColor: theme.colors.elevation.level5, gap: 10 }}>
                      {value.formComponent({
                        self: value,
                        setSelf: (t) => {console.log(t); onChange(t)},
                      })}
                    </View>
                  }
                </View>
              )
            }}>
          </Controller> */}
          <StandardSubmitButton onPress={handleSubmit((v) => {
            submit(v.holdingDashboard);
            setVisible(false)
          })}></StandardSubmitButton>
        </View>
      </Modal>
    </Portal>
  )
}