import { DashboardWidget } from "../types"
import React, { useState } from "react";
import { LogBox, View } from "react-native";
import { widgetRegistry } from "../registry";
import { Button, HelperText, Text, TextInput, useTheme } from "react-native-paper";
import EditWidgetCapsule from "../components/EditWidgetCapsule";
import { useSelector } from "react-redux";
import { selectMetricRecord, selectMetricsKeys } from "@/store/metricsSlice";
import { MetricVal } from "@/components/ui/MetricValue";
import { useTranslation } from "react-i18next";
import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

const ID = "Metric"

export default class MetricValueWidget extends DashboardWidget {
  public type: string = ID;
  public metricName: string = "v.p.odometer"
  public metricLabel: string = ""

  public displayComponent = ({ self }: { self: DashboardWidget }) => {
    const binding = self as unknown as MetricValueWidget

    const record = useSelector(selectMetricRecord(binding.metricName))

    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {binding.metricLabel && binding.metricLabel !== "" && <Text variant="labelMedium">{binding.metricLabel}</Text>}
        <MetricVal metricRecord={record}></MetricVal>
      </View>
    )
  }

  public editComponent = ({ self, setSelf, onEdit }: { self: DashboardWidget, setSelf: (newSelf: DashboardWidget) => void, onEdit: () => void }) => {
    const binding = self as unknown as MetricValueWidget

    const record = useSelector(selectMetricRecord(binding.metricName))

    return (
      <>
        <EditWidgetCapsule
          label={ID}
          onDelete={() => setSelf(new (widgetRegistry.getEmptyWidget()))}
          onEdit={onEdit}
        >
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {binding.metricLabel && binding.metricLabel !== "" && <Text variant="labelMedium">{binding.metricLabel}</Text>}
            <MetricVal metricRecord={record}></MetricVal>
          </View>
        </EditWidgetCapsule>
      </>
    )
  }

  public formComponent = ({ self, setSelf }: { self: DashboardWidget; setSelf: (newState: any) => void }) => {
    const binding = self as unknown as MetricValueWidget

    const { t } = useTranslation()

    const theme = useTheme()

    const keys = useSelector(selectMetricsKeys)
    const filteredKeys = keys.filter((k) => k.startsWith(binding.metricName))

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <AutocompleteDropdownContextProvider>
              <AutocompleteDropdown
                clearOnFocus={false}
                inputContainerStyle={{ backgroundColor: "transparent" }}
                dataSet={filteredKeys.map((k) => ({ id: k, title: k }))}
                onChangeText={(t) => { setSelf({ ...binding, metricName: t }) }}
                onClear={() => { setSelf({ ...binding, metricName: "" }) }}
                onSelectItem={(i) => { setSelf({ ...binding, metricName: i?.id ?? "" }) }}
                direction="down"
                emptyResultText=""
                InputComponent={TextInput}
                suggestionsListContainerStyle={{
                  backgroundColor: theme.colors.surfaceVariant,
                  borderWidth: 2,
                  borderColor: 'black',
                  position: 'absolute',
                  left: -45,
                  top: -5
                }}
                textInputProps={{style: {marginRight: 20}, autoCapitalize: 'none', autoCorrect: false}}
                initialValue={binding.metricName}
              >
              </AutocompleteDropdown>
            </AutocompleteDropdownContextProvider>
          </View>
        </View>
        <View style={{ flexDirection: 'row', padding: 0 }}>
          {!keys.includes(binding.metricName) && (
            <HelperText type={"error"}>
              {t("Undefined metric")}
            </HelperText>
          )}
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            label={t("Label")}
            clearButtonMode="always"
            value={binding.metricLabel}
            onChangeText={(t) => { setSelf({ ...binding, metricLabel: t }) }}
            style={{ flex: 1 }}
            dense={true}
          />
        </View>
      </View>
    )
  }
}

widgetRegistry.register(ID, MetricValueWidget)