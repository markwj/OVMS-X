import React, { useEffect, useRef, useState } from "react"
import { AppState } from "react-native"
import { useSelector } from "react-redux"
import { getSelectedVehicle } from "@/store/vehiclesSlice"
import { OVMSv2ConnectionIcon } from "./ovmsv2"
import { TeslaConnectionIcon } from "./tesla"
import { DefaultConnectionIcon } from "./default"
import { InactiveConnectionIcon } from "./inactive"

export function ConnectionIcon(): React.JSX.Element {
  const selectedVehicle = useSelector(getSelectedVehicle)
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('[connection] app state changed to active');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('[connection] app state', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (appState.current != "active") {
    return (<InactiveConnectionIcon />)
  } else if (selectedVehicle?.platform == "ovmsv2api") {
    return (<OVMSv2ConnectionIcon />)
  } else if (selectedVehicle?.platform == "teslawebapi") {
    return (<TeslaConnectionIcon />)
  } else {
    return (<DefaultConnectionIcon />)
  }
}
