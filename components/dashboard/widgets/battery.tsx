import { DashboardWidget } from "../types"
import React, { useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { widgetRegistry } from "../registry";
import { HelperText, TextInput, useTheme } from "react-native-paper";
import EditWidgetCapsule from "../components/EditWidgetCapsule";
import { useSelector } from "react-redux";
import { selectMetricRecord, selectMetricsKeys } from "@/store/metricsSlice";
import { useTranslation } from "react-i18next";
import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { GaugeBattery } from "react-native-vehicle-gauges";
import { NumberInput } from "../../ui/NumberInput";
import { MetricInput } from "@/components/ui/MetricInput";

const ID = "Battery"

export default class BatteryWidget extends DashboardWidget {
  public type: string = ID;
  public metricName: string = "v.b.12v.voltage"
  public minVoltage = 0;
  public maxVoltage = 24;
  public lowVoltage = 10;

  public displayComponent = ({ self }: { self: DashboardWidget }) => {
    const binding = self as unknown as BatteryWidget

    const record = useSelector(selectMetricRecord(binding.metricName))

    const [size, setSize] = useState({ width: 'auto', height: '100%' });

    const onParentViewLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if (width > height*2) {
        setSize({ width: 'auto', height: '90%' })
      } else {
        setSize({ height: 'auto', width: '90%' })
      }
    }

    const {t} = useTranslation()

    if(record?.localisedValue == undefined) { return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}><HelperText type={"error"}>{t("Could not load widget")}</HelperText></View> }

    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onLayout={onParentViewLayout}>
        <GaugeBattery voltage={+record.localisedValue} lowVoltage={binding.lowVoltage} minVoltage={binding.minVoltage} maxVoltage={binding.maxVoltage} size={size}></GaugeBattery>
      </View>
    )
  }

  public editComponent = ({ self, setSelf, onEdit }: { self: DashboardWidget, setSelf: (newSelf: DashboardWidget) => void, onEdit: () => void }) => {
    const binding = self as unknown as BatteryWidget
    
    const C = binding.displayComponent

    return (
      <>
        <EditWidgetCapsule
          label={ID}
          onDelete={() => setSelf(new (widgetRegistry.getEmptyWidget()))}
          onEdit={onEdit}
        >
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <C self={self}/>
          </View>
        </EditWidgetCapsule>
      </>
    )
  }

  public formComponent = ({ self, setSelf }: { self: DashboardWidget; setSelf: (newState: any) => void }) => {
    const binding = self as unknown as BatteryWidget

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          <MetricInput value={binding.metricName} setValue={(s) => setSelf({...binding, metricName: s}) }></MetricInput>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <NumberInput value={binding.minVoltage.toString()} label={"Minimum Voltage"} setValue={(v) => setSelf({...binding, minVoltage: v})}></NumberInput>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <NumberInput value={binding.maxVoltage.toString()} label={"Maximum Voltage"} setValue={(v) => setSelf({...binding, maxVoltage: v})}></NumberInput>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <NumberInput value={binding.lowVoltage.toString()} label={"Low Voltage"} setValue={(v) => setSelf({...binding, lowVoltage: v})}></NumberInput>
        </View>

      </View>
    )
  }
}

widgetRegistry.register(ID, BatteryWidget)