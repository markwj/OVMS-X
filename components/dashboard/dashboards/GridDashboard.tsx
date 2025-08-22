import { JSX, useState } from "react";
import { Dashboard, DashboardConfig, DashboardWidget } from "../types"
import { View } from "react-native";
import React from "react";
import { SegmentedButtons, Text, TextInput } from "react-native-paper";
import { dashboardRegistry, widgetRegistry } from "../registry";
import { useTranslation } from "react-i18next";
import { EditDashboardComponent } from "../components";

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

  public constructor(data: DashboardConfig) {
    super(data)
    const params = typeof data.params == "string" ? JSON.parse(data.params) : data.params

    this.width = +params["width"]
    if (isNaN(this.width)) { this.width = 1 }
    this.height = +params["height"]
    if (isNaN(this.height)) { this.height = 1 }

    if (params["widgets"]) {
      const deserializedWidgets: DashboardWidget[] = params["widgets"].map((w: any) => {
        const widgetData = JSON.parse(w)
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

  onDimensionChange() {
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

  public stringifyParams = ({self} : {self: any}) => {
    return JSON.stringify({
      width: self.width,
      height: self.height,
      widgets: self.widgets.map((v : DashboardWidget) => JSON.stringify(v))
    })
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

  public displayComponent = ({ self, setSelf }: { self: DashboardWidget, setSelf: (newSelf: any) => void }) => {
    const binding = self as unknown as GridDashboard

    const renderedWidgets: JSX.Element[][] = binding.reorganise<JSX.Element>(binding.widgets.map((w, i) => (
      <View style={{ flex: 1 }} key={i}>
        {w.displayComponent({
          self: w, setSelf: (s) => {
            const newWidgets = binding.widgets
            newWidgets[i] = s
            setSelf({ ...binding, widgets: newWidgets })
          }
        })}
      </View>
    )))

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        {renderedWidgets.map((row) => (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {row.map((item) => (item))}
          </View>
        ))}
      </View>
    )
  }

  public editComponent = ({ self, setSelf }: { self: DashboardWidget, setSelf: (newSelf: any) => void }) => {
    const binding = self as unknown as GridDashboard

    const reorganisedWidgets: DashboardWidget[][] = binding.reorganise<DashboardWidget>(binding.widgets)

    //console.warn(binding.widgets)
    return (
      <>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          {reorganisedWidgets.map((row, rowindex) => (
            <View key={rowindex} style={{ flex: 1, flexDirection: 'row' }}>
              {row.map((item, index) => (
                <View key={index} style={{ flex: 1, flexDirection: 'column' }}>
                  <EditDashboardComponent item={item} setItem={(s) => {
                    const newWidgets = binding.widgets
                    newWidgets[rowindex * binding.height + index] = s as DashboardWidget
                    setSelf({ ...binding, widgets: newWidgets })
                  }}>
                  </EditDashboardComponent>
                </View>
              ))}
            </View>
          ))}
        </View>
      </>
    )
  }

  public formComponent = ({ self, setSelf }: { self: DashboardWidget; setSelf: (newState: any) => void }) => {
    const binding = self as unknown as GridDashboard

    const { t } = useTranslation()

    return (
      <>
        <Text variant="labelMedium">{t('Rows')}</Text>
        <View style={{ flexDirection: 'row' }}>
          <SegmentedButtons
            value={binding.width.toString()}
            onValueChange={(value) => {
              setSelf({...binding, width: +value})
            }}
            density="small"
            style={{flex: 1}}
            buttons={[
              {value: "1", label: "1", style:{minWidth: 45}},
              {value: "2", label: "2", style:{minWidth: 45}},
              {value: "3", label: "3", style:{minWidth: 45}},
              {value: "4", label: "4", style:{minWidth: 45}},
              {value: "5", label: "5", style:{minWidth: 45}},
              {value: "6", label: "6", style:{minWidth: 45}},
              {value: "7", label: "7", style:{minWidth: 45}},
              {value: "8", label: "8", style:{minWidth: 45 }}
            ]}
          />
        </View>
        <Text variant="labelMedium">{t('Columns')}</Text>
        <View style={{ flexDirection: 'row' }}>
          <SegmentedButtons
            value={binding.height.toString()}
            onValueChange={(value) => {
              setSelf({...binding, height: +value})
            }}
            density="small"
            style={{flex: 1}}
            buttons={[
              {value: "1", label: "1", style:{minWidth: 45}},
              {value: "2", label: "2", style:{minWidth: 45}},
              {value: "3", label: "3", style:{minWidth: 45}},
              {value: "4", label: "4", style:{minWidth: 45}},
              {value: "5", label: "5", style:{minWidth: 45}},
              {value: "6", label: "6", style:{minWidth: 45}},
              {value: "7", label: "7", style:{minWidth: 45}},
              {value: "8", label: "8", style:{minWidth: 45 }}
            ]}
          />
        </View>
      </>
    )
  }
}

dashboardRegistry.register(type, GridDashboard)