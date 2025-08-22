import React, { ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";
import { GestureResponderEvent, View } from "react-native";
import { Modal, useTheme, Button, Text } from "react-native-paper";

type StandardFormModalProps = ComponentProps<typeof Modal> & {name: string}

export function FormModal(props : StandardFormModalProps) {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Modal
      {...props}
      contentContainerStyle={props.contentContainerStyle ?? { backgroundColor: theme.colors.elevation.level5, padding: 20, borderColor: 'grey', borderWidth: 2, gap: 10 }}
    >
      <View style={{ flexShrink: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="titleMedium">{`${t('Edit')} ${t(props.name)}`}</Text>
      </View>
      {props.children}
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