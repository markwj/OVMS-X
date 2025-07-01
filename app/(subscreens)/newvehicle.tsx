import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet
} from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Text, Card } from 'react-native-paper';

export default function NewVehicle() {
  const theme = useTheme();

  return (
    <>
      <ScrollView style={{ height: '100%' }}>
        <Card style={styles.container}>
          <Card.Content>
            <Text>OVMS v2 API</Text>
          </Card.Content>
        </Card>
        <Card style={styles.container}>
          <Card.Content>
            <Text>TESLA API</Text>
          </Card.Content>
        </Card>
      </ScrollView>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'New Vehicle',
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