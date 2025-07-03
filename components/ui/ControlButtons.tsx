import React, { useState, useRef } from "react";
import { Button, IconButton } from 'react-native-paper';
import { router } from "expo-router";

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

export function ControlIcon({ type } : { type : controlType }): React.JSX.Element | null {
  switch (type) {
    case controlType.Controls:
      return (
        <IconButton icon='car' onPress={() => { router.push('/(main)/controls'); }} />
      );
    case controlType.Climate:
      return (
        <IconButton icon='air-conditioner' onPress={() => { router.push('/(main)/climate'); }} />
      );
    case controlType.Charging:
      return (
        <IconButton icon='ev-plug-type2' onPress={() => { router.push('/(main)/charging'); }} />
      );
    case controlType.Location:
      return (
        <IconButton icon='map-marker' onPress={() => { router.push('/(main)/location'); }} />
      );
    case controlType.Messages:
      return (
        <IconButton icon='chat' onPress={() => { router.push('/(main)/messages'); }} />
      );
    case controlType.Energy:
      return (
        <IconButton icon='electric-bolt' onPress={() => { }} />
      );
    case controlType.Lock:
      return (
        <IconButton icon='lock' onPress={() => { }} />
      );
    case controlType.Settings:
      return (
        <IconButton icon='hammer-wrench' onPress={() => {router.push('/(main)/settings'); }} />
      );
    case controlType.Developer:
      return (
        <IconButton icon='developer-board' onPress={() => { router.push('/(main)/developer'); }} />
      );
  }
  return null;
}

export function ControlButton({ type } : { type : controlType }): React.JSX.Element | null {
  switch (type) {
    case controlType.Controls:
      return (
        <Button
          icon='car'
          mode='contained-tonal'
          dark={true}
          onPress={() => { router.push('/(main)/controls'); }}
          style={{ alignItems: 'center', width: '80%', marginBottom: 10 }}>
          Controls
        </Button>
      );
    case controlType.Climate:
      return (
        <Button
          icon='air-conditioner'
          mode='contained-tonal'
          dark={true}
          onPress={() => { router.push('/(main)/climate'); }}
          style={{ alignItems: 'center', width: '80%', marginBottom: 10 }}>
          Climate
        </Button>
      );
    case controlType.Charging:
      return (
        <Button
          icon='ev-plug-type2'
          mode='contained-tonal'
          dark={true}
          onPress={() => { router.push('/(main)/charging'); }}
          style={{ alignItems: 'center', width: '80%', marginBottom: 10 }}>
          Charging
        </Button>
      );
    case controlType.Location:
      return (
        <Button
          icon='map-marker'
          mode='contained-tonal'
          dark={true}
          onPress={() => { router.push('/location'); }}
          style={{ alignItems: 'center', width: '80%', marginBottom: 10 }}>
          Location
        </Button>
      );
    case controlType.Messages:
      return (
        <Button
          icon='chat'
          mode='contained-tonal'
          dark={true}
          onPress={() => { router.push('/(main)/messages'); }}
          style={{ alignItems: 'center', width: '80%', marginBottom: 10 }}>
          Messages
        </Button>
      );
    case controlType.Energy:
      return (
        <Button
          icon='electric-bolt'
          mode='contained-tonal'
          dark={true}
          onPress={() => { }}
          style={{ alignItems: 'center', width: '80%', marginBottom: 10 }}>
          Controls
        </Button>
      );
    case controlType.Lock:
      return (
        <Button
          icon='lock'
          mode='contained-tonal'
          dark={true}
          onPress={() => { }}
          style={{ alignItems: 'center', width: '80%', marginBottom: 10 }}>
          Security
        </Button>
      );
    case controlType.Settings:
      return (
        <Button
          icon='hammer-wrench'
          mode='contained-tonal'
          dark={true}
          onPress={() => { router.push('/(main)/settings'); }}
          style={{ alignItems: 'center', width: '80%', marginBottom: 10 }}>
          Settings
        </Button>
      );
    case controlType.Developer:
      return (
        <Button
          icon='developer-board'
          mode='contained-tonal'
          dark={true}
          onPress={() => { router.push('/(main)/developer'); }}
          style={{ alignItems: 'center', width: '80%', marginBottom: 10 }}>
          Developer
        </Button>
      );
  }
  return null;
}