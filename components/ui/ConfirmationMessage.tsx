import { Alert } from "react-native"

export function ConfirmationMessage(onConfirm : () => void, messageTitle : string, messageText : string, confirmButtonMessage? : string) {
  return (Alert.alert(messageTitle, messageText, [
    {
      text: "Cancel"
    },
    {
      text: confirmButtonMessage ?? "Confirm",
      onPress: onConfirm,
      style: 'cancel'
    }
  ]))
}