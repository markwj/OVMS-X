import { selectMetricsKeys } from "@/store/metricsSlice";
import React, { useState, ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { AutocompleteDropdown, AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { HelperText, TextInput, useTheme } from "react-native-paper";
import { useSelector } from "react-redux";


export type MetricInputProps = Omit<ComponentProps<typeof AutocompleteDropdown>, "dataSet"> & { value: string, setValue: (s: string) => void }
export const MetricInput = (props: MetricInputProps) => {
  const theme = useTheme()
  const { t } = useTranslation()

  const [formValue, setFormValue] = useState(props.value)

  const keys = useSelector(selectMetricsKeys)
  const filteredKeys = keys.filter((k) => k.includes(formValue))

  return (
    <View style={{ flex: 1, flexDirection: 'column'}}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <AutocompleteDropdownContextProvider>
            <AutocompleteDropdown
              {...props}
              clearOnFocus={false}
              direction="down"
              emptyResultText=""
              inputContainerStyle={{ backgroundColor: "transparent" }}
              dataSet={filteredKeys.map((k) => ({ id: k, title: k }))}
              onChangeText={(t) => { setFormValue(t) }}
              onClear={() => { setFormValue(""); props.setValue("") }}
              onSelectItem={(i) => { setFormValue(i?.id ?? ""); props.setValue(i?.id ?? "") }}
              InputComponent={TextInput}
              EmptyResultComponent={<View />}
              suggestionsListContainerStyle={{
                backgroundColor: theme.colors.surfaceVariant,
                borderWidth: 2,
                borderColor: 'black',
                position: 'absolute',
                left: -45,
                top: -5
              }}
              textInputProps={{ style: { marginRight: 20 }, autoCapitalize: 'none', autoCorrect: false, onEndEditing: () => { props.setValue(formValue) } }}
              initialValue={props.value}
            >
            </AutocompleteDropdown>
          </AutocompleteDropdownContextProvider>
        </View>
      </View>
      <View style={{ flexDirection: 'row', padding: 0 }}>
        {!keys.includes(formValue) && (
          <HelperText type={"error"}>
            {t("Undefined metric")}
          </HelperText>
        )}
      </View>
    </View>
  )
}