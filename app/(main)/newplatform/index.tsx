import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet
} from "react-native";
import { router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Text, Card, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Image } from "react-native";

export default function NewPlatform() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <ScrollView style={{ height: '100%' }}>
        <Card mode="contained" style={{ margin: 10, padding: 10 }}
          onPress={() => { router.push('/(main)/newplatform/ovmsv2'); }}>
          <Card.Content style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image source={require('@/assets/platforms/ovms.png')} style={{ width: 75, height: 75 }} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
              <Text variant="titleLarge">{t('OVMS v2 API')}</Text>
              <View style={{ height: 10 }} />
              <Text variant="bodySmall" style={{ alignSelf: 'flex-start' }}>{t('Using the OVMS v2 API, protected by SSL/TLS encryption, and authenticated by username and password.')}</Text>
            </View>
          </Card.Content>
        </Card>
        <View style={{ height: 10 }} />
        <Card mode="contained" style={{ margin: 10, padding: 10 }}
          onPress={() => { router.push('/(main)/newplatform/ovmsv2demo'); }}>
          <Card.Content style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image source={require('@/assets/platforms/ovms.png')} style={{ width: 75, height: 75 }} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
              <Text variant="titleLarge">{t('OVMS v2 DEMO')}</Text>
              <View style={{ height: 10 }} />
              <Text variant="bodySmall" style={{ alignSelf: 'flex-start' }}>{t('The OVMS v2 Demonstration Vehicle. This is a simple demonstration of the OVMS system using randomised sample data.')}</Text>
            </View>
          </Card.Content>
        </Card>
        <View style={{ height: 10 }} />
        <Card mode="contained" style={{ margin: 10, padding: 10 }}
          onPress={() => { router.push('/(main)/newplatform/tesla'); }}>
          <Card.Content style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image source={require('@/assets/platforms/tesla.png')} style={{ width: 75, height: 75 }} />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
              <Text variant="titleLarge">{t('Tesla Fleet API')}</Text>
              <View style={{ height: 10 }} />
              <Text variant="bodySmall" style={{ alignSelf: 'flex-start' }}>{t('Using the Tesla fleet API, protected by SSL/TLS encryption, and authenticated by Tesla account credentials.')}</Text>
            </View>
          </Card.Content>
        </Card>
        <View style={{ height: 10 }} />
      </ScrollView>
      <Stack.Screen
        options={{
          headerTitle: t('New Platform'),
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