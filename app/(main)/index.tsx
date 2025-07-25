import React, { useEffect } from "react";
import { View, ScrollView, RefreshControl, SafeAreaView } from "react-native";
import { useTheme, Text, Icon, ProgressBar } from 'react-native-paper';
import { Stack, usePathname, useRouter } from "expo-router";
import { ControlButton, ControlIcon, controlType } from "@/components/ui/ControlButtons";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { selectLocalisedMetricValue, selectMetricValue } from "@/store/metricsSlice";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { BatteryIcon } from "@/components/ui/BatteryIcon";
import { GetVehicleName, VehicleSideImage } from "@/components/ui/VehicleImages";
import { getLastUpdateTime } from "@/store/connectionSlice";
import { ConnectionText } from "@/components/ui/ConnectionDisplay";
import { store } from "@/store/root";
import { MetricValue } from "@/components/ui/MetricValue";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getVehicleCount } from "@/store/vehiclesSlice";
import { ParkingTimer } from "@/components/ui/ParkingTimer";

export default function HomeScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const vBatSoc = useSelector(selectMetricValue("v.b.soc"))
  const vType = useSelector(selectMetricValue("v.type"))

  const selectedVehicle = useSelector(getSelectedVehicle)
  const vehicleCount = useSelector(getVehicleCount)
  const lastUpdated = useSelector(getLastUpdateTime)

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  }, []);

  const routepath = usePathname();

  if ((selectedVehicle == null) || (vehicleCount == 0)) {
    console.log("[HomeScreen] No vehicle selected, currently at", routepath);
    if (routepath.substring(0, 12) !== '/newplatform') {
      setTimeout(() => {
        router.push('/(main)/newplatform');
      }, 0);
    }
    return null;
  }

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView>

          {/* Top status (battery, range, connection status) */}
          <View style={{ flex: 1, zIndex: 1, flexDirection: 'row', width: '100%', position: 'absolute', left: 0, top: 20 }}>
            <View style={{ flex: 1, flexDirection: 'column', flexGrow: 1, alignItems: 'flex-start', marginLeft: 10, gap: 10 }}>
              <View style={{ flexDirection: 'row', flex : 1 }}>
                <BatteryIcon />
                <MetricValue style={{ marginStart: 10 }} metricKey={"v.b.range.est"} />
              </View>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <ParkingTimer />
              </View>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
              <ConnectionText />
            </View>
          </View>

          {/* Main content (vehicle image, controls, etc.) */}
          <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

            {/* Vehicle image */}
            <View style={{ flexShrink: 1, justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1, width: '80%' }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', marginTop: 50, marginBottom: 10 }}>
                  {selectedVehicle != null && <VehicleSideImage image={selectedVehicle.image} />}
                </View>
              </View>
            </View>

            {/* Controls */}
            <View style={{ flexGrow: 1, flexDirection: 'column', alignItems: 'stretch', marginTop: 10, marginBottom: 10 }}>

              {/* Control little buttons */}
              <View style={{ alignItems: 'center', gap: 20, justifyContent: 'center', flexDirection: 'row' }}>
                <ControlIcon type={controlType.Lock} />
                <ControlIcon type={controlType.Charging} />
                <ControlIcon type={controlType.Controls} />
                <ControlIcon type={controlType.Climate} />
                <ControlIcon type={controlType.Messages} />
              </View>

              {/* Battery and range */}
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <ProgressBar progress={(vBatSoc ?? 0) / 100} color='#00ff00' visible={true} style={{ height: 10, width: 300 }} />
                <View style={{ width: 300, flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                  <Text>SOC: </Text>
                  <MetricValue metricKey={"v.b.soc"} />
                  <Text>  Range: </Text>
                  <MetricValue metricKey={"v.b.range.est"} />
                </View>
              </View>

              {/* Control main buttons */}
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <ControlButton type={controlType.Controls} />
                <ControlButton type={controlType.Climate} />
                <ControlButton type={controlType.Charging} />
                <ControlButton type={controlType.Location} />
                <ControlButton type={controlType.Messages} />
                <ControlButton type={controlType.Settings} />
                <ControlButton type={controlType.Developer} />
              </View>

              {/* Vehicle info */}
              <View style={{ alignItems: 'flex-start', marginLeft: 50, marginTop: 10 }}>
                <Text variant='labelMedium'>{t(GetVehicleName(vType) ?? "Vehicle")}</Text>
                <MetricValue variant='labelMedium' metricKey={"v.p.odometer"}/>
                <Text variant='labelMedium'>{t('VIN')} {selectedVehicle?.vin ?? "N/A "}</Text>
              </View>
            </View>

          </ScrollView>

        </SafeAreaView>
      </SafeAreaProvider>

      <Stack.Screen
        options={{
          headerTitle: t('Vehicle'),
          headerShown: false,
        }} />
    </>
  );
}

function DisplayDataAge(dataAgeSeconds: number, t: any) {
  const minutes = dataAgeSeconds / 60
  const hours = minutes / 60
  const days = hours / 24

  if (days >= 1) { return `${Math.floor(days)} ${days >= 2 ? t('days') : t('day')}` }
  if (hours >= 1) { return `${Math.floor(hours)} ${hours >= 2 ? t('hours') : t('hour')}` }
  if (minutes >= 1) { return `${Math.floor(minutes)} ${minutes >= 2 ? t('minutes') : t('minute')}` }
  return "live"
}
