import React, { useEffect, useState, useLayoutEffect } from "react";
import { ScrollView, View } from 'react-native';
import { metricsAllKeysSelector, metricsSlice, metricsAllValuesSelector } from "@/store/metricsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import MetricTable from "@/components/ui/MetricTable";
import { Menu, Button, IconButton, Portal, Dialog, Text } from "react-native-paper";
import { useNavigation } from "expo-router";
import { messagesSlice } from "@/store/messagesSlice";
import { vehiclesSlice } from "@/store/vehiclesSlice";

//@ts-ignore
export default function DeveloperScreen() {
  const dispatch = useDispatch()
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const openMenu = () => { setVisible(true); }
  const closeMenu = () => { setVisible(false); }

  let keys = useSelector(metricsAllKeysSelector)
  let values = useSelector(metricsAllValuesSelector)

  let keysIndexes = keys.map((k,i) => i)
  keysIndexes.sort((a,b) => (keys[a]).localeCompare(keys[b]))

  keys = keysIndexes.map((i) => keys[i])
  values = keysIndexes.map((i) => values[i])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={<IconButton onPress={openMenu} size={20} icon={'dots-vertical'} />}
          anchorPosition="bottom">
          <Menu.Item leadingIcon="refresh" onPress={() => { dispatch(metricsSlice.actions.resetToStandardMetrics()); closeMenu(); }} title={t("Reset standard metrics")} />
          <Menu.Item leadingIcon="eraser" onPress={() => { dispatch(metricsSlice.actions.clearAll()); closeMenu(); }} title={t("Clear all metrics")} />
          <Menu.Item leadingIcon="delete" onPress={() => { dispatch(metricsSlice.actions.deleteAll()); closeMenu(); }} title={t("Delete all metrics")} />
          <Menu.Item leadingIcon="delete" onPress={() => { dispatch(messagesSlice.actions.wipeMessages()); closeMenu(); }} title={t("Delete all messages")} />
          <Menu.Item leadingIcon="delete" onPress={() => { dispatch(vehiclesSlice.actions.wipeVehicles()); closeMenu(); }} title={t("Delete all vehicles")} />
        </Menu>
    })
  }, [navigation, visible])

  return (
    <ScrollView>
      <MetricTable metrics={values} metricKeys={keys} />
    </ScrollView>
  );
}