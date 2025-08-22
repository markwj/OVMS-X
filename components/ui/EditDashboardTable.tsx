import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { DataTable, Text, IconButton, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { NestableScrollContainer, NestableDraggableFlatList, ScaleDecorator } from "react-native-draggable-flatlist"
import { Dashboard } from "../dashboard/types";
import { dashboardSlice, selectDashboards } from "@/store/dashboardSlice";
import { router } from "expo-router";

export default function EditDashboardTable({ setMainScrollEnabled }: { setMainScrollEnabled?: any }) {
  const dashboards = useSelector(selectDashboards).filter((c) => c != undefined)
  const dispatch = useDispatch()
  const theme = useTheme()

  const CommandItem = (params: { index: number, item: Dashboard, drag: () => void }) => {
    const del = () => dispatch(dashboardSlice.actions.removeDashboard(params.index))

    const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
      const styleAnimation = useAnimatedStyle(() => {
        return {
          transform: [{ translateX: drag.value + 50 }],
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'stretch',
          width: 50
        };
      });

      return (
        <Reanimated.View style={styleAnimation}>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'center',
              backgroundColor: theme.colors.errorContainer,
              width: 50
            }
            }>
            <IconButton icon={"delete"} onPress={del} iconColor={'white'}></IconButton>
          </View>
        </Reanimated.View>
      );
    }

    return (
      <ScaleDecorator>
        <Pressable onPress={() => router.push({ pathname: "/settings/dashboard/[id]", params: { id: params.index } })}>
          <ReanimatedSwipeable
            friction={2}
            enableTrackpadTwoFingerGesture
            enableContextMenu={true}
            rightThreshold={40}
            renderRightActions={RightAction}
            key={params.item.name}
            overshootRight={false}
          >
            <DataTable.Row key={params.item.name} style={[styles.valueRow, { backgroundColor: theme.colors.elevation.level4, padding: 0 }]}>
              <DataTable.Cell style={{ ...styles.valueText }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <IconButton icon={"menu"} size={20} style={{ flexShrink: 1, alignItems: 'flex-start', margin: 0 }} onLongPress={params.drag}></IconButton>
                  <Text style={{ flexGrow: 1, alignItems: 'flex-start' }}>
                    {params.item.name}
                  </Text>
                </View>
              </DataTable.Cell>
              <DataTable.Cell style={styles.valueText}>{params.item.type}</DataTable.Cell>
            </DataTable.Row>
          </ReanimatedSwipeable>
        </Pressable>
      </ScaleDecorator>
    )
  };
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <NestableScrollContainer>
        <DataTable style={{ overflow: 'hidden' }}>
          <DataTable.Header style={styles.headerRow} children={undefined}></DataTable.Header>
          <DataTable.Header style={styles.headerRow}>
            <DataTable.Title style={styles.headerText}>{t("Name")}</DataTable.Title>
            <DataTable.Title style={styles.headerText}>{t("Type")}</DataTable.Title>
          </DataTable.Header>
          <NestableDraggableFlatList
            data={dashboards}
            keyExtractor={(d) => d.name}
            renderItem={(params) => <CommandItem index={params.getIndex() ?? 0} item={params.item} drag={params.drag}></CommandItem>}
            onDragBegin={() => setMainScrollEnabled(false)}
            onDragEnd={(data) => {
              setMainScrollEnabled(true);
              setTimeout(() => { //To reduce flickering w/ swaps
                dispatch(dashboardSlice.actions.swapDashboards({ from: data.from, to: data.to }))
              }, 0);
            }}
          >
          </NestableDraggableFlatList>
        </DataTable>
      </NestableScrollContainer>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
    flexDirection: 'column',
  },
  headerRow: {
    flex: 1,
    flexDirection: 'row',
  },
  headerText: {
    flex: 1,
    flexDirection: 'row',
    color: 'white',
  },
  valueRow: {
    flex: 1,
    overflow: 'hidden'
  },
  valueText: {
    flex: 1,
    color: 'white',
    overflow: 'hidden'
  },
});