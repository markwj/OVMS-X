import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from 'react-i18next';

export function Map() {
  const { t } = useTranslation();
  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{t('Sorry, maps are not available on web')}</Text>
      </View>
  );
}
