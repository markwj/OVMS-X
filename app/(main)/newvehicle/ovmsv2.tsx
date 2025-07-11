import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { Stack } from "expo-router";
import { Text, TextInput, Button, SegmentedButtons, HelperText } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from "react-hook-form";
import { useHeaderHeight } from '@react-navigation/elements'
import { useGetMessagesQuery, closeWebSocket } from "@/store/ovmsv2wsApi";
import { useDispatch } from "react-redux";
import { vehiclesSlice } from "@/store/vehiclesSlice";

interface FormData {
  server: string;
  serverurl: string;
  port: string;
  username: string;
  password: string;
  vehicleid: string;
}

const SERVER_BUTTONS = [
  { value: 'api.openvehicles.com', label: 'Global' },
  { value: 'ovms.dexters-web.de', label: 'EU' },
  { value: 'other', label: 'Other' }
];

export default function NewVehicleOVMSv2() {
  const height = useHeaderHeight()
  const { t } = useTranslation();
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [shouldConnect, setShouldConnect] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: {
      server: 'api.openvehicles.com',
      serverurl: 'api.openvehicles.com',
      port: '6870',
      username: '',
      password: '',
      vehicleid: ''
    }
  });

  const {
    data: messages,
    error,
    isFetching,
    isLoading: isLoadingMessages,
  } = useGetMessagesQuery(
    {
      'serverurl': 'wss://' + watch('serverurl') + ':' + watch('port') + '/apiv2',
      'username': watch('username'),
      'password': watch('password'),
      'vehicleid': (watch('vehicleid') !== '') ? watch('vehicleid') : '*'
    },
    { skip: !shouldConnect } // Only execute when shouldConnect is true
  )

  // Debug logging
  React.useEffect(() => {
    console.log('[ovmsv2] Query state:', { shouldConnect, isFetching, isLoading: isLoadingMessages, error, messagesCount: messages?.length })
  }, [shouldConnect, isFetching, isLoadingMessages, error, messages])

    // Check for specific messages and close WebSocket if needed
  React.useEffect(() => {
    console.log('[ovmsv2] Messages changed:', messages)
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      console.log('[ovmsv2] Checking message:', lastMessage)
      
      // Example: Close WebSocket when receiving a specific message type
      if (lastMessage.type === 'MP-S' && lastMessage.params.includes('1')) {
        console.log('[ovmsv2] Authentication successful, closing WebSocket')
        closeWebSocket()
        // Don't set shouldConnect to false - keep the query active to see messages
      }
    }
  }, [messages])

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
      // Enable the query to establish the WebSocket connection
      setShouldConnect(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={height + 100}
        enabled={true}
        style={styles.container}>

        <ScrollView style={styles.scrollview}>

          <Text>{t('Server')}</Text>
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
                label={t('Server URL')}
                readOnly={selectedServer !== 'other'}
                onChangeText={onChange}
                placeholder={t('Enter server URL')}
              />
            )}
          />
          {(typeof errors.serverurl !== 'undefined') &&
            <HelperText type="error" visible={typeof errors.serverurl !== 'undefined'}>
              Error: {errors.serverurl?.message}
            </HelperText>
          }

          <View style={styles.gap}></View>

          <Controller
            control={control}
            name="port"
            rules={{ required: 'Required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                label={t('Secure Websocket Port')}
                onChangeText={onChange}
                placeholder={t('Port')}
                keyboardType="numeric"
                autoComplete="off"
                clearButtonMode="always"
                inputMode="numeric"
                autoCapitalize="none"
              />
            )}
          />
          {(typeof errors.port !== 'undefined') &&
            <HelperText type="error" visible={typeof errors.port !== 'undefined'}>
              Error: {errors.port?.message}
            </HelperText>
          }

          <View style={styles.gap}></View>

          <Controller
            control={control}
            name="username"
            rules={{ required: 'Required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                label={t('Username')}
                onChangeText={onChange}
                placeholder={t('Username')}
                autoComplete="username"
                clearButtonMode="always"
                inputMode="text"
                autoCapitalize="none"
              />
            )}
          />
          {(typeof errors.username !== 'undefined') &&
            <HelperText type="error" visible={typeof errors.username !== 'undefined'}>
              Error: {errors.username?.message}
            </HelperText>
          }

          <View style={styles.gap}></View>

          <Controller
            control={control}
            name="password"
            rules={{ required: 'Required' }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                label={t('Password')}
                onChangeText={onChange}
                placeholder={t('Password')}
                secureTextEntry={!passwordVisible}
                right={<TextInput.Icon
                  icon={passwordVisible ? "eye-off" : "eye"}
                  onPress={() => setPasswordVisible(!passwordVisible)} />}
                autoComplete="current-password"
                clearButtonMode="always"
                inputMode="text"
                autoCapitalize="none"
              />
            )}
          />
          {(typeof errors.password !== 'undefined') &&
            <HelperText type="error" visible={typeof errors.password !== 'undefined'}>
              Error: {errors.password?.message}
            </HelperText>
          }

          <View style={styles.gap}></View>

          <Controller
            control={control}
            name="vehicleid"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                label={t('Vehicle ID (or blank for all)')}
                onChangeText={onChange}
                placeholder={t('Vehicle ID')}
                clearButtonMode="always"
                inputMode="text"
                autoCapitalize="none" />
            )}
          />
          {(typeof errors.vehicleid !== 'undefined') &&
            <HelperText type="error" visible={typeof errors.vehicleid !== 'undefined'}>
              Error: {errors.vehicleid?.message}
            </HelperText>
          }

          <View style={styles.gap}></View>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
          >
            {t('Add Vehicles')}
          </Button>

        </ScrollView>

      </KeyboardAvoidingView>

      <Stack.Screen options={{ headerTitle: t('OVMS v2 API') }} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
    flexDirection: 'column',
    gap: 20,
    padding: 20
  },
  gap: {
    height: 20
  }
});