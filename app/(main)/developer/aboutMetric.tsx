import React, { useEffect, useState } from "react";
import { StyleSheet, KeyboardAvoidingView, View, TextInput } from 'react-native';
import { Button, Text, Switch, DataTable, Icon } from "react-native-paper";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { generateGetMetricSelector, generateMetricIsStaleSelector, metricsSlice } from "@/store/metricsSlice";
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { Metric, MetricDefined, MetricType } from "@/components/vehicle/metrics";
import { useTranslation } from "react-i18next";
import { GetCurrentUTCTimeStamp } from "@/components/utils/datetime";

export default function AboutMetricScreen() {
  const { metricName } = useLocalSearchParams<{ metricName: string }>();
  const dispatch = useDispatch();

  const metric = useSelector(generateGetMetricSelector(metricName)) as Metric;
  const metricIsStale = useSelector(generateMetricIsStaleSelector(metricName, GetCurrentUTCTimeStamp()));

  const navigation = useNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      title: metricName,
    })
  }, [navigation])

  const { control, handleSubmit } = useForm<Metric>({ defaultValues: metric })
  const onSubmit: SubmitHandler<Metric> = (data) => {
    dispatch(metricsSlice.actions.setMetric({ key: metricName, value: data.value ?? "", currentTime: GetCurrentUTCTimeStamp() }))
  }

  return (
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
            <Controller
              control={control}
              name="value"
              render={({ field: { onChange, value = metric.value } }) => (
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                  <TextInput
                    value={value ?? ""}
                    onChangeText={onChange}
                    style={styles.rowEntry}
                    placeholder="undefined"
                  />
                  {metric.unit != null && <Text>{metric.unit}</Text>}
                </View>
              )}
            />
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
          <DataTable.Cell style={styles.rowValue}>{metric.defined}</DataTable.Cell>
        </DataTable.Row>

        {metric.defined != MetricDefined.NEVER &&
          <DataTable.Row key={"lastModified"} style={styles.metricRow}>
            <DataTable.Cell style={styles.rowHeading}>{t("Last Modified") + ": "}</DataTable.Cell>
            <DataTable.Cell style={styles.rowValue}>{metric.lastModified != null ? new Date(metric.lastModified).toUTCString() : "N/A"}</DataTable.Cell>
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
          <DataTable.Cell style={styles.rowHeading}>{t("Standard?")+" "}</DataTable.Cell>
          <DataTable.Cell style={styles.rowValue}>{metric.standard ? "yes" : "no"}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row key = {"submit"} style={{...styles.metricRow, alignItems: 'center'}}>
          <Button onPress={handleSubmit(onSubmit)}>{t("Apply Changes")}</Button>
        </DataTable.Row>

      </DataTable>
    </KeyboardAvoidingView>
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
  rowEntry: {flex: 10, color: 'white', textDecorationLine: "underline"}
});

