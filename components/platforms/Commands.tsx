
// Standard Commands
export enum CommandCode {
  REQUEST_FEATURE_LIST = 1,           // Params: none; result: none
  SET_FEATURE = 2,                    // Params: feature, value
  REQUEST_PARAMETER_LIST = 3,         // Params: none; Result: none
  SET_PARAMETER = 4,                  // Params: parameter, value,
  REBOOT = 5,                         // Params: none; Result: none
  CHARGE_ALERT = 6,                   // Params: none; Result: none
  EXECUTE_SMS_COMMAND = 7,            // Params: text; Result: string
  SET_CHARGE_MODE = 10,               // Params: mode ('standard', 'storage', 'range', 'performance'); Result: none
  START_CHARGE = 11,                  // Params: none; Result: none
  STOP_CHARGE = 12,                   // Params: none; Result: none
  SET_CHARGE_CURRENT = 15,            // Params: current (specified in Amps); Result: none
  SET_CHARGE_MODE_AND_CURRENT = 16,   // Params: mode ('standard', 'storage', 'range', 'performance'), current (specified in Amps); Result: none
  SET_CHARGE_TIMER_MODE_TIME = 17,    // Params: timer ('plugin', 'timer'), start (HH:MM format); Result: none
  WAKEUP_CAR = 18,                    // Params: none; Result: none
  WAKEUP_TEMPERATURE_SUBSYSTEM = 19,  // Params: none; Result: none
  LOCK_CAR = 20,                      // Params: pin; Result: none
  ACTIVATE_VALET_MODE = 21,           // Params: pin; Result: none
  UNLOCK_CAR = 22,                    // Params: pin; Result: none
  DEACTIVATE_VALET_MODE = 23,         // Params: pin; Result: none
  HOME_LINK = 24,                     // Params: button (0, 1 or 2); Result: none
  COOLDOWN = 30,                      // Params: none; Result: none
  REQUEST_GPRS_UTILIZATION_DATA = 31, // Params: none
  REQUEST_HISTORICAL_SUMMARY = 32,    // Params: since (optional timestamp condition); Result: none
  REQUEST_HISTORICAL_RECORDS = 32,    // Params: type (the record type to retrieve), since (optional timestamp condition); Result: none
  SEND_SMS = 40,                      // Params: number (telephone number to send sms to), message (sms message to be sent); Result: none
  SEND_USSD_CODE = 41,                // Params: ussdcode (the ussd code to send); Result: none
  SEND_RAW_AT_COMMAND = 49,           // Params: atcommand (the AT command to send - including the AT prefix); Result: none
}