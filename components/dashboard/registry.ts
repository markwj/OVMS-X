import { Dashboard, DashboardConfig, DashboardConstructor, DashboardWidget, WidgetConstructor } from "./types";

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

  getEmptyWidget() : WidgetConstructor {
    const emptyWidget = this.get(EMPTY_WIDGET_ID)
    if(emptyWidget == undefined) {
      throw new Error("widgetRegistry could not find the empty widget")
    }
    return emptyWidget
  }

  rebuildWithNewID(base : DashboardWidget, newID : string) : DashboardWidget {
    const constructor = this.constructors.get(newID)
    if(constructor == undefined) {
      return base
    }

    const newWidget = new constructor()
    for(const k in Object.keys(base)) {
      //@ts-ignore
      if(Object.keys(newWidget).includes(k) && !(typeof base[k] == 'function')) {
        //@ts-ignore
        newWidget.setParameter(k, base[k])
      }
    }

    return newWidget
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

  public generateDashboard(config : DashboardConfig) : Dashboard | undefined {
    const constructor = this.get(config.type)
    if(!constructor) { return undefined }
    return new constructor(config)
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

    if(content == undefined) {
      return undefined
    }

    const dashboardData : DashboardConfig = JSON.parse(content) as DashboardConfig
    //console.warn(`Dashboard data: ${dashboardData} (type ${typeof dashboardData})`)
    const dashboardConstructor = this.get(dashboardData.type)
    if (dashboardConstructor == undefined) { return undefined }

    return new dashboardConstructor(dashboardData)
  }
}

export const dashboardRegistry = new DashboardRegistry()