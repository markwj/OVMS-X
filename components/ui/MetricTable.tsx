import React, { useState } from "react";
import { View, StyleSheet } from 'react-native';
import { DataTable, IconButton, TextInput } from "react-native-paper";
import { router } from "expo-router";
import { MetricValue } from "@/components/ui/MetricValue"
import { FlatList } from "react-native-gesture-handler";

//@ts-ignore
export default function MetricTable({ metricKeys }): React.JSX.Element {
  const [searchField, setSearchField] = useState("")
  const [searchFilter, setSearchFilter] = useState(searchField)

  if (searchFilter != "") {
    metricKeys = metricKeys.filter((k: string) => k.toUpperCase().includes(searchFilter))
  }

  return (
    <DataTable style={styles.table}>
      <FlatList
        ListHeaderComponent={(
          <>
            <DataTable.Header style={styles.headerRow}>
              <View style={{ ...styles.headerRow, flexDirection: 'row', alignItems: 'center', padding: 5, paddingVertical: 10 }}>
                <TextInput
                  style={{ flex: 1, marginRight: 10, width: 'auto' }}
                  value={searchField}
                  placeholder="Search..."
                  onChangeText={(v) => setSearchField(v)}
                />
                <IconButton size={30} icon={"magnify"} onPress={() => {
                  setSearchFilter(searchField.toUpperCase())
                }} />
                <IconButton size={30} icon={"eraser"} onPress={() => {
                  setSearchFilter("")
                }} />
              </View>
            </DataTable.Header>
            <DataTable.Header style={styles.headerRow}>
              <DataTable.Title style={{ ...styles.metricText, flex: 2 }}>Name</DataTable.Title>
              <DataTable.Title style={styles.headerText}>Value</DataTable.Title>
            </DataTable.Header>
          </>
        )}
        data={metricKeys}
        renderItem={(item) => (
          <DataTable.Row key={item.item} style={styles.metricRow} onPress={() => OnMetricEntryPress(item.item)}>
            <DataTable.Cell style={{ ...styles.metricText, flex: 2 }}>{item.item}</DataTable.Cell>
            <DataTable.Cell style={styles.metricText}>
              <MetricValue metricKey={item.item}></MetricValue>
            </DataTable.Cell>
          </DataTable.Row>
        )}
      />
    </DataTable>
  )
}


function OnMetricEntryPress(metricName: string) {
  //alert(metricName)
  router.push({ pathname: "/(main)/developer/aboutMetric", params: { metricName: metricName } })
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