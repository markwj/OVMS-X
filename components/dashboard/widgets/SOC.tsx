import { DashboardWidget } from "../types"
import React, { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { widgetRegistry } from "../registry";
import EditWidgetCapsule from "../components/EditWidgetCapsule";
import { GaugeFuel, GaugeSpeedometer } from "react-native-vehicle-gauges"
import { useSelector } from "react-redux";
import { selectMetricRecord } from "@/store/metricsSlice";
import { useTranslation } from "react-i18next";
import { HelperText } from "react-native-paper";

const ID = "SOC"

export default class SOCWidget extends DashboardWidget {
  public type: string = ID;
  public displayComponent = ({ self }: { self: DashboardWidget }) => {
    const socRecord = useSelector(selectMetricRecord("v.b.soc"))
    const [size, setSize] = useState({ width: 'auto', height: '90%' });

    const onParentViewLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if (width > height*2) {
        setSize({ width: 'auto', height: '90%' })
      } else {
        setSize({ height: 'auto', width: '90%' })
      }
    }

    const {t} = useTranslation()

    if(socRecord?.localisedValue == undefined) { return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}><HelperText type={"error"}>{t("Could not load widget")}</HelperText></View> }

    return (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }} onLayout={onParentViewLayout}>
      <GaugeFuel size={size} fuelLevel={+socRecord.localisedValue} lowFuelThreshold={20} label={t("SOC")}></GaugeFuel>
    </View>)
  }

  public editComponent = ({ self, setSelf, onEdit }: { self: DashboardWidget, setSelf: (newSelf: DashboardWidget) => void, onEdit: () => void }) => {
    const binding = self as unknown as SOCWidget

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

widgetRegistry.register(ID, SOCWidget)