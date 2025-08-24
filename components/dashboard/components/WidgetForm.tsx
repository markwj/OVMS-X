import { Controller, useForm } from "react-hook-form";
import { DashboardWidget } from "../types";
import { widgetRegistry } from "../registry";
import { Modal, Portal, useTheme, Text } from "react-native-paper";
import React, { useState } from "react";
import { View } from "react-native";
import { StandardSubmitButton } from "./FormModal";
import { useTranslation } from "react-i18next";
import { Dropdown } from "react-native-element-dropdown";
import { FormDashboardComponent } from "../components";

export function WidgetForm({ visible, setVisible, widget, submit }: { visible: boolean, setVisible: (visible: boolean) => void, widget: DashboardWidget, submit: (newState: DashboardWidget) => void }) {
  const theme = useTheme()

  const { t } = useTranslation()

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<{
    holdingWidget: DashboardWidget
  }>({
    defaultValues: {
      holdingWidget: widget ? widget : new (widgetRegistry.getEmptyWidget())
    }
  })

  //Alternates between 1 and 0. Set to change props passed to form (and hence trigger manual rerender).
  const [rerenderFormFlip, setRerenderFormFlip] = useState(0)

  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={{ backgroundColor: theme.colors.elevation.level5, padding: 20, borderColor: 'grey', borderWidth: 2, gap: 10 }}
        onDismiss={() => { setVisible(false); setValue("holdingWidget", widget); }}
      >
        <View style={{ flexShrink: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text variant="titleMedium">{`${t('Edit')}`} {widget.type}</Text>
          </View>
          <Controller
            control={control}
            name={"holdingWidget"}
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
                      data={widgetRegistry.getWidgetOptions().map((v) => { return { "label": v, "value": v }; })}
                      labelField={"label"}
                      valueField={"value"}
                      onChange={(v) => {
                        const newState = new (widgetRegistry.get(v.value)!)
                        onChange(newState)
                      }} />
                  </View>

                  {value.formComponent && <View style={{ flexDirection: 'row', backgroundColor: theme.colors.elevation.level5, padding: 20, borderColor: 'grey', borderWidth: 2 }}>
                    <FormDashboardComponent key={rerenderFormFlip} item={value} setItem={(v: any) => { setRerenderFormFlip(rerenderFormFlip ? 1 : 0); onChange(v); }}></FormDashboardComponent>
                  </View>}
                </>
              );
            }}>
          </Controller>
          <StandardSubmitButton onPress={handleSubmit((v) => {
            submit(v.holdingWidget);
            setVisible(false)
          })}></StandardSubmitButton>
        </View>
      </Modal>
    </Portal>
  )
}