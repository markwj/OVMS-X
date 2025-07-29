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
        <PlatformCard imageSource={require('@/assets/platforms/ovms.png')} title={'OVMS v2 API'} body={'Using the OVMS v2 API, protected by SSL/TLS encryption, and authenticated by username and password.'} pageSource={'/newplatform/ovmsv2'}></PlatformCard>
        <PlatformCard imageSource={require('@/assets/platforms/ovms.png')} title={'OVMS v2 DEMO'} body={'The OVMS v2 Demonstration Vehicle. This is a simple demonstration of the OVMS system using randomised sample data.'} pageSource={'/newplatform/ovmsv2demo'}></PlatformCard>
        <PlatformCard imageSource={require('@/assets/platforms/tesla.png')} title={'Tesla Fleet API'} body={'Using the Tesla fleet API, protected by SSL/TLS encryption, and authenticated by Tesla account credentials.'} pageSource={'/newplatform/tesla'}></PlatformCard>
      </ScrollView>
      <Stack.Screen
        options={{
          headerTitle: t('New Platform'),
        }}
      />
    </>
  );
}

function PlatformCard({ imageSource, title, body, pageSource }: { imageSource: any, title: string, body: string, pageSource : any }) {
  const {t} = useTranslation()

  return (
    <Card mode="contained" style={{ margin: 10, padding: 10, marginTop: 10 }}
      onPress={() => { router.replace(pageSource); }}>
      <Card.Content style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Image source={imageSource} style={{ width: 75, height: 75 }} />
        <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
          <Text variant="titleLarge">{t(title)}</Text>
          <View style={{ height: 10 }} />
          <Text variant="bodySmall" style={{ alignSelf: 'flex-start' }}>{t(body)}</Text>
        </View>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: 200,
  },
});