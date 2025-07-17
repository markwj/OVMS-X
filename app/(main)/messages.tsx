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
import { Icon } from "react-native-paper";
import { VehicleSideImage } from "@/components/ui/VehicleImages";
import { generateFindVehicleSelector } from "@/store/vehiclesSlice";

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()
  const selectedVehicle = useSelector(getSelectedVehicle)
  const connectionState = useSelector(getConnectionState)
  const messages = useSelector(generateSelectVehicleMessages(selectedVehicle?.key ?? ""))

  const onSend = async (newMessage: IMessage) => {
    dispatch(addAppMessage({ text: newMessage.text, vehicleKey: selectedVehicle?.key }));

    if (selectedVehicle && (connectionState != VehicleConnectionState.CONNECTED)) {
      dispatch(addVehicleMessage({ text: "Vehicle is not connected", vehicleKey: selectedVehicle?.key, vehicleName: selectedVehicle?.name }));
    } else {
      try {
        const response = await ConnectionTextualCommand(selectedVehicle, newMessage.text);
        dispatch(addVehicleMessage({ text: response, vehicleKey: selectedVehicle?.key, vehicleName: selectedVehicle?.name }));
      } catch (error) {
        console.error('[MessagesScreen] Error sending command:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        dispatch(addVehicleMessage({ text: `Error: ${errorMessage}`, vehicleKey: selectedVehicle?.key, vehicleName: selectedVehicle?.name }));
      }
    }
  }

  if (selectedVehicle == null) { return null }
  return (
    <KeyboardAvoidingView style={{ flex: 1, marginBottom: insets.bottom }}>
      <GiftedChat
        messages={messages}
        timeFormat="LT"
        showUserAvatar={true}
        dateFormat="ddd D MMMM, YYYY"
        onSend={m => onSend(m[0])}
        user={{
          _id: "APP_"+selectedVehicle.key,
          name: "command",
        }}
        renderAvatar={(props) => {
          const currentMessage = props.currentMessage

          if (currentMessage.user._id == "*") {
            return (
              <Icon source={"broadcast"} size={30} />
            )
          }
          if (currentMessage.user.name == "command") {
            return (
              <Icon source={"keyboard"} size={30} />
            )
          }
          const loadedImage = useSelector(generateFindVehicleSelector(currentMessage.user._id as string))?.image

          if (loadedImage) {
            return (
              <View style={{ width: 30, height: 30, marginRight: 0, justifyContent: 'center', alignItems: 'center' }}>
                <VehicleSideImage image={loadedImage} />
              </View>
            )
          }
          return (
            <Icon source={"car"} size={20} />
          )
        }
        }
      />
    </KeyboardAvoidingView>
  )
}
