import { JSX } from "react";
import { DashboardWidget } from "../types";
import { widgetRegistry } from "../registry";
import { View } from "react-native";
import React from "react";
import {Text} from 'react-native-paper'

const ID = 'Empty';

export default class Blank extends DashboardWidget {
  public readonly ID: string = ID;

  public renderDisplay(): JSX.Element {
    return (
      <View style={{ flex: 1 }}>
      </View>
    )
  }
  public renderEdit(): JSX.Element {
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <View style={{ flex: 1, borderColor: 'grey', borderWidth: 2, borderStyle: 'dashed' }}>
        </View>
      </View>
    )
  }
  public renderForm(): JSX.Element {
    return (
      <View>
        <Text>This is the time when I blew up ukraine</Text>
      </View>
    )
  }

  public constructor() {
    super()
  }

}

widgetRegistry.register(ID, Blank)