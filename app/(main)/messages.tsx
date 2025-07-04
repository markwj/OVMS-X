import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useState, useCallback } from "react";
import { GiftedChat } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView, View } from "react-native";

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState([])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

  return (
    <KeyboardAvoidingView style={{ flex: 1, marginBottom: insets.bottom }}>
      <GiftedChat
        messages={messages}
        timeFormat="LT"
        dateFormat="ddd D MMMM, YYYY"
        multiline={false}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </KeyboardAvoidingView>
  )
}
