import { DashboardWidget } from "../types"
import React, { useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { widgetRegistry } from "../registry";
import EditWidgetCapsule from "../components/EditWidgetCapsule";
import { useSelector } from "react-redux";
import { selectMetricRecord, selectMetricUnit, selectMetricValue } from "@/store/metricsSlice";
import { HelperText, Text } from 'react-native-paper'
import { GaugeOilPressure, PressureUnits } from "react-native-vehicle-gauges";
import { NumberInput } from "../../ui/NumberInput";
import { GetUnitAbbr, numericalUnitConvertor } from "@/components/utils/numericalUnitConverter";
import { getPressureUnit } from "@/store/preferencesSlice";
import { useTranslation } from "react-i18next";
import { MetricInput } from "@/components/ui/MetricInput";

const ID = "Oil Pressure"
const STORAGE_UNIT = "psi"

export default class OilPressureWidget extends DashboardWidget {
  public type: string = ID;
  public metricName: string = ""
  public minPressure: number = 0
  public maxPressure: number = 80
  public lowPressure: number = 15
  public highPressure: number = 70

  public displayComponent = ({ self }: { self: DashboardWidget }) => {
    const binding = self as unknown as OilPressureWidget

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

    if (record == undefined) {
      return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><HelperText type={"error"}>{t("Metric")} {binding.metricName} {t("is undefined")}</HelperText></View>
    }

    if (
      preferredUnit == undefined
      //@ts-ignore
      || !numericalUnitConvertor().from(STORAGE_UNIT).possibilities().includes(record.localisedUnit)
    ) {
      return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><HelperText type={"error"}>{t("Incompatible metric")} {binding.metricName} {t('for Oil Pressure widget')}</HelperText></View>
    }

    return (
      <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onLayout={onParentViewLayout}>
        <GaugeOilPressure
          size={size}
          pressure={+record.localisedValue}
          units={preferredUnit == "kPa" ? "kpa" : preferredUnit as PressureUnits}
          minPressure={numericalUnitConvertor(binding.minPressure).from(STORAGE_UNIT).to(preferredUnit)}
          maxPressure={numericalUnitConvertor(binding.maxPressure).from(STORAGE_UNIT).to(preferredUnit)}
          lowPressure={numericalUnitConvertor(binding.lowPressure).from(STORAGE_UNIT).to(preferredUnit)}
          highPressure={numericalUnitConvertor(binding.highPressure).from(STORAGE_UNIT).to(preferredUnit)}
        >
        </GaugeOilPressure>
      </View>
    )
  }

  public editComponent = ({ self, setSelf, onEdit }: { self: DashboardWidget, setSelf: (newSelf: DashboardWidget) => void, onEdit: () => void }) => {
    const binding = self as unknown as OilPressureWidget

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
    const binding = self as unknown as OilPressureWidget

    const preferredUnit = useSelector(getPressureUnit)

    const { t } = useTranslation()

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          <MetricInput value={binding.metricName} setValue={(s) => setSelf({ ...binding, metricName: s })}></MetricInput>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <NumberInput value={numericalUnitConvertor(binding.minPressure).from(STORAGE_UNIT).to(preferredUnit).toString()} label={"Minimum Pressure"} setValue={(v) => setSelf({ ...binding, minPressure: numericalUnitConvertor(v).from(preferredUnit).to(STORAGE_UNIT) })}></NumberInput>
          <Text variant="labelMedium">{t(preferredUnit)}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <NumberInput value={numericalUnitConvertor(binding.maxPressure).from(STORAGE_UNIT).to(preferredUnit).toString()} label={"Maximum Pressure"} setValue={(v) => setSelf({ ...binding, maxPressure: numericalUnitConvertor(v).from(preferredUnit).to(STORAGE_UNIT) })}></NumberInput>
          <Text variant="labelMedium">{t(preferredUnit)}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <NumberInput value={numericalUnitConvertor(binding.lowPressure).from(STORAGE_UNIT).to(preferredUnit).toString()} label={"Low Pressure"} setValue={(v) => setSelf({ ...binding, lowPressure: numericalUnitConvertor(v).from(preferredUnit).to(STORAGE_UNIT) })}></NumberInput>
          <Text variant="labelMedium">{t(preferredUnit)}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <NumberInput value={numericalUnitConvertor(binding.highPressure).from(STORAGE_UNIT).to(preferredUnit).toString()} label={"High Pressure"} setValue={(v) => setSelf({ ...binding, highPressure: numericalUnitConvertor(v).from(preferredUnit).to(STORAGE_UNIT) })}></NumberInput>
          <Text variant="labelMedium">{t(preferredUnit)}</Text>
        </View>

      </View>
    )
  }
}

widgetRegistry.register(ID, OilPressureWidget)