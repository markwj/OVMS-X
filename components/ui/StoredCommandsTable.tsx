import { getCommands, StoredCommand, storedCommandsSlice } from "@/store/storedCommandsSlice";
import React, { useRef, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { DataTable, IconButton, useTheme } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { NestableScrollContainer, NestableDraggableFlatList, ScaleDecorator } from "react-native-draggable-flatlist"

export default function StoredCommandsTable({ setMainScrollEnabled, openEditMenu }: { setMainScrollEnabled?: any, openEditMenu?: (index: number, command: StoredCommand) => void }) {
  const storedCommands = useSelector(getCommands)
  const dispatch = useDispatch()
  const theme = useTheme()

  const CommandItem = (params: { index: number, item: StoredCommand, drag: () => void }) => {
    const del = () => dispatch(storedCommandsSlice.actions.removeCommand(params.index))

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
        <Pressable
          onPress={() => { openEditMenu != undefined && openEditMenu(params.index, params.item) }}
          onLongPress={params.drag}
        >
          <ReanimatedSwipeable
            friction={2}
            enableTrackpadTwoFingerGesture
            enableContextMenu={true}
            rightThreshold={40}
            renderRightActions={RightAction}
            key={params.item.key}
            overshootRight={false}
          >
            <DataTable.Row key={params.item.key} style={styles.valueRow}>
              <DataTable.Cell style={styles.valueText}>{params.item.name}</DataTable.Cell>
              <DataTable.Cell style={styles.valueText}>{params.item.command}</DataTable.Cell>
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
            <DataTable.Title style={styles.headerText}>{t("Command")}</DataTable.Title>
          </DataTable.Header>
          <NestableDraggableFlatList
            data={storedCommands}
            keyExtractor={(c) => c.key.toString()}
            renderItem={(params) => <CommandItem {...params} index={params.getIndex() ?? 0}></CommandItem>}
            onDragBegin={() => setMainScrollEnabled(false)}
            onDragEnd={(data) => {
              setMainScrollEnabled(true); 
              setTimeout(() => { //To reduce flickering w/ swaps
                dispatch(storedCommandsSlice.actions.moveCommand({from: data.from, to : data.to}))
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
    padding: 20
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