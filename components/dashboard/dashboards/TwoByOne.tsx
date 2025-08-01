import { dashboardRegistry } from "../registry";
import { DashboardWidget } from "../types";
import DimensionalDashboard from "./DimensionalDashboard";

export const TwoByOneDashboardKey = "2x1"
export class TwoByOneDashboard extends DimensionalDashboard {
  public ID: string = TwoByOneDashboardKey;

  public constructor(name: string, widgets: DashboardWidget[]) {
    super(name, widgets, 2, 1)
  }
}

dashboardRegistry.register(TwoByOneDashboardKey, TwoByOneDashboard)