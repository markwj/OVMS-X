import { JSX, useState } from "react";
import { Dashboard, DashboardConfig, DashboardWidget, IDashboardItem } from "../types"
import { View } from "react-native";
import React from "react";
import { Checkbox, Modal, Portal, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";
import { dashboardRegistry, widgetRegistry } from "../registry";
import { useTranslation } from "react-i18next";
import { DisplayedDashboardComponent, EditDashboardComponent } from "../components";
import { WidgetForm } from "../components/WidgetForm";

const type = "Grid"
export default class GridDashboard extends Dashboard {
  public type: string = type;
  width: number
  height: number
  protected widgets: DashboardWidget[] = []
  public addWidget(widget: DashboardWidget, index?: number): void {
    if (index) {
      this.widgets.splice(index, 0, widget)
      return;
    }
    this.widgets.push(widget)
  }

  public border: boolean

  public constructor(data: DashboardConfig) {
    super(data)
    const params = typeof data.params == "string" ? JSON.parse(data.params) : data.params

    this.width = +params["width"]
    if (isNaN(this.width)) { this.width = 1 }
    this.height = +params["height"]
    if (isNaN(this.height)) { this.height = 1 }

    this.border = params["border"] ?? false

    if (params["widgets"]) {
      const deserializedWidgets: DashboardWidget[] = params["widgets"].map((w: any) => {
        const widgetData = w
        const widgetConstructor = widgetRegistry.get(widgetData.type)
        if (widgetConstructor == undefined) { return null }

        const widget = new widgetConstructor()
        for (const k of Object.keys(widgetData)) {
          if (k == "ID") { continue }
          widget.setParameter(k, widgetData[k])
        }
        return widget
      })
      this.widgets = deserializedWidgets
    }

    this.onDimensionChange()
  }

  public onDimensionChange() {
    if (this.widgets.length > (this.width * this.height)) {
      this.widgets.length = (this.width * this.height)
    }

    if (this.widgets.length < (this.width * this.height)) {
      const constructor = widgetRegistry.getEmptyWidget()!
      while (this.widgets.length < (this.width * this.height)) {
        this.widgets.push(new constructor)
      }
    }
  }

  public stringifyParams = ({ self }: { self: any }) => {
    return {
      width: self.width,
      height: self.height,
      border: self.border,
      widgets: self.widgets
    }
  };

  private reorganise<T>(widgets: T[]): T[][] {
    let i = 0;
    let arr: T[][] = []

    for (let h = 0; h < this.height; h++) {
      let row = []

      for (let w = 0; w < this.width; w++) {

        if (i >= widgets.length) {
          if (row.length > 0) { arr.push(row) }
          return arr
        }

        row.push(widgets[i])
        i++
      }
      arr.push(row)
    }
    return arr
  }

  public displayComponent = ({ self, setSelf }: { self: Dashboard, setSelf: (newSelf: any) => void }) => {
    const binding = self as unknown as GridDashboard

    const renderedWidgets: JSX.Element[][] = binding.reorganise<JSX.Element>(binding.widgets.map((w, i) => (
      <View style={{ flex: 1 }} key={i}>
        <DisplayedDashboardComponent item={w} key={i} setItem={(s) => {
          const newWidgets = binding.widgets
          //@ts-ignore
          newWidgets[i] = s
          setSelf({ ...binding, widgets: newWidgets })
        }
        }></DisplayedDashboardComponent>
      </View >
    )))

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        {renderedWidgets.map((row, rowindex) => (
          <View style={[{ flex: 1, flexDirection: 'row' }, binding.border ? { borderColor: 'grey', borderWidth: 2 } : {}]} key={rowindex}>
            {row.map((item) => (item))}
          </View>
        ))}
      </View>
    )
  }

  public editComponent = ({ self, setSelf }: { self: Dashboard, setSelf: (newSelf: any) => void }) => {
    const binding = self as unknown as GridDashboard

    const reorganisedWidgets: DashboardWidget[][] = binding.reorganise<DashboardWidget>(binding.widgets)

    const [widgetFormActive, setWidgetFormActive] = useState<number | null>(null)

    return (
      <>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          {reorganisedWidgets.map((row, rowindex) => (
            <View key={rowindex} style={{ flex: 1, flexDirection: 'row' }}>
              {row.map((item, index) => (
                <View key={index} style={{ flex: 1, flexDirection: 'column' }}>
                  <EditDashboardComponent
                    onEdit={() => setWidgetFormActive(rowindex * binding.width + index)}
                    item={item}
                    setItem={(s) => {
                      const newWidgets = binding.widgets
                      newWidgets[rowindex * binding.width + index] = s as DashboardWidget
                      setSelf({ ...binding, widgets: newWidgets })
                    }}>
                  </EditDashboardComponent>
                </View>
              ))}
            </View>
          ))}
        </View>

        {widgetFormActive != null &&
          <Portal>
            <WidgetForm visible={widgetFormActive != null} setVisible={(visible) => {
              if (visible == false) { setWidgetFormActive(null) }
            }} widget={binding.widgets[widgetFormActive]} submit={(v) => {
              const newWidgets = binding.widgets
              newWidgets[widgetFormActive] = v as DashboardWidget
              setWidgetFormActive(null)
              setSelf({ ...binding, widgets: newWidgets })
            }}
            />
          </Portal>
        }
      </>
    )
  }

  public formComponent = ({ self, setSelf }: { self: Dashboard; setSelf: (newState: any) => void }) => {
    const binding = self as unknown as GridDashboard

    const { t } = useTranslation()
    const theme = useTheme()

    return (
      <View style={{ gap: 10, flex: 1, flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text variant="labelMedium">{t('Bordered')}</Text>
          <View style={{ borderWidth: 2, borderColor: theme.colors.primary, borderRadius: 5 }}>
            <Checkbox status={binding.border ? "checked" : 'unchecked'} onPress={() => {
              const newState = binding
              newState.border = !binding.border
              setSelf(newState)
            }}></Checkbox>
          </View>
        </View>

        <Text variant="labelMedium">{t('Rows')}</Text>
        <View style={{ flexDirection: 'row' }}>
          <SegmentedButtons
            value={binding.height.toString()}
            onValueChange={(value) => {
              const newState = binding
              newState.height = +value
              newState.onDimensionChange()
              setSelf(newState)
            }}
            density="small"
            style={{ flex: 1 }}
            buttons={[
              { value: "1", label: "1", style: { minWidth: 45 } },
              { value: "2", label: "2", style: { minWidth: 45 } },
              { value: "3", label: "3", style: { minWidth: 45 } },
              { value: "4", label: "4", style: { minWidth: 45 } },
              { value: "5", label: "5", style: { minWidth: 45 } },
              { value: "6", label: "6", style: { minWidth: 45 } },
              { value: "7", label: "7", style: { minWidth: 45 } },
              { value: "8", label: "8", style: { minWidth: 45 } }
            ]}
          />
        </View>
        <Text variant="labelMedium">{t('Columns')}</Text>
        <View style={{ flexDirection: 'row' }}>
          <SegmentedButtons
            value={binding.width.toString()}
            onValueChange={(value) => {
              const newState = binding
              newState.width = +value
              newState.onDimensionChange()
              setSelf(newState)
            }}
            density="small"
            style={{ flex: 1 }}
            buttons={[
              { value: "1", label: "1", style: { minWidth: 45 } },
              { value: "2", label: "2", style: { minWidth: 45 } },
              { value: "3", label: "3", style: { minWidth: 45 } },
              { value: "4", label: "4", style: { minWidth: 45 } },
              { value: "5", label: "5", style: { minWidth: 45 } },
              { value: "6", label: "6", style: { minWidth: 45 } },
              { value: "7", label: "7", style: { minWidth: 45 } },
              { value: "8", label: "8", style: { minWidth: 45 } }
            ]}
          />
        </View>
      </View>
    )
  }
}

dashboardRegistry.register(type, GridDashboard)