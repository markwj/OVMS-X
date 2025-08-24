import React from "react";
import { Button, ButtonProps, IconButton, Props, useTheme } from 'react-native-paper';
import { router } from "expo-router";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { selectDashboard } from "@/store/dashboardSlice";

export type DashboardButtonProps = Omit<ButtonProps, 'children'> & { index: number, onPress?: () => void }

export function DashboardButton(props: DashboardButtonProps): React.JSX.Element | null {
  const theme = useTheme()
  const dashboard = useSelector(selectDashboard(props.index))

  if(!dashboard) { return null }

  return (
    <Button
      icon={props.icon ?? 'view-dashboard'}
      mode='contained-tonal'
      dark={theme.dark}
      onPress={() => {
        router.push({ pathname: "/dashboard/[id]", params: { id: props.index } })
      }}
      style={{ width: '80%', marginBottom: 10 }}
      {...props}
    >
      {dashboard.name}
    </Button>
  )
}

export function DashboardEditButton(props : DashboardButtonProps): React.JSX.Element | null {
  return (
    <DashboardButton
      icon={"pencil"}
      onPress={() => {
        router.push({ pathname: "/settings/dashboard/[id]", params: { id: props.index } })
      }}
      {...props}
    >
    </DashboardButton>
  )
}