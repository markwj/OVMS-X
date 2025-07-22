import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { Stack, router } from "expo-router";
import { Text, TextInput, Button, SegmentedButtons, HelperText } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from "react-hook-form";
import { useHeaderHeight } from '@react-navigation/elements'
import { useGetMessagesQuery, closeWebSocket } from "@/store/ovmsv2wsApi";
import { useDispatch } from "react-redux";
import { vehiclesSlice } from "@/store/vehiclesSlice";
import { useLazyGetVehiclesQuery } from "@/store/ovmsv2httpApi";
import { VehicleTypes } from "@/components/ui/VehicleImages";

interface FormData {
  server: string;
  serverurl: string;
  httpsport: string;
  wssport: string;
  username: string;
  password: string;
}

const SERVER_BUTTONS = [
  { value: 'api.openvehicles.com', label: 'Global' },
  { value: 'ovms.dexters-web.de', label: 'EU' },
  { value: 'other', label: 'Other' }
];

// Function to generate a random color
const generateRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#F9E79F', '#ABEBC6', '#FAD7A0', '#AED6F1', '#D5A6BD'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Function to generate a random vehicle type
const generateRandomVehicleType = (): string => {
  const vehicleTypeKeys = Object.keys(VehicleTypes);
  return vehicleTypeKeys[Math.floor(Math.random() * vehicleTypeKeys.length)];
};

export default function NewPlatformOVMSv2() {
  const height = useHeaderHeight()
  const { t } = useTranslation();
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormData>({
    defaultValues: {
      server: 'api.openvehicles.com',
      serverurl: 'api.openvehicles.com',
      httpsport: '6869',
      wssport: '6870',
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

  const [getVehicles, { data: vehicleRecords, error, isFetching: isFetchingLists, isLoading: isLoadingLists }] = useLazyGetVehiclesQuery();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Construct the HTTPS URL
      const httpsUrl = `https://${data.serverurl}:${data.httpsport}/api/vehicles`;
      
      // Call the API with the form data
      const result = await getVehicles({
        url: httpsUrl,
        username: data.username,
        password: data.password
      }).unwrap();
      
      console.log('getVehicles result', result);
      // Handle the response - add vehicles to the store
      if (result && Array.isArray(result)) {
        result.forEach((vehicle: any) => {
          // Transform the API response to match the Vehicle interface
          const newVehicle = {
            key: `ovmsv2api:${data.serverurl}:${data.httpsport}:${data.wssport}:${data.username}:${vehicle.id}`,
            name: vehicle.id,
            vin: '',
            platform: 'ovmsv2api',
            platformKey: `ovmsv2api:${data.serverurl}:${data.httpsport}:${data.wssport}:${data.username}`,
            platformParameters: {
              server: data.serverurl,
              httpsport: data.httpsport,
              wssport: data.wssport,
              username: data.username,
              password: data.password,
              id: vehicle.id
            },
            image: {
              imageName: generateRandomVehicleType(),
              tintColor: generateRandomColor(),
              customPath: null
            }
          };
          
          dispatch(vehiclesSlice.actions.addVehicle(newVehicle));
        });
      }
      
      // Navigate back to main screen after successful addition
      setTimeout(() => {
        router.back();
      }, 1500);
      
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      // Handle error - show error message to user
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
                autoComplete="url"
                clearButtonMode="always"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
              />
            )}
          />
          {(typeof errors.serverurl !== 'undefined') &&
            <HelperText type="error" visible={typeof errors.serverurl !== 'undefined'}>
              Error: {errors.serverurl?.message}
            </HelperText>
          }

          <View style={styles.gap}></View>

          <View style={{ flexDirection: 'row', gap: 10 }}>

            <View style={{ flex: 1, flexGrow: 1 }}>
              <Controller
                control={control}
                name="httpsport"
                rules={{ 
                  required: 'Required',
                  min: { value: 1, message: 'Port must be at least 1' },
                  max: { value: 65535, message: 'Port must be at most 65535' },
                  pattern: { value: /^[1-9]\d{0,4}$/, message: 'Port must be between 1 and 65535' }
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    label={t('HTTPS Port')}
                    onChangeText={(text) => {
                      // Only allow numeric input and limit to 5 digits
                      const numericText = text.replace(/[^0-9]/g, '');
                      if (numericText.length <= 5) {
                        onChange(numericText);
                      }
                    }}
                    placeholder={t('HTTPS Port')}
                    keyboardType="numeric"
                    autoComplete="off"
                    clearButtonMode="always"
                    inputMode="numeric"
                    autoCapitalize="none"
                  />
                )}
              />
              {(typeof errors.httpsport !== 'undefined') &&
                <HelperText type="error" visible={typeof errors.httpsport !== 'undefined'}>
                  Error: {errors.httpsport?.message}
                </HelperText>
              }
            </View>

            <View style={{ flex: 1, flexGrow: 1 }}>
              <Controller
                control={control}
                name="wssport"
                rules={{ 
                  required: 'Required',
                  min: { value: 1, message: 'Port must be at least 1' },
                  max: { value: 65535, message: 'Port must be at most 65535' },
                  pattern: { value: /^[1-9]\d{0,4}$/, message: 'Port must be between 1 and 65535' }
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    label={t('WSS Port')}
                    onChangeText={(text) => {
                      // Only allow numeric input and limit to 5 digits
                      const numericText = text.replace(/[^0-9]/g, '');
                      if (numericText.length <= 5) {
                        onChange(numericText);
                      }
                    }}
                    placeholder={t('WSS Port')}
                    keyboardType="numeric"
                    autoComplete="off"
                    clearButtonMode="always"
                    inputMode="numeric"
                    autoCapitalize="none"
                  />
                )}
              />
              {(typeof errors.wssport !== 'undefined') &&
                <HelperText type="error" visible={typeof errors.wssport !== 'undefined'}>
                  Error: {errors.wssport?.message}
                </HelperText>
              }
            </View>

          </View>

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
                autoCorrect={false}
                spellCheck={false}
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
                autoCorrect={false}
                spellCheck={false}
              />
            )}
          />
          {(typeof errors.password !== 'undefined') &&
            <HelperText type="error" visible={typeof errors.password !== 'undefined'}>
              Error: {errors.password?.message}
            </HelperText>
          }

          <View style={styles.gap}></View>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading || isLoadingLists}
            disabled={isLoading || isLoadingLists}
          >
            {t('Add Vehicles')}
          </Button>

          {error && (
            <HelperText type="error" visible={true}>
              Error: {'status' in error ? `HTTP ${error.status}` : error.message || 'Failed to fetch vehicles'}
            </HelperText>
          )}

          {vehicleRecords && vehicleRecords.length > 0 && (
            <HelperText type="info" visible={true}>
              Successfully loaded {vehicleRecords.length} vehicle(s)
            </HelperText>
          )}

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