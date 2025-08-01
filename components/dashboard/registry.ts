import { Dashboard, DashboardConstructor, DashboardWidget, WidgetConstructor } from "./types";

export const EMPTY_WIDGET_ID = "Empty"

export class WidgetRegistry {
  private constructors: Map<string, WidgetConstructor> = new Map()
  private initialized = false

  private initialize() {
    if (this.initialized) return;

    if (__DEV__) {
      console.log("[widgetRegistry] Initializing registry...");
    }

    try {
      // Import all widgets
      require("./widgets/index")

      this.initialized = true;
      if (__DEV__) {
        console.log("[widgetRegistry] Registry initialized successfully");
        console.log("[widgetRegistry] Available widgets:", this.getRegisteredWidgets());
      }
    } catch (error) {
      console.error("[widgetRegistry] Error initializing registry:", error);
    }
  }

  public getRegisteredWidgets(): string[] {
    this.initialize();
    const dashboards = Array.from(this.constructors.keys());
    if (__DEV__) {
      console.log("[widgetRegistry] All registered widgets:", dashboards);
    }
    return dashboards;
  }

  register(name: string, constructor: WidgetConstructor): void {
    if (__DEV__) {
      console.log("[widgetRegistry] Registering widget:", name, "Constructor:", constructor.name);
    }
    this.constructors.set(name, constructor);
  }

  get(name: string): WidgetConstructor | undefined {
    this.initialize();
    const constructor = this.constructors.get(name);
    if (__DEV__) {
      console.log("[widgetRegistry] Getting widget", name, "Found:", !!constructor);
    }
    return constructor;
  }

  getEmptyWidget() : WidgetConstructor | undefined {
    return this.get(EMPTY_WIDGET_ID)
  }

  has(name: string): boolean {
    this.initialize();
    const hasPlatform = this.constructors.has(name);
    if (__DEV__) {
      console.log("[widgetRegistry] Checking widget:", name, "Has:", hasPlatform);
    }
    return hasPlatform; 
  }

  getWidgetInfo(): { name: string; constructor: string }[] {
    this.initialize();
    return Array.from(this.constructors.entries()).map(([name, constructor]) => ({
      name,
      constructor: constructor.name
    }));
  }

  public getWidgetOptions() : string[] {
    this.initialize();
    return Array.from(this.constructors.keys())
  }
}

export const widgetRegistry = new WidgetRegistry()




export class DashboardRegistry {
  private constructors: Map<string, DashboardConstructor> = new Map()
  private initialized = false

  private initialize() {
    if (this.initialized) return;

    if (__DEV__) {
      console.log("[dashboardRegistry] Initializing registry...");
    }

    try {
      // Import all dashboards
      require("./dashboards/index")

      this.initialized = true;
      if (__DEV__) {
        console.log("[dashboardRegistry] Registry initialized successfully");
        console.log("[dashboardRegistry] Available dashboards:", this.getRegisteredDashboards());
      }
    } catch (error) {
      console.error("[dashboardRegistry] Error initializing registry:", error);
    }
  }

  public getRegisteredDashboards(): string[] {
    this.initialize();
    const dashboards = Array.from(this.constructors.keys());
    if (__DEV__) {
      console.log("[dashboardRegistry] All registered dashboards:", dashboards);
    }
    return dashboards;
  }

  public register(name: string, constructor: DashboardConstructor): void {
    if (__DEV__) {
      console.log("[dashboardRegistry] Registering dashboard:", name, "Constructor:", constructor.name);
    }
    this.constructors.set(name, constructor);
  }

  public get(name: string): DashboardConstructor | undefined {
    this.initialize();
    const constructor = this.constructors.get(name);
    if (__DEV__) {
      console.log("[dashboardRegistry] Getting dashboard", name, "Found:", !!constructor);
    }
    return constructor;
  }

  public has(name: string): boolean {
    this.initialize();
    const hasPlatform = this.constructors.has(name);
    if (__DEV__) {
      console.log("[dashboardRegistry] Checking dashboard:", name, "Has:", hasPlatform);
    }
    return hasPlatform;
  }

  public getDashboardInfo(): { name: string; constructor: string }[] {
    this.initialize();
    return Array.from(this.constructors.entries()).map(([name, constructor]) => ({
      name,
      constructor: constructor.name
    }));
  }

  public getDashboardOptions() : string[] {
    this.initialize();
    return Array.from(this.constructors.keys())
  }

  public parse(content: string): Dashboard | undefined {
    this.initialize()

    const dashboardData = JSON.parse(content)
    const dashboardConstructor = this.get(dashboardData.ID)
    if (dashboardConstructor == undefined) { return undefined }
    
    const deserializedWidgets : DashboardWidget[] = dashboardData.widgets.map((w: any) => {
      const widgetData = JSON.parse(w)
      const widgetConstructor = widgetRegistry.get(widgetData.ID)
      if (widgetConstructor == undefined) { return null }

      const widget = new widgetConstructor()
      for (const k of Object.keys(widgetData)) {
        if (k == "ID") { continue }
        widget.setParameter(k, widgetData[k])
      }
      return widget
    })

    const dashboard = new dashboardConstructor(dashboardData.name, deserializedWidgets)
    for (const k of Object.keys(dashboardData)) {
      if (["ID", "widgets"].includes(k)) { continue }
      dashboard.setParameter(k, dashboardData[k])
    }

    return dashboard
  }
}

export const dashboardRegistry = new DashboardRegistry()