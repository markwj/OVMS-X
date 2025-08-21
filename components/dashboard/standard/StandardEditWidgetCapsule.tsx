import React, { JSX } from "react";
import { View } from "react-native";
import { DashboardWidget } from "../types";
import { useTranslation } from "react-i18next";
import { useTheme, Text, IconButton, TouchableRipple } from "react-native-paper";
import { EMPTY_WIDGET_ID } from "../registry";

export type StandardEditWidgetCapsuleProps = {
  children : JSX.Element,
  label: string,
  onDelete: () => void,
  onEdit: () => void
}

export default function StandardEditWidgetCapsule(props: StandardEditWidgetCapsuleProps) {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <View style={{ flex: 1, flexDirection: 'column', padding: 5 }}>
      <View style={{ flexGrow: 4, borderColor: 'grey', borderWidth: 2 }}>
        {props.children}
      </View>
      <View style={{ flexShrink: 1, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: theme.colors.elevation.level4, padding: 10, alignItems: 'center' }}>
        <View style={{ flexGrow: 4 }}>
          <Text variant="labelMedium">{t(props.label)}</Text>
        </View>
        <View style={{ flexShrink: 1, alignItems: 'flex-end', flexDirection: 'row' }}>
          <IconButton icon={"pencil"} onPress={props.onEdit} />
          <IconButton icon={"delete"} onPress={props.onDelete} />
        </View>
      </View>
    </View>
  )
}