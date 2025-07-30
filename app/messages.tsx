import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react";
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addAppMessage, addVehicleMessage, selectVehicleMessages } from "@/store/messagesSlice";
import { ConnectionDisplay } from "@/components/ui/ConnectionDisplay";
import { sendCommand } from "@/app/platforms/platform";
import { CommandCode } from "@/app/platforms/commands";
import { getSelectedVehicle } from "@/store/selectionSlice";
import { VehicleConnectionState, getConnectionState } from "@/store/connectionSlice";
import { Icon, IconButton, Menu } from "react-native-paper";
import { VehicleSideImage } from "@/components/ui/VehicleImages";
import { selectVehicle } from "@/store/vehiclesSlice";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import { getCommands } from "@/store/storedCommandsSlice";

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()
  const selectedVehicle = useSelector(getSelectedVehicle)
  const connectionState = useSelector(getConnectionState)
  const messages = useSelector(selectVehicleMessages(selectedVehicle?.key ?? ""))

  const [text, setText] = useState("")

  const [commandsVisible, setCommandsVisible] = useState(false)
  const storedCommands = useSelector(getCommands)

  const { t } = useTranslation()
  const navigation = useNavigation()

  const user = {
    _id: "APP_" + (selectedVehicle?.key ?? "*"),
    name: "command",
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Menu
            visible={commandsVisible}
            onDismiss={() => setCommandsVisible(false)}
            anchor={<IconButton onPress={() => setCommandsVisible(true)} size={20} icon={'keyboard'} />}
            anchorPosition="bottom">
            {storedCommands.map((c) => <Menu.Item key={c.key} onPress={() => {
              if (c.autosend) {
                onSend({
                  _id: 0, //Overwritten in slice
                  text: c.command,
                  createdAt: new Date(),
                  user: user
                })
              } else {
                setText(c.command);
              }
              setCommandsVisible(false);
            }} title={c.name} />)}
          </Menu>
          <ConnectionDisplay />
        </View>
      )
    })
  }, [navigation, storedCommands, commandsVisible])

  const onSend = async (newMessage: IMessage) => {
    dispatch(addAppMessage({ text: newMessage.text, vehicleKey: selectedVehicle?.key }));

    if (selectedVehicle && (connectionState != VehicleConnectionState.CONNECTED)) {
      dispatch(addVehicleMessage({ text: "Vehicle is not connected", vehicleKey: selectedVehicle?.key, vehicleName: selectedVehicle?.name }));
    } else {
      try {
        const response = await sendCommand({ commandCode: CommandCode.EXECUTE_SMS_COMMAND, params: { text: newMessage.text } });
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
      <StatusBar translucent={true}></StatusBar>
      <GiftedChat
        messages={messages}
        text={text}
        onInputTextChanged={(t) => { setText(t) }}
        timeFormat="LT"
        showUserAvatar={true}
        dateFormat="ddd D MMMM, YYYY"
        onSend={m => onSend(m[0])}
        user={user}
        renderAvatar={(props) => {
          const currentMessage = props.currentMessage

          if (currentMessage.user._id == "*") {
            return (
              <Icon source={"broadcast"} size={40} />
            )
          }
          if (currentMessage.user.name == "command") {
            return (
              <Icon source={"keyboard"} size={40} />
            )
          }
          const loadedImage = useSelector(selectVehicle(currentMessage.user._id as string))?.image

          if (loadedImage) {
            return (
              <View style={{ width: 40, height: 40, marginRight: 0, justifyContent: 'flex-end', alignItems: 'center' }}>
                <VehicleSideImage image={loadedImage} />
              </View>
            )
          }
          return (
            <Icon source={"car"} size={40} />
          )
        }
        }
      />
    </KeyboardAvoidingView>
  )
}
