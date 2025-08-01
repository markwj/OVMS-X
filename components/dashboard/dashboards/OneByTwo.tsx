import { dashboardRegistry } from "../registry";
import { DashboardWidget } from "../types";
import DimensionalDashboard from "./DimensionalDashboard";

export const OneByTwoDashboardKey = "1x2"
export class OneByTwoDashboard extends DimensionalDashboard {
  public ID: string = OneByTwoDashboardKey;

  public constructor(name: string, widgets: DashboardWidget[]) {
    super(name, widgets, 1, 2)
  }
}

dashboardRegistry.register(OneByTwoDashboardKey, OneByTwoDashboard)