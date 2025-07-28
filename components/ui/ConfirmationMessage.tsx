import { useTranslation } from "react-i18next"
import { Alert } from "react-native"

export function ConfirmationMessage(onConfirm : () => void, messageTitle : string, messageText : string, confirmButtonMessage? : string) {
  const {t} = useTranslation()

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