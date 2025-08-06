import React, { useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import { useTheme, Text, ProgressBar, IconButton } from 'react-native-paper';
import { usePathname, useRouter } from "expo-router";
import { ControlButton, ControlIcon, controlType } from "@/components/ui/ControlButtons";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { selectMetricValue } from "@/store/metricsSlice";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { BatteryIcon } from "@/components/ui/BatteryIcon";
import { GetVehicleName, VehicleSideImage } from "@/components/ui/VehicleImages";
import { ConnectionText } from "@/components/ui/ConnectionDisplay";
import { MetricValue } from "@/components/ui/MetricValue";
import { getVehicleCount } from "@/store/vehiclesSlice";
import { ParkingTimer } from "@/components/ui/ParkingTimer";
import { sendCommand } from "@/lib/platforms/platform";
import { CommandCode } from "@/lib/platforms/commands";

export default function HomeScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const vBatSoc = useSelector(selectMetricValue("v.b.soc"))
  const vType = useSelector(selectMetricValue("v.type"))
  const vName = GetVehicleName(vType);

  const selectedVehicle = useSelector(getSelectedVehicle)
  const vehicleCount = useSelector(getVehicleCount)
  const vEAwake = useSelector(selectMetricValue("v.e.awake12")) === "awake"

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
        router.push('/newplatform');
      }, 0);
    }
    return null;
  }

  return (
    <>
      <View>

        {/* Top status (battery, range, connection status) */}
        <View style={{ flex: 1, zIndex: 1, flexDirection: 'row', width: '100%', position: 'absolute', left: 0, top: 20 }}>
          <View style={{ flex: 1, flexDirection: 'column', flexGrow: 1, alignItems: 'flex-start', marginLeft: 10, gap: 10 }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <BatteryIcon />
              <MetricValue style={{ marginStart: 10 }} metricKey={"v.b.range.est"} />
            </View>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <ParkingTimer />
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
            <ConnectionText />
            {!vEAwake &&
              <IconButton size={20} icon={"sleep"} onPress={() => {
                sendCommand({ commandCode: CommandCode.WAKEUP_CAR })
              }}></IconButton>
            }
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
              { vName && <Text variant='labelMedium'>{vName}</Text> }
              <MetricValue variant='labelMedium' metricKey={"v.p.odometer"} />
              {selectedVehicle?.vin && <Text variant='labelMedium'>{selectedVehicle?.vin}</Text>}
              <MetricValue variant='labelMedium' numberOfLines={0} adjustsFontSizeToFit={true} metricKey={"m.hardware"} />
            </View>
          </View>

        </ScrollView>

      </View>
    </>
  );
}
