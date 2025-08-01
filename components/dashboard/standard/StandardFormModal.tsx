import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { GestureResponderEvent, View } from "react-native";
import { Modal, useTheme, Button, Text } from "react-native-paper";
import { DashboardWidget } from "../types";

export function StandardFormModal({ widget, visible, dismiss }: { widget: DashboardWidget | null, visible: boolean, dismiss: () => void }) {
  const { t } = useTranslation()
  const theme = useTheme()

  if(widget == null) { return <></>}

  return (
    <Modal
      visible={visible}
      contentContainerStyle={{ backgroundColor: theme.colors.elevation.level5, padding: 20, borderColor: 'grey', borderWidth: 2, gap: 10 }}
      onDismiss={dismiss}
    >
      <View style={{ flexShrink: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="titleMedium">{`${t('Edit')} ${t(widget.ID)}`}</Text>
      </View>
      {widget.renderForm(dismiss)}
    </Modal>
  )
}

export function StandardSubmitButton({ onPress }: { onPress: (e: GestureResponderEvent) => void }) {
  const { t } = useTranslation()

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <Button
          mode="contained"
          onPress={onPress}>
          {t("Save")}
        </Button>
      </View>
    </View>
  )
}