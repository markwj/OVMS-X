import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Text, ScrollView } from 'react-native';
import { DataTable } from "react-native-paper";
import { metricsAllKeysSelector, metricsSlice, metricsAllValuesSelector, getMetricsListSelector } from "@/store/metricsSlice";
import { Metric } from "@/components/vehicle/metrics";
import { useDispatch, useSelector } from "react-redux";

export default function DeveloperScreen() {
  const dispatch = useDispatch()

  let keys = useSelector(metricsAllKeysSelector)
  let values = useSelector(metricsAllValuesSelector)

  return (
    <ScrollView>
      <Button title="generate standard metrics" onPress={() => dispatch(metricsSlice.actions.resetToStandardMetrics())}></Button>
      <DataTable style={styles.table}>
        <DataTable.Header style={styles.headerRow}>
          <DataTable.Title style={{...styles.metricText, flex:2}}>Name</DataTable.Title>
          <DataTable.Title style={styles.headerText}>Value</DataTable.Title>
        </DataTable.Header>
        {keys.map((key, index) => GenerateMetricEntry(key, (values as any)[index]))}
      </DataTable>
    </ScrollView>
  );
}

function GenerateMetricEntry(metricName: string, metric: Metric) {
  return (
    <DataTable.Row key={metricName} style={styles.metricRow} onPress={() => OnMetricEntryPress(metricName, metric)}>
      <DataTable.Cell style={{...styles.metricText, flex:2}}>{metricName}</DataTable.Cell>
      <DataTable.Cell style={styles.metricText}>{metric.value != null ? metric.value + " " +(metric.unit ?? "") : "undefined"}</DataTable.Cell>
    </DataTable.Row>
  )
}

function OnMetricEntryPress(metricName : string, metric : Metric) {
  alert(metricName)
}

const styles = StyleSheet.create({
  table: {
    paddingBottom: 50
  },
  headerRow: {
    flex: 1,
  },
  headerText: {
    flex: 1,
    color: 'white',
  },
  metricRow: {
    flex: 1,
  },
  metricText: {
    flex: 1,
    color: 'white',
  },
});
