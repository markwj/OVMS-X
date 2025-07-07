import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { generateGetMetricLastModifiedSelector, generateGetMetricSelector, generateMetricIsDefinedSelector, generateMetricIsStaleSelector, metricsSlice } from "@/store/metricsSlice";
import { DataTable, TextInput } from "react-native-paper";
import { Metric, MetricDefined, MetricType } from "@/components/vehicle/metrics";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { useTranslation } from "react-i18next";

const REFRESH_RATE = 500;

export default function AboutMetricScreen() {
  const { metricName } = useLocalSearchParams<{metricName : string}>();
  const dispatch = useDispatch();

  const metricSelector = useSelector(generateGetMetricSelector(metricName)) as Metric;
  const [metric, updateMetric] = useState(metricSelector);
  const metricIsStaleSelector = useSelector(generateMetricIsStaleSelector(metricName, Date.now() / 1000));
  const [metricStale, changeMetricStale] = useState(false);

  const metricDefinedSelector = useSelector(generateMetricIsDefinedSelector(metricName));
  const [metricDefined, changeMetricDefined] = useState(metricDefinedSelector);
  const metricLastModifiedSelector = useSelector(generateGetMetricLastModifiedSelector(metricName));
  const [metricLastModified, changeMetricLastModified] = useState(new Date(metricLastModifiedSelector).toLocaleTimeString());

  const [temporaryMetricValue, changeTemporaryMetricValue] = useState(metric.value ?? "undefined");

  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      title: metricName
    })
  }, [navigation])

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateMetric(metricSelector);
      changeMetricStale(metricIsStaleSelector);
      changeMetricDefined(metricDefinedSelector);
      if(metricDefined) {changeMetricLastModified(new Date(metricLastModifiedSelector).toLocaleTimeString());}
    }, REFRESH_RATE);

    return () => clearInterval(intervalId);
  }, [metricIsStaleSelector, metricDefinedSelector]);

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
      <DataTable style={styles.table}>
        <DataTable.Row key={"name"} style={styles.metricRow}>
          <DataTable.Cell style={styles.rowHeading}>{"Name: "}</DataTable.Cell>
          <DataTable.Cell style={styles.rowValue}>{metricName}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row key={"type"} style={styles.metricRow}>
          <DataTable.Cell style={styles.rowHeading}>{"Type: "}</DataTable.Cell>
          <DataTable.Cell style={styles.rowValue}>{metric.type}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row key={"value"} style={styles.metricRow}>
          <DataTable.Cell style={styles.rowHeading}>{"Value: "}</DataTable.Cell>
          <DataTable.Cell style={styles.rowValue}>
            <TextInput 
            style = {styles.rowInput} 
            value={temporaryMetricValue} 
            onChangeText={(text) => changeTemporaryMetricValue(text)}
            onEndEditing={() => {changeMetricStale(false); dispatch(metricsSlice.actions.setMetric({key : metricName, value: temporaryMetricValue, currentTime : Date.now()/1000}))}}
            />
          </DataTable.Cell>
        </DataTable.Row>
        {metric.type == MetricType.NUMBER && 
          <DataTable.Row key={"precision"} style={styles.metricRow}>
            <DataTable.Cell style={styles.rowHeading}>{"Precision: "}</DataTable.Cell>
          <DataTable.Cell style={styles.rowValue}>{(metric.precision?.toString() ?? "N/A") + " d.p."}</DataTable.Cell>
          </DataTable.Row>
        }
        <DataTable.Row key={"unit"} style={styles.metricRow}>
          <DataTable.Cell style={styles.rowHeading}>{"Unit: "}</DataTable.Cell>
          <DataTable.Cell style={styles.rowValue}>{metric.unit ?? "N/A"}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row key={"defined"} style={styles.metricRow}>
          <DataTable.Cell style={styles.rowHeading}>{"Defined: "}</DataTable.Cell>
          <DataTable.Cell style={styles.rowValue}>{metricDefined}</DataTable.Cell>
        </DataTable.Row>
        {metric.defined != MetricDefined.NEVER &&
          <DataTable.Row key={"lastModified"} style={styles.metricRow}>
            <DataTable.Cell style={styles.rowHeading}>{"Last Modified: "}</DataTable.Cell>
            <DataTable.Cell style={styles.rowValue}>{metricLastModified}</DataTable.Cell>
          </DataTable.Row>
        }
        <DataTable.Row key={"stale"} style={styles.metricRow}>
          <DataTable.Cell style={styles.rowHeading}>{"Stale? "}</DataTable.Cell>
          <DataTable.Cell style={styles.rowValue}>{metricStale ? "yes" : "no"}</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Row key={"standard"} style={styles.metricRow}>
          <DataTable.Cell style={styles.rowHeading}>{"Standard? "}</DataTable.Cell>
          <DataTable.Cell style={styles.rowValue}>{metric.standard ? "yes" : "no"}</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
    </View>
  );
  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
    </View>
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
  rowInput: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: 'flex-start',
    backgroundColor: "#494949"
  }
});
