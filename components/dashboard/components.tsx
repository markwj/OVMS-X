import React from "react";
import { IDashboardItem } from "./types";

export const DisplayedDashboardComponent = ({item, setItem} : {item : IDashboardItem, setItem : (newState : IDashboardItem) => void}) => {
  const C = item.displayComponent
  return <C self={item} setSelf={setItem}/>
}

export const EditDashboardComponent = ({item, setItem, onEdit} : {item : IDashboardItem, setItem : (newState : IDashboardItem) => void, onEdit: () => void}) => {
  const C = item.editComponent
  return <C self={item} setSelf={setItem} onEdit={onEdit}/>
}

export const FormDashboardComponent = ({item, setItem} : {item : IDashboardItem, setItem : (newState : IDashboardItem) => void}) => {
  if(item.formComponent == undefined) { return <></> }
  const C = item.formComponent
  return <C self={item} setSelf={setItem}/>
}