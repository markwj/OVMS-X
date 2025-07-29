import React, { useState, useRef } from "react";
import { Button, IconButton, useTheme } from 'react-native-paper';
import { router } from "expo-router";
import { useTranslation } from 'react-i18next';
import { ConnectionCommand } from "@/components/platforms/connection";
import { CommandCode } from "@/app/platforms/commands";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { store } from "@/store/root";
import { selectMetricValue } from "@/store/metricsSlice";
import { Alert } from "react-native";

export enum controlType {
  Controls = 1,
  Climate,
  Charging,
  Location,
  Messages,
  Energy,
  Lock,
  Settings,
  Developer
}

const getPIN = () => {
  const {t} = useTranslation()

  return new Promise((resolve, reject) => {
    Alert.prompt(
      t('Enter PIN'),
      '',
      [
        {
          text: t('Cancel'),
          onPress: () => reject('User canceled'),
          style: 'cancel',
        },
        {
          text: t('OK'),
          onPress: (text) => resolve(text),
        },
      ],
      'secure-text',
      '',
      'numeric'
    );
  });
}

export function ControlIcon({ type }: { type: controlType }): React.JSX.Element | null {
  const { t } = useTranslation();
  switch (type) {
    case controlType.Controls:
      return (
        <IconButton icon='car' onPress={() => { router.push('/controls'); }} />
      );
    case controlType.Climate:
      return (
        <IconButton icon='air-conditioner' onPress={() => { router.push('/climate'); }} />
      );
    case controlType.Charging:
      return (
        <IconButton icon='ev-plug-type2' onPress={() => { router.push('/charging'); }} />
      );
    case controlType.Location:
      return (
        <IconButton icon='map-marker' onPress={() => { router.push('/location'); }} />
      );
    case controlType.Messages:
      return (
        <IconButton icon='chat' onPress={() => { router.push('/messages'); }} />
      );
    case controlType.Energy:
      return (
        <IconButton icon='electric-bolt' onPress={() => { }} />
      );
    case controlType.Lock:
      return (
        <IconButton icon='lock' onPress={async () => {
          const pin = await getPIN()
          const vehicle = getSelectedVehicle(store.getState())
          if (pin == "User cancelled") { return }
          if (selectMetricValue("v.e.locked")(store.getState())) {
            await ConnectionCommand(vehicle, { commandCode: CommandCode.UNLOCK_CAR, params: {pin: pin} })
            return
          }
          await ConnectionCommand(vehicle, { commandCode: CommandCode.LOCK_CAR, params: {pin: pin} })
        }} />
      );
    case controlType.Settings:
      return (
        <IconButton icon='hammer-wrench' onPress={() => { router.push('/settings'); }} />
      );
    case controlType.Developer:
      return (
        <IconButton icon='developer-board' onPress={() => { router.push('/developer/metrics'); }} />
      );
  }
  return null;
}

export function ControlButton({ type }: { type: controlType }): React.JSX.Element | null {
  const { t } = useTranslation();
  const theme = useTheme()
  switch (type) {
    case controlType.Controls:
      return (
        <Button
          icon='car'
          mode='contained-tonal'
          dark={theme.dark}
          onPress={() => { router.push('/controls'); }}
          style={{ width: '80%', marginBottom: 10 }}>
          {t('Controls')}
        </Button>
      );
    case controlType.Climate:
      return (
        <Button
          icon='air-conditioner'
          mode='contained-tonal'
          dark={theme.dark}
          onPress={() => { router.push('/climate'); }}
          style={{ width: '80%', marginBottom: 10 }}>
          {t('Climate')}
        </Button>
      );
    case controlType.Charging:
      return (
        <Button
          icon='ev-plug-type2'
          mode='contained-tonal'
          dark={theme.dark}
          onPress={() => { router.push('/charging'); }}
          style={{ width: '80%', marginBottom: 10 }}>
          {t('Charging')}
        </Button>
      );
    case controlType.Location:
      return (
        <Button
          icon='map-marker'
          mode='contained-tonal'
          dark={theme.dark}
          onPress={() => { router.push('/location'); }}
          style={{ width: '80%', marginBottom: 10 }}>
          {t('Location')}
        </Button>
      );
    case controlType.Messages:
      return (
        <Button
          icon='chat'
          mode='contained-tonal'
          dark={theme.dark}
          onPress={() => { router.push('/messages'); }}
          style={{ width: '80%', marginBottom: 10 }}>
          {t('Messages')}
        </Button>
      );
    case controlType.Energy:
      return (
        <Button
          icon='electric-bolt'
          mode='contained-tonal'
          dark={theme.dark}
          onPress={() => { }}
          style={{ width: '80%', marginBottom: 10 }}>
          {t('Controls')}
        </Button>
      );
    case controlType.Lock:
      return (
        <Button
          icon='lock'
          mode='contained-tonal'
          dark={theme.dark}
          onPress={() => { }}
          style={{ width: '80%', marginBottom: 10 }}>
          {t('Security')}
        </Button>
      );
    case controlType.Settings:
      return (
        <Button
          icon='hammer-wrench'
          mode='contained-tonal'
          dark={theme.dark}
          onPress={() => { router.push('/settings'); }}
          style={{ width: '80%', marginBottom: 10 }}>
          {t('Settings')}
        </Button>
      );
    case controlType.Developer:
      return (
        <Button
          icon='developer-board'
          mode='contained-tonal'
          dark={theme.dark}
          onPress={() => { router.push('/developer/metrics'); }}
          style={{ width: '80%', marginBottom: 10 }}>
          {t("Developer")}
        </Button>
      );
  }
  return null;
}