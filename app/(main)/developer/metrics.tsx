import React, { useEffect, useState, useLayoutEffect } from "react";
import { ScrollView, View } from 'react-native';
import { metricsAllKeysSelector, metricsSlice, metricsAllValuesSelector } from "@/store/metricsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import MetricTable from "@/components/ui/MetricTable";
import { Menu, Button, IconButton, Portal, Dialog, Text } from "react-native-paper";
import { useNavigation } from "expo-router";

//@ts-ignore
export default function DeveloperScreen() {
  const dispatch = useDispatch()
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const openMenu = () => { console.log('openMenu'); setVisible(true); }
  const closeMenu = () => { console.log('closeMenu'); setVisible(false); }
  console.log('visible', visible)

  let keys = useSelector(metricsAllKeysSelector)
  let values = useSelector(metricsAllValuesSelector)

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
        </Menu>
    })
  }, [navigation, visible])

  return (
    <ScrollView>
      <MetricTable metrics={values} metricKeys={keys} />
    </ScrollView>
  );
}