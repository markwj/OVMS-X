import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet
} from "react-native";
import { router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Text, Divider, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function NewVehicle() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <ScrollView style={{ height: '100%' }}>
        <View style={{ height: 10 }} />
        <Button
          mode='contained-tonal'
          dark={true}
          onPress={() => { router.replace('/(main)/newvehicle/ovmsv2'); }}
          style={{ flex: 1, width: '100%', height: 200 }}
          contentStyle={{ width: '100%', height: '100%' }}>
          <Text>{t('OVMS v2 API')}</Text>
        </Button>
        <View style={{ height: 10 }} />
        <Button
          mode='contained-tonal'
          dark={true}
          onPress={() => { router.replace('/(main)/newvehicle/tesla'); }}
          style={{ flex: 1, width: '100%', height: 200 }}
          contentStyle={{ width: '100%', height: '100%' }}>
          <Text>{t('TESLA API')}</Text>
        </Button>
        <View style={{ height: 10 }} />
      </ScrollView>
      <Stack.Screen
        options={{
          headerTitle: t('New Vehicle'),
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: 200,
  },
});