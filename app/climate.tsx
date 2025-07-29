import React from "react";
import { View, StyleSheet } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper'
import { useSelector } from "react-redux";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { VehicleTopImage } from "@/components/ui/VehicleImages";
import { MetricValue } from "@/components/ui/MetricValue";
import { useTranslation } from "react-i18next";
import { selectMetricValue } from "@/store/metricsSlice";

export default function ClimateScreen() {
  const vehicle = useSelector(getSelectedVehicle)

  const cooling = useSelector(selectMetricValue("v.e.cooling")) == "on"
  const heating = useSelector(selectMetricValue("v.e.heating")) == "on"

  const { t } = useTranslation()

  const theme = useTheme()

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

          {/* Box for remaining features */}
          <View style={{ flexDirection: 'row', padding: 20, position: 'absolute', left: '5%', top: '70%', width: '90%', height: '25%', borderWidth: 2, borderColor: 'grey', borderRadius: 20 }}>

            {/* Heating/cooling enabled */}
            <View style={{ flexShrink: 1, flexDirection: 'column', alignItems: 'center' }}>
              <View style={cooling ? { opacity: 1 } : { opacity: 0 }}>
                <Icon size={50} source={"fan"} />
                <MetricValue metricKey={"v.e.cabinfan"} style={{ alignSelf: 'center' }}></MetricValue>
              </View>
              <View style={heating ? { opacity: 1 } : { opacity: 0 }}>
                <Icon size={50} source={"fire"} />
              </View>
            </View>

            {/* Cabin details */}
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 20 }}>
              <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                <View style={{ justifyContent: 'flex-start' }}>
                  <MetricValue metricKey={"v.e.cabintemp"} numberOfLines={1} adjustsFontSizeToFit={true} variant="headlineLarge" emptyOverride={t("N/A")}></MetricValue>
                  {(cooling || heating) &&
                    <>
                      <View style={{ flexShrink: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon size={20} source={'bullseye'}></Icon>
                        <MetricValue metricKey={"v.e.cabinsetpoint"} numberOfLines={1} adjustsFontSizeToFit={true} variant="headlineSmall"></MetricValue>
                      </View>
                      <MetricValue metricKey={"v.e.cabinintake"} numberOfLines={1} adjustsFontSizeToFit={true} variant="labelLarge"></MetricValue>
                    </>
                  }
                </View>
                <Text variant="headlineMedium" numberOfLines={1} adjustsFontSizeToFit={true}>{t("Cabin")}</Text>
              </View>
            </View>

            {/* Ambient details */}
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 20 }}>
              <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                <MetricValue metricKey={"v.e.temp"} numberOfLines={1} adjustsFontSizeToFit={true} variant="headlineLarge"></MetricValue>
                <Text variant="headlineMedium" numberOfLines={1} adjustsFontSizeToFit={true}>{t("Ambient")}</Text>
              </View>
            </View>
          </View>

        </View>
      }
    </View>
  );
}


const styles = StyleSheet.create({
  primaryContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  screenContainer: { width: '100%', height: '100%', borderWidth: 0, borderColor: 'blue' },
  vehicleImageBoundary: { position: 'absolute', left: '20%', top: '0%', width: '60%', height: '70%', borderWidth: 0, borderColor: 'blue' },
  vehicleImageContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  metricValue: { fontSize: 20, padding: 5 },

  absoluteCentering: { position: 'absolute', transform: [{ 'translateX': '-50%' }, { 'translateY': "-50%" }] }
})
