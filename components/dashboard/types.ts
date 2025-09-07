import { JSX } from "react";

export interface IDashboardItem {
  displayComponent: ({ self, setSelf }: { self: any, setSelf: (newSelf: any) => void }) => JSX.Element
  editComponent: ({ self, setSelf, onEdit }: { self: any, setSelf: (newSelf: any) => void, onEdit : () => void }) => JSX.Element
  formComponent: (({ self, setSelf }: { self: any, setSelf: (newSelf: any) => void }) => JSX.Element) | undefined
}

export type WidgetConstructor = new () => DashboardWidget
export abstract class DashboardWidget implements IDashboardItem {
  /**
   * Key used to subscribe the registry
   */
  public readonly abstract type: string

  public setParameter(name: string, param: any): void {
    //@ts-ignore
    this[name] = param
  }

  public abstract displayComponent: ({ self, setSelf }: { self: any, setSelf: (newSelf: any) => void }) => JSX.Element
  public abstract editComponent: ({ self, setSelf, onEdit }: { self: any, setSelf: (newSelf: any) => void, onEdit : () => void }) => JSX.Element
  public abstract formComponent: (({ self, setSelf }: { self: any; setSelf: (newSelf: any) => void; }) => JSX.Element) | undefined;
}


export type DashboardConfig = {
  name: string,
  type: string,
  params: any
}
export type DashboardConstructor = new (config: DashboardConfig) => Dashboard

export abstract class Dashboard implements IDashboardItem {

  public readonly abstract type: string

  public name: string

  constructor(config: DashboardConfig) {
    this.name = config.name;
  }

  public stringify : ({ self }: { self: any }) => string = ({ self }: { self: any }) => {
    return JSON.stringify({
      name: self.name, 
      type: self.type,
      params: self.stringifyParams({self: self})
    })
  }

  public stringifyParams : ({ self }: { self: any }) => any = ({ self }: { self: any }) => {}

  public abstract displayComponent: ({ self, setSelf }: { self: any, setSelf: (newSelf: any) => void }) => JSX.Element
  public abstract editComponent: ({ self, setSelf, onEdit }: { self: any, setSelf: (newSelf: any) => void, onEdit : () => void }) => JSX.Element
  public abstract formComponent: (({ self, setSelf }: { self: any, setSelf: (newSelf: any) => void }) => JSX.Element) | undefined
}