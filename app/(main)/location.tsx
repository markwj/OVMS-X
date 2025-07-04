import React from "react";
import { View, StyleSheet, Dimensions } from 'react-native';
import { Map } from "@/components/ui/Map";


export default function LocationScreen() {
  return (
    <View style={styles.container}>
      <Map />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
