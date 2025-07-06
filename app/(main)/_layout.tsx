import React from "react";
import { Stack } from "expo-router";
import { useTranslation } from 'react-i18next';

export default function SubscreenStack() {
  const { t } = useTranslation();
  return (
    <Stack>
      <Stack.Screen
        name="newvehicle"
        options={{
          title: t('New Vehicle'),
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
        name="developer"
        options={{
          title: t('Developer'),
        }}
      />
    </Stack>
  );
}