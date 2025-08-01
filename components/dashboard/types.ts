import { JSX } from "react";


export type WidgetConstructor = new () => DashboardWidget
export abstract class DashboardWidget {
  /**
   * Key used to subscribe the registry
   */
  public readonly abstract ID : string

  public serialize() : string {
    return JSON.stringify({...this, ID: this.ID})
  }

  public setParameter(name : string, param : any) : void {
    //@ts-ignore
    this[name] = param
  }

  public abstract renderDisplay() : JSX.Element
  public abstract renderEdit() : JSX.Element
  public abstract renderForm(dismissModal : () => void) : JSX.Element
}


export type DashboardConstructor = new (name : string, widgets: DashboardWidget[]) => Dashboard

export abstract class Dashboard extends DashboardWidget {
  public name : string

  public serialize(): string {
    return JSON.stringify({...this, ID: this.ID, widgets: this.widgets.map((m) => {
      if(typeof m == 'string') {
        console.warn(`[Dashboard] Widget ${m} should not be stored as a string`)
        return m
      }
      return m.serialize()
    })})
  }

  protected widgets : DashboardWidget[] = []
  public addWidget(widget: DashboardWidget, index? : number) : void {
    if(index) {
      this.widgets.splice(index, 0, widget)
      return;
    }
    this.widgets.push(widget)
  }
  public getWidgets() {
    return this.widgets
  }

  constructor(name : string, widgets: DashboardWidget[] = []) {
    super()
    this.name = name
    this.widgets = widgets
  }
}

export abstract class ArrangeDashboard extends Dashboard {
  public renderDisplay() : JSX.Element {
    const renderedWidgets = this.widgets.map((w) => w.renderDisplay())
    return this.arrangeDisplay(renderedWidgets)
  }
  public renderEdit() : JSX.Element {
    const renderedWidgets = this.widgets.map((w) => w.renderEdit())
    return this.arrangeDisplay(renderedWidgets)
  }

  public abstract arrangeDisplay(renderedWidgets : JSX.Element[]) : JSX.Element
  public abstract arrangeEdit(renderedWidgets : JSX.Element[]) : JSX.Element
}