import React from "react";
import { Stack } from "expo-router";

export default function SubscreenStack() {

  return (
    <Stack>
      <Stack.Screen
        name="newvehicle"
        options={{
          title: 'New Vehicle',
        }}
      />
      <Stack.Screen
        name="controls"
        options={{
          title: 'Controls',
        }}
      />
      <Stack.Screen
        name="climate"
        options={{
          title: 'Climate',
        }}
      />
      <Stack.Screen
        name="charging"
        options={{
          title: 'Charging',
        }}
      />
      <Stack.Screen
        name="location"
        options={{
          title: 'Location',
        }}
      />
      <Stack.Screen
        name="messages"
        options={{
          title: 'Messages',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="developer"
        options={{
          title: 'Developer',
        }}
      />
    </Stack>
  );
}