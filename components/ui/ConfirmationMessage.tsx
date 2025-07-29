import { useTranslation } from "react-i18next"
import { Alert } from "react-native"

export function ConfirmationMessage(t: any, onConfirm : () => void, messageTitle : string, messageText : string, confirmButtonMessage? : string) {
  return (Alert.alert(t(messageTitle), t(messageText), [
    {
      text: t("Cancel")
    },
    {
      text: t(confirmButtonMessage ?? "Confirm"),
      onPress: onConfirm,
      style: 'cancel'
    }
  ]))
}