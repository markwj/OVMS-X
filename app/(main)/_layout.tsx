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
        name="location"
        options={{
          title: 'Location',
        }}
      />
    </Stack>
  );
}