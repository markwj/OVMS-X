import { DashboardWidget } from "../types"
import React from "react";
import { View } from "react-native";
import { widgetRegistry } from "../registry";
import { TouchableRipple } from "react-native-paper";
import EditWidgetCapsule from "../components/EditWidgetCapsule";

const ID = "Empty"

export default class EmptyWidget extends DashboardWidget {
  public type: string = ID;
  public displayComponent = ({ self }: { self: DashboardWidget }) => {
    return (<></>)
  }

  public editComponent = ({ self, setSelf, onEdit }: { self: DashboardWidget, setSelf: (newSelf: DashboardWidget) => void, onEdit: () => void }) => {

    return (
      <>
        <EditWidgetCapsule
          label={ID}
          onDelete={() => setSelf(new (widgetRegistry.getEmptyWidget()))}
          onEdit={onEdit}
        >
          <TouchableRipple style={{ flex: 1 }} onPress={onEdit}>
            <View style={{ flex: 1, margin: 20, borderColor: 'grey', borderWidth: 2, borderStyle: 'dashed' }} />
          </TouchableRipple>
        </EditWidgetCapsule>
      </>
    )
  }

  public formComponent = undefined;
}

widgetRegistry.register(ID, EmptyWidget)