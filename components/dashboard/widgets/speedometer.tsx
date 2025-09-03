import { DashboardWidget } from "../types"
import React, { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { widgetRegistry } from "../registry";
import EditWidgetCapsule from "../components/EditWidgetCapsule";
import { GaugeSpeedometer } from "react-native-vehicle-gauges"
import { useSelector } from "react-redux";
import { selectMetricRecord } from "@/store/metricsSlice";

const ID = "Speedometer"

export default class SpeedometerWidget extends DashboardWidget {
  public type: string = ID;
  public displayComponent = ({ self }: { self: DashboardWidget }) => {
    const speedRecord = useSelector(selectMetricRecord("v.p.speed"))
    const [size, setSize] = useState({ width: 'auto', height: '100%' });

    const onParentViewLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if (width > height) {
        setSize({ width: 'auto', height: '90%' })
      } else {
        setSize({ height: 'auto', width: '90%' })
      }
    }

    if (speedRecord == undefined) { return <></> }

    const speedValue = +speedRecord.localisedValue
    const speedUnit = speedRecord.localisedUnit

    return (<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }} onLayout={onParentViewLayout}>
      {/* @ts-ignore */}
      <GaugeSpeedometer speed={speedValue} units={speedUnit} size={size}></GaugeSpeedometer>
    </View>)
  }

  public editComponent = ({ self, setSelf, onEdit }: { self: DashboardWidget, setSelf: (newSelf: DashboardWidget) => void, onEdit: () => void }) => {
    const binding = self as unknown as SpeedometerWidget

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

widgetRegistry.register(ID, SpeedometerWidget)