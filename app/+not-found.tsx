import React from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native-paper';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text>{t('This screen doesn\'t exist.')}</Text>
      <Link href="/" style={styles.link}>
        <Text>{t('Return to home screen')}</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
