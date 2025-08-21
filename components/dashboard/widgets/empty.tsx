import { JSX, useState } from "react";
import { DashboardWidget } from "../types"
import React from "react";
import { View } from "react-native";
import { widgetRegistry } from "../registry";
import { Portal, Text, TouchableRipple } from "react-native-paper";
import { StandardFormModal } from "../standard/StandardFormModal";
import StandardEditWidgetCapsule from "../standard/StandardEditWidgetCapsule";

const ID = "Empty"

export default class EmptyWidget extends DashboardWidget {
  public type: string = ID;
  public displayComponent = ({ self }: { self: DashboardWidget }) => {
    return (<></>)
  }

  public editComponent = ({ self, setSelf }: { self: DashboardWidget; setSelf: (newSelf: DashboardWidget) => void; }) => {
    const [formVisible, setFormVisible] = useState(false)

    return (
      <>
        <StandardEditWidgetCapsule
          label={ID}
          onDelete={() => setSelf(new (widgetRegistry.getEmptyWidget()))}
          onEdit={() => setFormVisible(true) }
        >
          <TouchableRipple style={{ flex: 1 }} onPress={() => setFormVisible(true)}>
            <View style={{ flex: 1, margin: 20, borderColor: 'grey', borderStyle: 'dashed' }} />
          </TouchableRipple>
        </StandardEditWidgetCapsule>

        <Portal>
          <StandardFormModal visible={formVisible} name={ID} onDismiss={() => setFormVisible(false)}>
            <Text>WIP</Text>
          </StandardFormModal>
        </Portal>
      </>
    )
  }
}

widgetRegistry.register(ID, EmptyWidget)