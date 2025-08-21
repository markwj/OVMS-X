import { IDashboardItem } from "./types";

export const DisplayedDashboardItem = ({item, setItem} : {item : IDashboardItem, setItem : (newState : IDashboardItem) => void}) => {
  return item.displayComponent({self: item, setSelf: setItem})
}

export const EditDashboardItem = ({item, setItem} : {item : IDashboardItem, setItem : (newState : IDashboardItem) => void}) => {
  return item.editComponent({self: item, setSelf: setItem})
}