import React, { useState, useRef } from "react";
import {
  ScrollView,
  View,
  Image,
  ImageBackground
} from "react-native";
import { useTheme, Text, Button, IconButton, Icon, ProgressBar, Appbar } from 'react-native-paper';
import BottomSheet, { BottomSheetView, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router, useNavigation } from "expo-router";
import { Formik } from 'formik';
import { ControlButton, ControlIcon, controlType } from "@/components/ui/ControlButtons";

export default function HomeScreen() {
  const theme = useTheme();

  const bottomSheetRef = useRef<BottomSheet>(null);
  //bottomSheetRef.current?.snapToPosition('66%');
  const carImage = require('@/assets/ovms/carimages/car_roadster_racinggreen.png');

  return (
    <View style={{ flex: 1, justifyContent: "stretch", alignItems: "center" }}>
      <View style={{ flex: 1, flexDirection: 'row', width: '100%', position: 'absolute', left: 0, top: 20 }}>
        <View style={{ flex: 1, flexDirection: 'column', flexGrow: 1, alignItems: 'flex-start', marginLeft: 10 }}>
          <View style={{ flex: 1, flexDirection: 'row', flexGrow: 1 }}>
            <Icon source='battery-60' size={20} />
            <Text style={{ marginStart: 10 }}>365km</Text>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
          <Icon source='antenna' size={20} />
          <Text style={{ marginTop: 10 }}>Awake, online</Text>
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
            <ControlIcon type={controlType.Lock}/>
            <ControlIcon type={controlType.Charging}/>
            <ControlIcon type={controlType.Controls}/>
            <ControlIcon type={controlType.Climate}/>
            <ControlIcon type={controlType.Messages}/>
          </View>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <ProgressBar progress={0.75} color='#00ff00' visible={true} style={{ height: 10, width: 300 }} />
            <Text style={{ marginTop: 5 }}>SOC: 76%  Range: 365km</Text>
          </View>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <ControlButton type={controlType.Controls}/>
            <ControlButton type={controlType.Climate}/>
            <ControlButton type={controlType.Charging}/>
            <ControlButton type={controlType.Location}/>
            <ControlButton type={controlType.Messages}/>
            <ControlButton type={controlType.Settings}/>
            <ControlButton type={controlType.Developer}/>
          </View>
          <View style={{ alignItems: 'left', marginLeft: 50, marginTop: 10 }}>
            <Text variant='labelMedium'>Tesla Roadster 2.0 Sport</Text>
            <Text variant='labelMedium'>17,528 km</Text>
            <Text variant='labelMedium'>VIN LRW3F7EK5PC839304</Text>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View >
  );
}
