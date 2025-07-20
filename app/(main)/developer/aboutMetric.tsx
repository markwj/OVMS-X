import React, { useEffect, useState } from "react";
import { StyleSheet, KeyboardAvoidingView, View, TextInput, RefreshControl } from 'react-native';
import { Text, DataTable } from "react-native-paper";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { selectMetric, selectMetricIsStale, metricsSlice, selectLocalisedMetricValue, selectMetricLastModified, selectMetricIsDefined } from "@/store/metricsSlice";
import { Metric, MetricDefined, MetricType } from "@/components/vehicle/metrics";
import { useTranslation } from "react-i18next";
import { GetCurrentUTCTimeStamp } from "@/components/utils/datetime";
import { store } from "@/store/root";
import { ScrollView } from "react-native-gesture-handler";

export default function AboutMetricScreen() {
  const { metricName } = useLocalSearchParams<{ metricName: string }>();
  const dispatch = useDispatch();

  const metric = useSelector(selectMetric(metricName)) as Metric;
  const metricIsStale = useSelector(selectMetricIsStale(metricName, GetCurrentUTCTimeStamp()));
  const metricLastModified = useSelector(selectMetricLastModified(metricName))
  const metricDefined = useSelector(selectMetricIsDefined(metricName))

  const { value: metricValue, unit: metricUnit } = store.dispatch(selectLocalisedMetricValue(metricName))

  const [tempValue, setTempValue] = useState(metricValue ?? "")

  const navigation = useNavigation();
  const { t } = useTranslation();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    const updatedValue = store.dispatch(selectLocalisedMetricValue(metricName)).value
    setTempValue(updatedValue)
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: metricName,
    })
  }, [navigation])

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <KeyboardAvoidingView style={styles.container}>
        <DataTable style={styles.table}>
          <DataTable.Row key={"name"} style={styles.metricRow}>
            <DataTable.Cell style={styles.rowHeading}>{t("Name") + ": "}</DataTable.Cell>
            <DataTable.Cell style={styles.rowValue}>{metricName}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row key={"type"} style={styles.metricRow}>
            <DataTable.Cell style={styles.rowHeading}>{t("Type") + ": "}</DataTable.Cell>
            <DataTable.Cell style={styles.rowValue}>{metric.type}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row key={"value"} style={styles.metricRow}>
            <DataTable.Cell style={styles.rowHeading}>{t("Value") + ": "}</DataTable.Cell>
            <DataTable.Cell style={styles.rowValue}>
              <View style={{ flexDirection: "row", alignItems: 'center' }}>
                <TextInput
                  value={tempValue.toString()}
                  onChangeText={setTempValue}
                  onSubmitEditing={(value) => dispatch(metricsSlice.actions.setMetric({ key: metricName, value: value.nativeEvent.text, currentTime: GetCurrentUTCTimeStamp() }))}
                  style={styles.rowEntry}
                  placeholder="undefined"
                />
                {metricUnit != null && <Text>{metricUnit}</Text>}
              </View>
            </DataTable.Cell>
          </DataTable.Row>

          {metric.type == MetricType.NUMBER &&
            <DataTable.Row key={"precision"} style={styles.metricRow}>
              <DataTable.Cell style={styles.rowHeading}>{t("Precision") + ": "}</DataTable.Cell>
              <DataTable.Cell style={styles.rowValue}>{(metric.precision ?? "undefined") + " d.p."}</DataTable.Cell>
            </DataTable.Row>
          }

          <DataTable.Row key={"defined"} style={styles.metricRow}>
            <DataTable.Cell style={styles.rowHeading}>{t("Defined") + ": "}</DataTable.Cell>
            <DataTable.Cell style={styles.rowValue}>{metricDefined}</DataTable.Cell>
          </DataTable.Row>

          {metric.defined != MetricDefined.NEVER &&
            <DataTable.Row key={"lastModified"} style={styles.metricRow}>
              <DataTable.Cell style={styles.rowHeading}>{t("Last Modified") + ": "}</DataTable.Cell>
              <DataTable.Cell style={styles.rowValue}>{metricLastModified != null ? new Date(metricLastModified).toUTCString() : "N/A"}</DataTable.Cell>
            </DataTable.Row>
          }

          <DataTable.Row key={"stale"} style={styles.metricRow}>
            <DataTable.Cell style={styles.rowHeading}>{t("Stale?") + " "}</DataTable.Cell>
            <DataTable.Cell style={styles.rowValue}>{metricIsStale ? "yes" : "no"}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row key={"staleSeconds"} style={styles.metricRow}>
            <DataTable.Cell style={styles.rowHeading}>{t("Time to stale") + ": "}</DataTable.Cell>
            <DataTable.Cell style={styles.rowValue}>{(metric.staleSeconds ?? "undefined ") + "s"}</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row key={"standard"} style={styles.metricRow}>
            <DataTable.Cell style={styles.rowHeading}>{t("Standard?") + " "}</DataTable.Cell>
            <DataTable.Cell style={styles.rowValue}>{metric.standard ? "yes" : "no"}</DataTable.Cell>
          </DataTable.Row>

        </DataTable>
      </KeyboardAvoidingView>
    </ ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    paddingTop: 0,
    paddingBottom: 50
  },
  metricRow: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  rowHeading: {
    flex: 1,
    fontWeight: 'bold',
    color: 'white',
  },
  rowValue: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignContent: 'center',
    color: 'white',
  },
  rowEntry: { flex: 10, color: 'white', textDecorationLine: "underline" }
});

