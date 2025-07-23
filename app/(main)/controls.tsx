import React, { JSX } from "react";
import { useTheme, Text, IconButton, Icon } from 'react-native-paper';
import { View, StyleSheet, StyleProp } from 'react-native';
import { VehicleTopImage } from "@/components/ui/VehicleImages";
import { useSelector } from "react-redux";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { vehiclesSlice } from "@/store/vehiclesSlice";
import { store } from "@/store/root";
import { selectLocalisedMetricValue, selectMetricIsStale } from "@/store/metricsSlice";
import { GetCurrentUTCTimeStamp } from "@/components/utils/datetime";
import { transform } from "@babel/core";
import { MetricValue } from "@/components/ui/MetricValue";
import { BatteryIcon } from "@/components/ui/BatteryIcon";

export default function ControlsScreen() {
  const vehicle = useSelector(getSelectedVehicle)

  return (
    <View style={styles.primaryContainer}>
      {vehicle != null &&
        <View style={styles.screenContainer}>

          {/* Car display */}
          <View style={styles.vehicleImageBoundary}>
            <View style={styles.vehicleImageContainer}>
              <VehicleTopImage image={vehicle.image}></VehicleTopImage>
            </View>
          </View>

          {/* TPMS displays */}
          <View style={{ ...styles.absoluteCentering, left: '10%', top: '20%', borderColor: 'white', borderWidth: 2 }}>
            <MetricValue style={styles.metricValue} metricKey={"v.tp.fl.t"} />
            <MetricValue style={{ ...styles.metricValue, borderColor: 'white', borderTopWidth: 1 }} metricKey={"v.tp.fl.p"} />
          </View>

          <View style={{ ...styles.absoluteCentering, left: '90%', top: '20%', borderColor: 'white', borderWidth: 2 }}>
            <MetricValue style={styles.metricValue} metricKey={"v.tp.fr.t"} />
            <MetricValue style={{ ...styles.metricValue, borderColor: 'white', borderTopWidth: 1 }} metricKey={"v.tp.fr.p"} />
          </View>

          <View style={{ ...styles.absoluteCentering, left: '10%', top: '80%', borderColor: 'white', borderWidth: 2 }}>
            <MetricValue style={styles.metricValue} metricKey={"v.tp.rl.t"} />
            <MetricValue style={{ ...styles.metricValue, borderColor: 'white', borderTopWidth: 1 }} metricKey={"v.tp.rl.p"} />
          </View>

          <View style={{ ...styles.absoluteCentering, left: '90%', top: '80%', borderColor: 'white', borderWidth: 2 }}>
            <MetricValue style={styles.metricValue} metricKey={"v.tp.rr.t"} />
            <MetricValue style={{ ...styles.metricValue, borderColor: 'white', borderTopWidth: 1 }} metricKey={"v.tp.rr.p"} />
          </View>

          {/* Temperature displays */}
          <View style={{ ...styles.absoluteCentering, left: '70%', top: '92.5%', borderColor: 'white', borderWidth: 2 }}>
            <View style={{ ...styles.metricValue, flexDirection: 'row', alignItems: 'center' }}>
              <BatteryIcon />
              <Text style={{ marginLeft: 5 }}>Battery</Text>
            </View>
            <MetricValue style={{ ...styles.metricValue, borderColor: 'white', borderTopWidth: 1 }} metricKey={"v.b.temp"} />
          </View>

          <View style={{ ...styles.absoluteCentering, left: '30%', top: '92.5%', borderColor: 'white', borderWidth: 2 }}>
            <View style={{ ...styles.metricValue, flexDirection: 'row', alignItems: 'center' }}>
              <Icon size={20} source={"axis-x-rotate-clockwise"} />
              <Text style={{ marginLeft: 5 }}>Motor</Text>
            </View>
            <MetricValue style={{ ...styles.metricValue, borderColor: 'white', borderTopWidth: 1 }} metricKey={"v.m.temp"} />
          </View>

          {/* Lock Display */}
          <View style={{ ...styles.absoluteCentering, left: '50%', top: '5%' }}>
            <MetricIconDisplay
              metricName={"v.e.locked"}
              icon={(value) => value == "locked" ? "lock" : "lock-open"}
              iconSize={50}
            />
          </View>

        </View>
      }
    </View>
  );
}

function MetricIconDisplay({ metricName, icon, iconSize, style, onPress }: { metricName: string, icon: string | ((value: string, unit: string) => string), iconSize: number, style?: any, onPress?: () => void }) {
  const { value, unit } = store.dispatch(selectLocalisedMetricValue(metricName))
  const stale = useSelector(selectMetricIsStale(metricName, GetCurrentUTCTimeStamp()))

  if (value == null) { return <></> }

  return (
    <View style={{ ...style }}>
      <IconButton
        icon={typeof icon === 'string' ? icon : icon(value, unit)}
        size={iconSize}
        iconColor={stale ? 'grey' : 'white'}
        onPress={onPress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  primaryContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', padding: 20 },
  screenContainer: { width: '100%', height: '100%', borderWidth: 0, borderColor: 'blue' },
  vehicleImageBoundary: { position: 'absolute', left: '20%', top: '10%', width: '60%', height: '75%', borderWidth: 0, borderColor: 'blue' },
  vehicleImageContainer: { height: '100%', alignItems: 'center' },
  metricValue: { fontSize: 20, padding: 5 },

  absoluteCentering: { position: 'absolute', transform: [{ 'translateX': '-50%' }, { 'translateY': "-50%" }] }
})
