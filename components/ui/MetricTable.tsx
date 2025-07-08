import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Text, ScrollView } from 'react-native';
import { DataTable } from "react-native-paper";
import { Metric } from "@/components/vehicle/metrics";
import { router } from "expo-router";

//@ts-ignore
export default function MetricTable({ metricKeys, metrics }): React.JSX.Element {
  return (
    <DataTable style={styles.table}>
      <DataTable.Header style={styles.headerRow}>
        <DataTable.Title style={{...styles.metricText, flex:2}}>Name</DataTable.Title>
        <DataTable.Title style={styles.headerText}>Value</DataTable.Title>
      </DataTable.Header>
      {metricKeys.map((metricKey: string, index: string | number) => GenerateMetricEntry(metricKey, (metrics as any)[index]))}
    </DataTable>
  )
}

function GenerateMetricEntry(metricName: string, metric: Metric) {
  return (
    <DataTable.Row key={metricName} style={styles.metricRow} onPress={() => OnMetricEntryPress(metricName)}>
      <DataTable.Cell style={{...styles.metricText, flex:2}}>{metricName}</DataTable.Cell>
      <DataTable.Cell style={styles.metricText}>{metric.value != null ? metric.value + " " +(metric.unit ?? "") : "undefined"}</DataTable.Cell>
    </DataTable.Row>
  )
}

function OnMetricEntryPress(metricName : string) {
  //alert(metricName)
  router.push({pathname: "/(main)/developer/aboutMetric", params: { metricName: metricName }})
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