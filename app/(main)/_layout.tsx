import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getColorScheme, getLanguage, setColorScheme, setLanguage } from "@/store/preferencesSlice";
import { Appearance } from "react-native";
import { useTheme } from "react-native-paper";
import { TSupportedLanguages } from "@/i18n";

export default function SubscreenStack() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch()
  const theme = useTheme()

  //Sets settings according to stored redux settings
  const reduxColorScheme = useSelector(getColorScheme)
  const reduxLanguage = useSelector(getLanguage)

  useEffect(() => {
    if(reduxColorScheme != null) {
      Appearance.setColorScheme(reduxColorScheme)
    } else {
      dispatch(setColorScheme(theme.dark ? "dark" : "light"))
    }
    if(reduxLanguage != null) {
      i18n.changeLanguage(reduxLanguage)
    } else {
      dispatch(setLanguage(i18n.language as TSupportedLanguages))
    }
  }, [])
  
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
        },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
        headerLargeTitle: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t('Vehicle'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="newplatform"
        options={{
          title: t('New Platform'),
        }}
      />
      <Stack.Screen
        name="newplatform/ovmsv2"
        options={{
          title: t('OVMS v2 API'),
        }}
      />
      <Stack.Screen
        name="newplatform/tesla"
        options={{
          title: t('TESLA API'),
        }}
      />
      <Stack.Screen
        name="controls"
        options={{
          title: t('Controls'),
        }}
      />
      <Stack.Screen
        name="climate"
        options={{
          title: t('Climate'),
        }}
      />
      <Stack.Screen
        name="charging"
        options={{
          title: t('Charging'),
        }}
      />
      <Stack.Screen
        name="location"
        options={{
          title: t('Location'),
        }}
      />
      <Stack.Screen
        name="messages"
        options={{
          title: t('Messages'),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: t('Settings'),
        }}
      />
      <Stack.Screen
        name="developer/metrics"
        options={{
          title: t('Metrics'),
        }}
      />
      <Stack.Screen
        name="developer/aboutMetric"
        options={{
          title: 'About Metric',
        }}
      />
      <Stack.Screen
        name="editvehicle"
        options={{
          title: 'Edit Vehicle',
        }}
      />
    </Stack>
  );
}