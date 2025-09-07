import React, { ComponentProps } from "react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { TextInput } from "react-native-paper"

export type NumberInputProps = ComponentProps<typeof TextInput> & { label: string, value: string, setValue: (value: number) => void }
export const NumberInput = (props: NumberInputProps) => {
  const [input, setInput] = useState(props.value)

  const { t } = useTranslation()

  useEffect(() => {
    setInput(props.value)
  }, [props.value])

  return (
    <TextInput
      clearButtonMode="always"
      style={{ flex: 1 }}
      dense={true}
      {...props}
      label={t(props.label)}
      value={input}
      onChangeText={setInput}
      onEndEditing={() => props.setValue(+input)} 
    />
  )
}