import React, { useState, useRef } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function NewPlatformTesla() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView style={{ height: '100%' }}>
    </ScrollView>
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