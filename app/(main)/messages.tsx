import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useState, useCallback } from "react";
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addAppMessage, addVehicleMessage, generateSelectVehicleMessages } from "@/store/messagesSlice";
import { ConnectionTextualCommand } from "@/components/platforms/connection";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { VehicleConnectionState, getConnectionState } from "@/store/connectionSlice";

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()
  const selectedVehicle = useSelector(getSelectedVehicle)
  const connectionState = useSelector(getConnectionState)
  const messages = useSelector(generateSelectVehicleMessages(selectedVehicle?.key ?? ""))

  const onSend = async (newMessage : IMessage) => {
    dispatch(addAppMessage({text : newMessage.text, currentTime : Date.now(), vehicleKey: selectedVehicle?.key}));

    if (selectedVehicle && (connectionState != VehicleConnectionState.CONNECTED)) {
      dispatch(addVehicleMessage({text: "Vehicle is not connected", vehicleKey: selectedVehicle?.key}));
    } else {
      try {
        const response = await ConnectionTextualCommand(selectedVehicle, newMessage.text);
        dispatch(addVehicleMessage({text: response, vehicleKey: selectedVehicle?.key}));
      } catch (error) {
        console.error('[MessagesScreen] Error sending command:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        dispatch(addVehicleMessage({text: `Error: ${errorMessage}`, vehicleKey: selectedVehicle?.key}));
      }
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, marginBottom: insets.bottom }}>
      <GiftedChat
        messages={messages}
        timeFormat="LT"
        dateFormat="ddd D MMMM, YYYY"
        onSend={m => onSend(m[0])}
        user={{
          _id: 1,
        }}
      />
    </KeyboardAvoidingView>
  )
}
