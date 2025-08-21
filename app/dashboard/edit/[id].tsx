//Edit dashboard screen brought up by settings

import { ConnectionDisplay } from "@/components/ui/ConnectionDisplay";
import { dashboardSlice, selectDashboard } from "@/store/dashboardSlice";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, GestureResponderEvent } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Modal, Portal, Text, useTheme } from 'react-native-paper'
import { DashboardForm } from "@/components/dashboard/components/DashboardForm";
import { Dashboard, IDashboardItem } from "@/components/dashboard/types";
import { DisplayedDashboardComponent, EditDashboardComponent } from "@/components/dashboard/components";

export default function EditDashboard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const index = +id

  if (index == undefined || Number.isNaN(index)) {
    throw new Error(`Could not retrieve dashboard index`)
  }
  const dashboard = useSelector(selectDashboard(index))

  const { t } = useTranslation()
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [dashboardFormVisible, setDashboardFormVisible] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      title: `${t('Edit')} ${dashboard?.name}`,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon={"cog"} onPress={() => setDashboardFormVisible(true)}></IconButton>
          <ConnectionDisplay />
        </View>
      )
    })
  }, [navigation, dashboard])

  if (dashboard == null || dashboard == undefined) {
    return (
      <View>
        <Text>{t('Could not load dashboard')}</Text>
      </View>
    )
  }

  return (
    <>
      <DashboardForm
        visible={dashboardFormVisible}
        setVisible={setDashboardFormVisible}
        dashboard={dashboard}
        deleteDashboard={() => {router.back(); dispatch(dashboardSlice.actions.removeDashboard(index))}}
        submit={(s) => 
          dispatch(dashboardSlice.actions.updateDashboard({ index: index, newValue: s.stringify({self: s}) }))
        }
      />

      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <EditDashboardComponent item={dashboard} setItem ={(s) => {dispatch(dashboardSlice.actions.updateDashboard({ index: index, newValue: (s as Dashboard).stringify({self: s}) }))}} />
          {/* {dashboard.editComponent({
            self: dashboard,
            setSelf: (s : Dashboard) => {dispatch(dashboardSlice.actions.updateDashboard({ index: index, newValue: s.stringify({self: s}) }))}
          })} */}
        </View>
      </View>
    </>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
  }
});