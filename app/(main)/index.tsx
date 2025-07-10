import React, { useRef } from "react";
import {
  View,
  Image,
} from "react-native";
import { useTheme, Text, Icon, ProgressBar } from 'react-native-paper';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Stack } from "expo-router";
import { ControlButton, ControlIcon, controlType } from "@/components/ui/ControlButtons";
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { generateGetMetricValueSelector } from "@/store/metricsSlice";
import { getSelectedVehicle } from "@/store/vehiclesSlice";
import { BatteryIcon } from "@/components/ui/BatteryIcon";

export default function HomeScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  //bottomSheetRef.current?.snapToPosition('66%');
  const carImage = require('@/assets/ovms/carimages/car_roadster_racinggreen.png');
  
  const vBatRangeEst = useSelector(generateGetMetricValueSelector("v.bat.range.est"))
  const vBatSoc = useSelector(generateGetMetricValueSelector("v.bat.soc"))
  const vPosOdometer = useSelector(generateGetMetricValueSelector("v.pos.odometer"))
  const selectedVehicle = useSelector(getSelectedVehicle)

  return (
    <>
      <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1, flexDirection: 'row', width: '100%', position: 'absolute', left: 0, top: 20 }}>
          <View style={{ flex: 1, flexDirection: 'column', flexGrow: 1, alignItems: 'flex-start', marginLeft: 10 }}>
            <View style={{ flex: 1, flexDirection: 'row', flexGrow: 1 }}>
              <BatteryIcon />
              <Text style={{ marginStart: 10 }}>{vBatRangeEst ?? "N/A "}km</Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
            <Icon source='antenna' size={20} />
            <Text style={{ marginTop: 10 }}>{t('Awake, online')}</Text>
          </View>
        </View>
        <View style={{ flex: 1, width: '80%' }}>
          <Image
            source={carImage}
            resizeMode='contain'
            style={{ width: '100%' }} />
        </View>

        <BottomSheet
          snapPoints={['74%', '42%', '60%', '100%']}
          enableContentPanningGesture={true}
          enableHandlePanningGesture={true}
          enablePanDownToClose={false}
          enableDynamicSizing={false}
          ref={bottomSheetRef}
          style={{ backgroundColor: '#000000' }}
          backgroundStyle={{ backgroundColor: theme.colors.background }}
        >
          <BottomSheetView>
            <View style={{ alignItems: 'center', gap: 20, justifyContent: 'center', flexDirection: 'row' }}>
              <ControlIcon type={controlType.Lock} />
              <ControlIcon type={controlType.Charging} />
              <ControlIcon type={controlType.Controls} />
              <ControlIcon type={controlType.Climate} />
              <ControlIcon type={controlType.Messages} />
            </View>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <ProgressBar progress={(vBatSoc ?? 0) / 100} color='#00ff00' visible={true} style={{ height: 10, width: 300 }} />
              <Text style={{ marginTop: 5 }}>{t('SOC')}: {vBatSoc ?? "N/A "}%  {t('Range')}: {vBatRangeEst ?? "N/A "}km</Text>
            </View>
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <ControlButton type={controlType.Controls} />
              <ControlButton type={controlType.Climate} />
              <ControlButton type={controlType.Charging} />
              <ControlButton type={controlType.Location} />
              <ControlButton type={controlType.Messages} />
              <ControlButton type={controlType.Settings} />
              <ControlButton type={controlType.Developer} />
            </View>
            <View style={{ alignItems: 'flex-start', marginLeft: 50, marginTop: 10 }}>
              <Text variant='labelMedium'>Tesla Roadster 2.0 Sport</Text>
              <Text variant='labelMedium'>{vPosOdometer ?? "N/A "}km</Text>
              <Text variant='labelMedium'>{t('VIN')} {selectedVehicle?.vin ?? "N/A "}</Text>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View >
      <Stack.Screen
        options={{
          headerTitle: t('Vehicle'),
          headerShown: false,
        }} />
    </>
  );
}
