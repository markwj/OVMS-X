import { dashboardRegistry } from "../registry";
import { DashboardWidget } from "../types";
import DimensionalDashboard from "./DimensionalDashboard";

export const OneByOneDashboardKey = "1x1"
export class OneByOneDashboard extends DimensionalDashboard {
  public ID: string = OneByOneDashboardKey;

  public constructor(name: string, widgets: DashboardWidget[]) {
    super(name, widgets, 1, 1)
  }
}

dashboardRegistry.register(OneByOneDashboardKey, OneByOneDashboard)