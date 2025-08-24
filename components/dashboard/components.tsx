import React from "react";
import { IDashboardItem } from "./types";

export const DisplayedDashboardComponent = ({item, setItem} : {item : IDashboardItem, setItem : (newState : IDashboardItem) => void}) => {
  return item.displayComponent({self: item, setSelf: setItem})
}

export const EditDashboardComponent = ({item, setItem, onEdit} : {item : IDashboardItem, setItem : (newState : IDashboardItem) => void, onEdit: () => void}) => {
  return item.editComponent({self: item, setSelf: setItem, onEdit: onEdit})
}

export const FormDashboardComponent = ({item, setItem} : {item : IDashboardItem, setItem : (newState : IDashboardItem) => void}) => {
  if(item.formComponent == undefined) { return <></> }
  return item.formComponent({self: item, setSelf: setItem})
}