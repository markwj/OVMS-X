//Edit dashboard screen brought up by settings

import { DisplayedDashboardComponent } from "@/components/dashboard/components";
import { Dashboard, IDashboardItem } from "@/components/dashboard/types";
import { ConnectionDisplay } from "@/components/ui/ConnectionDisplay";
import { dashboardSlice, selectDashboard } from "@/store/dashboardSlice";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export default function DisplayDashboard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numID = +id

  const navigation = useNavigation()

  const dashboard = useSelector(selectDashboard(numID))
  const {t} = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    navigation.setOptions({
      title: `${dashboard?.name}`,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ConnectionDisplay />
        </View>
      )
    })
  }, [navigation])

  if (dashboard == null || dashboard == undefined) {
    return (
      <View>
        <Text>{t('Could not load dashboard')}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <DisplayedDashboardComponent item={dashboard} setItem={(s) => {dispatch(dashboardSlice.actions.updateDashboard({ index: numID, newValue: (s as Dashboard).stringify({self: s}) }))}} />
        {/* {dashboard.displayComponent({
          self: dashboard,
          setSelf: (s) => {dispatch(dashboardSlice.actions.updateDashboard({ index: numID, newValue: JSON.stringify(s) }))}
        })} */}
      </View>
    </View >
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