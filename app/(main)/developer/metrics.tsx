import React, { useEffect, useState } from "react";
import { ScrollView } from 'react-native';
import { metricsAllKeysSelector, metricsSlice, metricsAllValuesSelector } from "@/store/metricsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import MetricTable from "@/components/ui/MetricTable";
import { Menu, Button, Icon, Portal, Dialog, Text } from "react-native-paper";
import { useNavigation } from "expo-router";

//@ts-ignore
export default function DeveloperScreen() {
  const dispatch = useDispatch()
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);

  const closeMenu = () => setVisible(false);

  let keys = useSelector(metricsAllKeysSelector)
  let values = useSelector(metricsAllValuesSelector)

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button onPress={() => setVisible(true)} children={<Icon size={20} source={"cog"} />} />
    })
  }, [navigation])

  return (
    <ScrollView>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={<MetricTable metrics={values} metricKeys={keys} />}
      >
        <Menu.Item leadingIcon="refresh" onPress={() => {dispatch(metricsSlice.actions.resetToStandardMetrics()); closeMenu();}} title={t("Reset to standard metrics")} />
        <Menu.Item leadingIcon="eraser" onPress={() => {dispatch(metricsSlice.actions.clearAll()); closeMenu(); }} title={t("Clear all metrics")} />
        <Menu.Item leadingIcon="delete" onPress={() => {dispatch(metricsSlice.actions.deleteAll()); closeMenu(); }} title={t("Delete all metrics")} />
      </Menu>
    </ScrollView>
  );
}