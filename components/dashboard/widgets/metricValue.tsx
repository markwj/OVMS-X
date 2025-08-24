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

const ID = "Metric"

export default class MetricValueWidget extends DashboardWidget {
  public type: string = ID;

  public metricName: string = "v.p.odometer"

  public displayComponent = ({ self }: { self: DashboardWidget }) => {
    const binding = self as unknown as MetricValueWidget

    const record = useSelector(selectMetricRecord(binding.metricName))

    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="labelMedium">{binding.metricName}</Text>
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
            <Text variant="labelMedium">{binding.metricName}</Text>
            <MetricVal metricRecord={record}></MetricVal>
          </View>
        </EditWidgetCapsule>
      </>
    )
  }

  public formComponent = ({ self, setSelf }: { self: DashboardWidget; setSelf: (newState: any) => void }) => {
    const binding = self as unknown as MetricValueWidget

    const { t } = useTranslation()

    const keys = useSelector(selectMetricsKeys)

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          <TextInput
            label={t("Name")}
            clearButtonMode="always"
            value={binding.metricName}
            onChangeText={(t) => { setSelf({ ...binding, metricName: t }) }}
            style={{ flex: 1 }}
            autoCapitalize="none"
          />
        </View>
        <View style={{ flexDirection: 'row', padding: 0 }}>
          {!keys.includes(binding.metricName) && (
            <HelperText type={"error"}>
              {t("Undefined metric")}
            </HelperText>
          )}
        </View>
      </View>
    )
  }
}

widgetRegistry.register(ID, MetricValueWidget)