import { JSX, useState } from "react";
import { ArrangeDashboard, Dashboard, DashboardWidget } from "../types"
import { View } from "react-native";
import React from "react";
import StandardEditWidgetCapsule from "../standard/StandardEditWidgetCapsule";
import { Portal } from "react-native-paper";
import { StandardFormModal } from "../standard/StandardFormModal";
import { widgetRegistry } from "../registry";

export default abstract class DimensionalDashboard extends Dashboard {
  protected width: number
  protected height: number

  public constructor(name: string, widgets: DashboardWidget[], width: number, height: number) {
    super(name, widgets)
    this.width = width;
    this.height = height;

    if (this.widgets.length > (width * height)) {
      this.widgets.length = (width * height)
    }

    if (this.widgets.length < (width * height)) {
      const constructor = widgetRegistry.getEmptyWidget()!
      while (this.widgets.length < (width * height)) {
        this.widgets.push(new constructor)
      }
    }
  }

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

  public renderDisplay(): JSX.Element {
    const renderedWidgets: JSX.Element[][] = this.reorganise<JSX.Element>(this.widgets.map((w, i) => (
      <View style={{ flex: 1 }} key={i}>
        {w.renderDisplay()}
      </View>
    )))

    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        {renderedWidgets.map((row) => (
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {row.map((item) => (
              <View style={{ flex: 1 }}>
                {item}
              </View>
            ))}
          </View>
        ))}
      </View>
    )
  }

  public renderEdit(): JSX.Element {
    const reorganisedWidgets: DashboardWidget[][] = this.reorganise<DashboardWidget>(this.widgets)
    const [widgetInEditing, setWidgetInEditing] = useState<DashboardWidget | null>(null)

    return (
      <>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          {reorganisedWidgets.map((row, rowindex) => (
            <View key={rowindex} style={{ flex: 1, flexDirection: 'row' }}>
              {row.map((item, index) => (
                <View key={index} style={{flex : 1, flexDirection: 'column'}}>
                  <StandardEditWidgetCapsule
                    key={index}
                    widget={item}
                    onEdit={() => { setWidgetInEditing(item); }}
                    onDelete={() => {
                      const c = widgetRegistry.getEmptyWidget()!
                      this.widgets[index] = new c
                    }}
                  >
                  </StandardEditWidgetCapsule>
                </View>
              ))}
            </View>
          ))}
        </View>
        <Portal>
          <StandardFormModal
            widget={widgetInEditing}
            visible={widgetInEditing != null}
            dismiss={() => { setWidgetInEditing(null) }}
          >
          </StandardFormModal>
        </Portal>
      </>
    )
  }

  public renderForm(): JSX.Element {
    return <></>
  }
}