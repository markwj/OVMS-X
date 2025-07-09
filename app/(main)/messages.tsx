import BottomSheet from "@gorhom/bottom-sheet";
import React, { useEffect, useState, useCallback } from "react";
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAvoidingView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { selectMessages, addAppMessage } from "@/store/messagesSlice";

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()

  const messages = useSelector(selectMessages)

  const onSend = (newMessage : IMessage) => {
    dispatch(addAppMessage({text : newMessage.text, currentTime : Date.now()}));
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
