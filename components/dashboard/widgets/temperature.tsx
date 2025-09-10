import { DashboardWidget } from "../types"
import React, { useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { widgetRegistry } from "../registry";
import EditWidgetCapsule from "../components/EditWidgetCapsule";
import { useSelector } from "react-redux";
import { selectMetricRecord, selectMetricUnit, selectMetricValue } from "@/store/metricsSlice";
import { HelperText, Text } from 'react-native-paper'
import { GaugeOilPressure, GaugeTemperature, PressureUnits } from "react-native-vehicle-gauges";
import { NumberInput } from "../../ui/NumberInput";
import { GetUnitAbbr, numericalUnitConvertor } from "@/components/utils/numericalUnitConverter";
import { getPressureUnit, getTemperatureUnit } from "@/store/preferencesSlice";
import { useTranslation } from "react-i18next";
import { MetricInput } from "@/components/ui/MetricInput";

const ID = "Temperature"
const STORAGE_UNIT = "°C"

export default class TemperatureWidget extends DashboardWidget {
  public type: string = ID;
  public metricName: string = ""
  public minTemperature: number = 0
  public maxTemperature: number = 100
  public lowTemperature: number = 15
  public highTemperature: number = 80

  public displayComponent = ({ self }: { self: DashboardWidget }) => {
    const binding = self as unknown as TemperatureWidget

    const record = useSelector(selectMetricRecord(binding.metricName))

    const preferredUnit = record?.localisedUnit

    const [size, setSize] = useState({ width: 'auto', height: '90%' });

    const onParentViewLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if (width > height * 2) {
        setSize({ width: 'auto', height: '90%' })
      } else {
        setSize({ height: 'auto', width: '90%' })
      }
    }

    const { t } = useTranslation()

    if(record == undefined) {
      return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><HelperText type={"error"}>{t("Metric")} {binding.metricName} {t("is undefined")}</HelperText></View>
    }

    if (
      preferredUnit == undefined
      //@ts-ignore
      || !numericalUnitConvertor().from(STORAGE_UNIT).possibilities().includes(record.localisedUnit)
    ) {
      return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><HelperText type={"error"}>{t("Incompatible metric")} {binding.metricName} {t('for Temperature widget')}</HelperText></View>
    }

    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onLayout={onParentViewLayout}>
        <GaugeTemperature
          temperature={+record.localisedValue}
          size={size}
          //@ts-ignore
          units={preferredUnit}
          minTemperature={numericalUnitConvertor(binding.minTemperature).from(STORAGE_UNIT).to(preferredUnit)}
          maxTemperature={numericalUnitConvertor(binding.maxTemperature).from(STORAGE_UNIT).to(preferredUnit)}
          lowTemperature={numericalUnitConvertor(binding.lowTemperature).from(STORAGE_UNIT).to(preferredUnit)}
          highTemperature={numericalUnitConvertor(binding.highTemperature).from(STORAGE_UNIT).to(preferredUnit)}
        >
        </GaugeTemperature>
      </View>
    )
  }

  public editComponent = ({ self, setSelf, onEdit }: { self: DashboardWidget, setSelf: (newSelf: DashboardWidget) => void, onEdit: () => void }) => {
    const binding = self as unknown as TemperatureWidget

    const C = binding.displayComponent

    return (
      <>
        <EditWidgetCapsule
          label={ID}
          onDelete={() => setSelf(new (widgetRegistry.getEmptyWidget()))}
          onEdit={onEdit}
        >
          <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <C self={self} />
          </View>
        </EditWidgetCapsule>
      </>
    )
  }

  public formComponent = ({ self, setSelf }: { self: DashboardWidget; setSelf: (newState: any) => void }) => {
    const binding = self as unknown as TemperatureWidget

    const preferredUnit = useSelector(getTemperatureUnit)

    const { t } = useTranslation()

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          <MetricInput value={binding.metricName} setValue={(s) => setSelf({ ...binding, metricName: s })}></MetricInput>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <NumberInput value={numericalUnitConvertor(binding.minTemperature).from(STORAGE_UNIT).to(preferredUnit).toString()} label={"Minimum Temperature"} setValue={(v) => setSelf({ ...binding, minTemperature: numericalUnitConvertor(v).from(preferredUnit).to(STORAGE_UNIT) })}></NumberInput>
          <Text variant="labelMedium">{t(preferredUnit)}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <NumberInput value={numericalUnitConvertor(binding.maxTemperature).from(STORAGE_UNIT).to(preferredUnit).toString()} label={"Maximum Temperature"} setValue={(v) => setSelf({ ...binding, maxTemperature: numericalUnitConvertor(v).from(preferredUnit).to(STORAGE_UNIT) })}></NumberInput>
          <Text variant="labelMedium">{t(preferredUnit)}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <NumberInput value={numericalUnitConvertor(binding.lowTemperature).from(STORAGE_UNIT).to(preferredUnit).toString()} label={"Low Temperature"} setValue={(v) => setSelf({ ...binding, lowTemperature: numericalUnitConvertor(v).from(preferredUnit).to(STORAGE_UNIT) })}></NumberInput>
          <Text variant="labelMedium">{t(preferredUnit)}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <NumberInput value={numericalUnitConvertor(binding.highTemperature).from(STORAGE_UNIT).to(preferredUnit).toString()} label={"High Temperature"} setValue={(v) => setSelf({ ...binding, highTemperature: numericalUnitConvertor(v).from(preferredUnit).to(STORAGE_UNIT) })}></NumberInput>
          <Text variant="labelMedium">{t(preferredUnit)}</Text>
        </View>

      </View>
    )
  }
}

widgetRegistry.register(ID, TemperatureWidget)