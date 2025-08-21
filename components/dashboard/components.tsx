import { IDashboardItem } from "./types";

export const DisplayedDashboardComponent = ({item, setItem} : {item : IDashboardItem, setItem : (newState : IDashboardItem) => void}) => {
  return item.displayComponent({self: item, setSelf: setItem})
}

export const EditDashboardComponent = ({item, setItem} : {item : IDashboardItem, setItem : (newState : IDashboardItem) => void}) => {
  return item.editComponent({self: item, setSelf: setItem})
}