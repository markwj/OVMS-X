import { DashboardWidget } from "../types"
import React, { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { widgetRegistry } from "../registry";
import EditWidgetCapsule from "../components/EditWidgetCapsule";
import { GaugeSpeedometer, GaugeTachometer } from "react-native-vehicle-gauges"
import { useSelector } from "react-redux";
import { selectMetricRecord } from "@/store/metricsSlice";
import { useTranslation } from "react-i18next";
import { HelperText } from "react-native-paper";

const ID = "Tachometer"

export default class TachometerWidget extends DashboardWidget {
  public type: string = ID;
  public displayComponent = ({ self }: { self: DashboardWidget }) => {
    const record = useSelector(selectMetricRecord("v.m.rpm"))
    const [size, setSize] = useState({ width: 'auto', height: '100%' });

    const onParentViewLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if (width > height) {
        setSize({ width: 'auto', height: '90%' })
      } else {
        setSize({ height: 'auto', width: '90%' })
      }
    }

    const {t} = useTranslation()

    if(record?.localisedValue == undefined) { return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}><HelperText type={"error"}>{t("Metric")} v.m.rpm {t("is undefined")}</HelperText></View> }

    const value = +record.localisedValue || 0
    const unit = record.localisedUnit

    return (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }} onLayout={onParentViewLayout}>
      {/* @ts-ignore */}
      <GaugeTachometer rpm={value} units={unit} size={size}></GaugeTachometer>
    </View>)
  }

  public editComponent = ({ self, setSelf, onEdit }: { self: DashboardWidget, setSelf: (newSelf: DashboardWidget) => void, onEdit: () => void }) => {
    const binding = self as unknown as TachometerWidget

    const C = binding.displayComponent

    return (
      <>
        <EditWidgetCapsule
          label={ID}
          onDelete={() => setSelf(new (widgetRegistry.getEmptyWidget()))}
          onEdit={onEdit}
        >
          <C self={self} />
        </EditWidgetCapsule>
      </>
    )
  }

  public formComponent = undefined;
}

widgetRegistry.register(ID, TachometerWidget)