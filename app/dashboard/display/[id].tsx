//Edit dashboard screen brought up by settings

import { ConnectionDisplay } from "@/components/ui/ConnectionDisplay";
import { selectDashboard } from "@/store/dashboardSlice";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useState } from "react";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function DisplayDashboard() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numID = +id

  const navigation = useNavigation()

  const dashboard = useSelector(selectDashboard(numID))

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

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
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