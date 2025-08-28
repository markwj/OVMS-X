import { DashboardWidget } from "../types"
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { widgetRegistry } from "../registry";
import EditWidgetCapsule from "../components/EditWidgetCapsule";
import { GaugeGear, GaugeGearOrientation } from "react-native-vehicle-gauges"
import { useSelector } from "react-redux";
import { selectMetricRecord } from "@/store/metricsSlice";
import { useTranslation } from "react-i18next";
import { useTheme, Text } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";

const ID = "Gear"

function MapGearMetricToText(gearMetric: number) {
  switch (gearMetric) {
    case -2:
      return "P"
    case -1:
      return "R"
    case 0:
      return "N"
    case 1:
      return "D"
    default:
      return gearMetric.toString()
  }
}

export default class GearWidget extends DashboardWidget {
  public type: string = ID;
  public orientation: GaugeGearOrientation = "portrait"

  public displayComponent = ({ self }: { self: DashboardWidget }) => {
    const binding = self as unknown as GearWidget

    const record = useSelector(selectMetricRecord("v.e.gear"))
    const [size, setSize] = useState({ width: 'auto', height: '100%' });

    const onParentViewLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if (binding.orientation == "landscape") {
        setSize({ width: (width * 0.9).toString(), height: ((width / 2.5) * 0.9).toString() })
      } else {
        setSize({ height: (height * 0.9).toString(), width: ((height / 2.5) * 0.9).toString() })
      }
    }

    const value = record ? (MapGearMetricToText(+record?.localisedValue) || "") : ""

    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }} onLayout={onParentViewLayout}>
        <GaugeGear orientation={binding.orientation} size={size} currentGear={value}></GaugeGear>
      </View>
    )
  }

  public editComponent = ({ self, setSelf, onEdit }: { self: DashboardWidget, setSelf: (newSelf: DashboardWidget) => void, onEdit: () => void }) => {
    const binding = self as unknown as GearWidget

    const record = useSelector(selectMetricRecord("v.e.gear"))
    const [size, setSize] = useState({ width: 'auto', height: '100%' });

    const [parentViewSize, setParentViewSize] = useState<{width: number, height: number} | null>(null)

    const resizeWidget = () => {
      if(parentViewSize == null) { return }
      if (binding.orientation == "landscape") {
        setSize({ width: (parentViewSize.width * 0.9).toString(), height: ((parentViewSize.width / 2.5) * 0.9).toString() })
      } else {
        setSize({ height: (parentViewSize.height * 0.9).toString(), width: ((parentViewSize.height / 2.5) * 0.9).toString() })
      }
    }

    const onParentViewLayout = (event: LayoutChangeEvent | null) => {
      if(event == null) {return;}
      setParentViewSize({width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height})
      resizeWidget()
    }

    useEffect(() => {
      resizeWidget()
    }, [binding.orientation])

    const value = record ? (MapGearMetricToText(+record?.localisedValue) || "") : ""

    return (
      <>
        <EditWidgetCapsule
          label={ID}
          onDelete={() => setSelf(new (widgetRegistry.getEmptyWidget()))}
          onEdit={onEdit}
        >
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }} onLayout={onParentViewLayout}>
            <GaugeGear orientation={binding.orientation} size={size} currentGear={value}></GaugeGear>
          </View>
        </EditWidgetCapsule>
      </>
    )
  }

  public formComponent = ({ self, setSelf }: { self: DashboardWidget; setSelf: (newState: any) => void }) => {
    const binding = self as unknown as GearWidget

    const { t } = useTranslation()

    const theme = useTheme()

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Text>{t("Orientation")}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Dropdown
            data={[
              { "label": "Portrait", "value": "portrait" },
              { "label": "Landscape", "value": "landscape" }
            ]}
            value={binding.orientation}
            onChange={function (item: any): void {
              setSelf({ ...binding, orientation: item.value })
            }}
            labelField={"label"}
            valueField={"value"}
            iconColor={theme.colors.onSurface}
            selectedTextStyle={{ color: theme.colors.onSurface }}
            itemTextStyle={{ color: theme.colors.onSurface }}
            containerStyle={{ backgroundColor: theme.colors.surfaceVariant }}
            itemContainerStyle={{ backgroundColor: theme.colors.surfaceVariant }}
            activeColor={theme.colors.surface}
            style={{ backgroundColor: theme.colors.surfaceVariant, padding: 10, flex: 1 }}
          >
          </Dropdown>
        </View>
      </View>
    )
  }
}

widgetRegistry.register(ID, GearWidget)