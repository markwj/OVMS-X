import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Stack } from "expo-router";
import { Text, TextInput, Button, SegmentedButtons, HelperText } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from "react-hook-form";

interface FormData {
  server: string;
  serverurl: string;
  port: number;
  username: string;
  password: string;
}

const SERVER_BUTTONS = [
  { value: 'api.openvehicles.com', label: 'Global' },
  { value: 'ovms.dexters-web.de', label: 'EU' },
  { value: 'other', label: 'Other' }
];

export default function NewVehicleOVMSv2() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: {
      server: 'Global',
      serverurl: 'api.openvehicles.com',
      port: '6867',
      username: '',
      password: ''
    }
  });

  const selectedServer = watch('server');

  const handleServerChange = (value: string) => {
    if (value !== 'other') {
      setValue('serverurl', value);
    } else {
      setValue('serverurl', '');
    }
    
    setValue('server', value);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      console.log('Form data:', data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text>Server</Text>
      <Controller
        control={control}
        name="server"
        render={({ field: { value } }) => (
          <SegmentedButtons
            value={value}
            onValueChange={handleServerChange}
            buttons={SERVER_BUTTONS}
          />
        )}
      />

      <Controller
        control={control}
        name="serverurl"
        rules={{ required: 'If "other" is selected, server URL is required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            label="Server URL"
            readOnly={selectedServer !== 'other'}
            onChangeText={onChange}
            placeholder="Enter server URL"
          />
        )}
      />
      <HelperText type="error" visible={typeof errors.serverurl !== 'undefined'}>
        Error: {errors.serverurl?.message}
      </HelperText>

      <Controller
        control={control}
        name="port"
        rules={{ required: 'Required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            label="Secure Websocket Port"
            onChangeText={onChange}
            placeholder="Port"
            keyboardType="numeric"
          />
        )}
      />
      <HelperText type="error" visible={typeof errors.port !== 'undefined'}>
        Error: {errors.port?.message}
      </HelperText>

      <Controller
        control={control}
        name="username"
        rules={{ required: 'Required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            label="Username"
            onChangeText={onChange}
            placeholder="Username"
          />
        )}
      />
      <HelperText type="error" visible={typeof errors.username !== 'undefined'}>
        Error: {errors.username?.message}
      </HelperText>

      <Controller
        control={control}
        name="password"
        rules={{ required: 'Required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            label="Password"
            onChangeText={onChange}
            placeholder="Password"
            secureTextEntry
          />
        )}
      />
      <HelperText type="error" visible={typeof errors.password !== 'undefined'}>
        Error: {errors.password?.message}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
      >
        Add OVMS V2 API Vehicles
      </Button>

      <Stack.Screen options={{ headerTitle: t('OVMS v2 API') }} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});