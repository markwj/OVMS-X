import { DashboardWidget } from "../types"
import React, { useCallback, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { widgetRegistry } from "../registry";
import EditWidgetCapsule from "../components/EditWidgetCapsule";
import { useSelector } from "react-redux";
import { selectMetricRecord } from "@/store/metricsSlice";
import { HelperText, Text } from 'react-native-paper'
import { GaugeFuel } from "react-native-vehicle-gauges";
import { NumberInput } from "../../ui/NumberInput";
import { numericalUnitConvertor } from "@/components/utils/numericalUnitConverter";
import { getVolumeUnit } from "@/store/preferencesSlice";
import { useTranslation } from "react-i18next";
import { MetricInput } from "@/components/ui/MetricInput";

const ID = "Fuel"
const STORAGE_UNIT = "l"

export default class FuelWidget extends DashboardWidget {
  public type: string = ID;
  public metricName: string = ""
  public lowVolume: number = 4
  public capacity: number = 60

  public displayComponent = ({ self }: { self: DashboardWidget }) => {
    const binding = self as unknown as FuelWidget

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

    const FuelGaugeWrapper = ({level} : {level :  number | null}) => {
      const lowFuelPercent = binding.lowVolume / binding.capacity

      return (
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} onLayout={onParentViewLayout}>
          {/** @ts-ignore */}
          <GaugeFuel size={size} fuelLevel={level ?? NaN} lowFuelThreshold={lowFuelPercent} units={preferredUnit}></GaugeFuel>
        </View>
      )
    }


    if (record?.localisedUnit == "%") {
      return <FuelGaugeWrapper level={+record.localisedValue}></FuelGaugeWrapper>
    }


    if (record == undefined) {
      return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><HelperText type={"error"}>{t("Metric")} {binding.metricName} {t("is undefined")}</HelperText></View>
    }

    if (
      preferredUnit == undefined
      //@ts-ignore
      || (!numericalUnitConvertor().from(STORAGE_UNIT).possibilities().includes(record.localisedUnit))
    ) {

      return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><HelperText type={"error"}>{t("Incompatible metric")} {binding.metricName} {t('for Fuel widget')}</HelperText></View>
    }


    const currentFuelPercent = (+record.localisedValue / numericalUnitConvertor(binding.capacity).from(STORAGE_UNIT).to(preferredUnit)) * 100
    return <FuelGaugeWrapper level={currentFuelPercent}></FuelGaugeWrapper>
  }

  public editComponent = ({ self, setSelf, onEdit }: { self: DashboardWidget, setSelf: (newSelf: DashboardWidget) => void, onEdit: () => void }) => {
    const binding = self as unknown as FuelWidget

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
    const binding = self as unknown as FuelWidget

    const preferredUnit = useSelector(getVolumeUnit)

    const { t } = useTranslation()

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          <MetricInput value={binding.metricName} setValue={(s) => setSelf({ ...binding, metricName: s })}></MetricInput>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <NumberInput value={numericalUnitConvertor(binding.capacity).from(STORAGE_UNIT).to(preferredUnit).toString()} label={t("Max Capacity")} setValue={(v) => setSelf({ ...binding, capacity: numericalUnitConvertor(v).from(preferredUnit).to(STORAGE_UNIT) })}></NumberInput>
          <Text variant="labelMedium">{t(preferredUnit)}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <NumberInput value={numericalUnitConvertor(binding.lowVolume).from(STORAGE_UNIT).to(preferredUnit).toString()} label={t("Low Volume")} setValue={(v) => setSelf({ ...binding, lowVolume: numericalUnitConvertor(v).from(preferredUnit).to(STORAGE_UNIT) })}></NumberInput>
          <Text variant="labelMedium">{t(preferredUnit)}</Text>
        </View>

      </View>
    )
  }
}

widgetRegistry.register(ID, FuelWidget)