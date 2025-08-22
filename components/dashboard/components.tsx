import React from "react";
import { Dashboard, IDashboardItem } from "./types";

export const DisplayedDashboardComponent = ({item, setItem} : {item : IDashboardItem, setItem : (newState : IDashboardItem) => void}) => {
  return item.displayComponent({self: item, setSelf: setItem})
}

export const EditDashboardComponent = ({item, setItem} : {item : IDashboardItem, setItem : (newState : IDashboardItem) => void}) => {
  return item.editComponent({self: item, setSelf: setItem})
}

export const FormDashboardComponent = ({item, setItem} : {item : Dashboard, setItem : (newState : Dashboard) => void}) => {
  if(item.formComponent == undefined) { return <></> }
  return item.formComponent({self: item, setSelf: setItem})
}