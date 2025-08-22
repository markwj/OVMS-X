import { JSX } from "react";
import { dashboardRegistry } from "../registry";
import { Dashboard, DashboardConfig } from "../types";
import React from "react";

const ID = "Blank"

export default class BlankDashboard extends Dashboard {
  public displayComponent = () => <></>;
  public editComponent = () => <></>;
  public formComponent = undefined;
  public type = ID;

  public constructor(data : DashboardConfig) {
    super(data)
  }
}

dashboardRegistry.register(ID, BlankDashboard)