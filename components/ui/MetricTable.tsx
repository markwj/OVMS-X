import React, { useState } from "react";
import { View, StyleSheet } from 'react-native';
import { DataTable, Searchbar, TextInput, useTheme } from "react-native-paper";
import { router } from "expo-router";
import { MetricVal } from "@/components/ui/MetricValue"
import { FlatList } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectMetricRecord } from "@/store/metricsSlice";

//@ts-ignore
export default function MetricTable({ metricKeys }): React.JSX.Element {
  const [searchFilter, setSearchFilter] = useState("")

  const theme = useTheme()

  const { t } = useTranslation()

  // Get all metric records for the provided keys
  const getMetricRecord = (key: string) => {
    return useSelector(selectMetricRecord(key))
  }

  if (searchFilter != "") {
    metricKeys = metricKeys.filter((k: string) => k.toUpperCase().includes(searchFilter.toUpperCase()))
  }

  return (
    <DataTable style={styles.table}>
      <FlatList
        bounces={false}
        ListHeaderComponent={(
          <View style={{ backgroundColor: theme.colors.background }}>
            <DataTable.Header style={styles.headerRow}>
              <View style={{ ...styles.headerRow, flexDirection: 'row', alignItems: 'center', padding: 5, paddingVertical: 10 }}>
                <Searchbar
                  style={{ flex: 1, width: 'auto' }}
                  value={searchFilter}
                  autoCapitalize="none"
                  placeholder={t("Search") + "..."}
                  onChangeText={(v) => setSearchFilter(v)}
                  autoCorrect={false}
                  clearIcon={"filter-remove-outline"}
                />
              </View>
            </DataTable.Header>
            <DataTable.Header style={styles.headerRow}>
              <DataTable.Title style={{ ...styles.metricText, flex: 2 }}>Name</DataTable.Title>
              <DataTable.Title style={styles.headerText}>Value</DataTable.Title>
            </DataTable.Header>
          </View>
        )}
        stickyHeaderIndices={[0]}
        data={metricKeys}
        renderItem={(item) => (
          <DataTable.Row key={item.item} style={styles.metricRow} onPress={() => OnMetricEntryPress(item.item)}>
            <DataTable.Cell style={{ ...styles.metricText, flex: 2 }}>{item.item}</DataTable.Cell>
            <DataTable.Cell style={styles.metricText}>
              <MetricVal metricRecord={getMetricRecord(item.item)}></MetricVal>
            </DataTable.Cell>
          </DataTable.Row>
        )}
      />
    </DataTable>
  )
}


function OnMetricEntryPress(metricName: string) {
  //alert(metricName)
  router.push({ pathname: "/developer/aboutMetric", params: { metricName: metricName } })
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