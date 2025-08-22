import React from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Text, useTheme } from 'react-native-paper';
import { router } from 'expo-router'

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text>{t('This screen doesn\'t exist.')}</Text>
      <Button dark={theme.dark} style={styles.link} mode='contained-tonal' onPress={() => {router.dismissAll(); router.replace("/")}}>
        {t('Return to home screen')}
      </Button>
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
  },
});
