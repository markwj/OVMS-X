import { DashboardWidget } from "../types"
import React, { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { widgetRegistry } from "../registry";
import EditWidgetCapsule from "../components/EditWidgetCapsule";
import { GaugeSpeedometer, GaugeTachometer } from "react-native-vehicle-gauges"
import { useSelector } from "react-redux";
import { selectMetricRecord } from "@/store/metricsSlice";

const ID = "Tachometer"

export default class TachometerWidget extends DashboardWidget {
  public type: string = ID;
  public displayComponent = ({ self }: { self: DashboardWidget }) => {
    const record = useSelector(selectMetricRecord("v.p.rpm"))
    const [size, setSize] = useState({ width: 'auto', height: '100%' });

    const onParentViewLayout = (event : LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if(width > height) {
        setSize({ width: 'auto', height: '100%' })
      } else {
        setSize({ height: 'auto', width: '100%' })
      }
    }

    if (record == undefined) { return <></> }

    const value = +record.localisedValue || 0
    const unit = record.localisedUnit

    return (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }} onLayout={onParentViewLayout}>
      {/* @ts-ignore */}
      <GaugeSpeedometer rpm={value} units={unit} size={size}></GaugeSpeedometer>
    </View>)
  }

  public editComponent = ({ self, setSelf, onEdit }: { self: DashboardWidget, setSelf: (newSelf: DashboardWidget) => void, onEdit: () => void }) => {
    const record = useSelector(selectMetricRecord("v.p.rpm"))
    const [size, setSize] = useState({ width: 'auto', height: '100%' });

    const onParentViewLayout = (event : LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if(width > height) {
        setSize({ width: 'auto', height: '100%' })
      } else {
        setSize({ height: 'auto', width: '100%' })
      }
    }

    if (record == undefined) {
      return <EditWidgetCapsule
        label={ID}
        onDelete={() => setSelf(new (widgetRegistry.getEmptyWidget()))}
        onEdit={onEdit}
      >
        <></>
      </EditWidgetCapsule>
    }

    const value = +record.localisedValue || 0
    const unit = record.localisedUnit

    return (
      <>
        <EditWidgetCapsule
          label={ID}
          onDelete={() => setSelf(new (widgetRegistry.getEmptyWidget()))}
          onEdit={onEdit}
        >
          <View onLayout={onParentViewLayout} style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
            {/* @ts-ignore */}
            <GaugeTachometer rpm={value} units={unit} size={size}></GaugeTachometer>
          </View>
        </EditWidgetCapsule>
      </>
    )
  }

  public formComponent = undefined;
}

widgetRegistry.register(ID, TachometerWidget)