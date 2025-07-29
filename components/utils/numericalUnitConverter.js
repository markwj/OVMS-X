import configureMeasurements from 'convert-units';

import time from 'convert-units/definitions/time'
import speed from 'convert-units/definitions/speed'
import length from 'convert-units/definitions/length'
import temperature from 'convert-units/definitions/temperature'
import voltage from 'convert-units/definitions/voltage'
import current from 'convert-units/definitions/current'
import energy from 'convert-units/definitions/energy'
import acceleration from 'convert-units/definitions/acceleration'
import pressure from 'convert-units/definitions/pressure'
import power from 'convert-units/definitions/power'

import charge from 'convert-units/definitions/charge'

/*
  Viable units are:
    Length
    * nm * μm * mm * cm * m * km * in * yd * ft-us * ft * fathom * mi * nMi
    Temperature
    * C * F * K * R (degrees Rankine)
    Time
    * ns * mu * ms * s * min * h * d * week * month * year
    Speed
    * m/s * km/h * mph * knot * ft/s * in/h * mm/h
    Pressure
    * Pa * hPa * kPa * MPa * bar * torr * mH2O * mmHg * psi * ksi
    Voltage
    * V * mV * kV
    Current
    * A * mA * kA
    Energy
    * Ws * Wm * Wh * mWh * kWh * MWh * GWh * J * kJ * MJ * GJ
    Charge
    * c * mC * μC * nC * pC * Ah
    Acceleration
    * g (g-force) * m/s2 * g0 (Standard Gravity)
    Consumption
    * Wh/km
*/

const customMeasures = {
  temperature: {
    ...temperature,
    systems: {
      ...temperature.systems,
      metric: {
        ...temperature.systems.metric,
        '°C': {
          name: {
            singular: 'Celsius',
            plural: 'Celsius',
          },
          to_anchor: 1,
          anchor_shift: 0,
        },
      },
      imperial: {
        ...temperature.systems.imperial,
        '°F': {
          name: {
            singular: 'Fahrenheit',
            plural: 'Fahrenheit',
          },
          to_anchor: 1
        },
      }
    }
  },
  charge: {
    systems: {
      SI: {
        ...charge.systems.SI,
        Ah: {
          name: {
            singular: 'Amphour',
            plural: 'Amphours'
          },
          to_anchor: 3600 //Anchor is 1 Coulumb
        }
      }
    }
  },
  consumption: {
    systems: {
      metric: {
        'Wh/km': {
          name: {
            singular: 'Watthour per kilometer',
            plural: 'Watthours per kilometer'
          },
          to_anchor: 1
        },
      }
    }
  },
  power: {
    systems: {
      ...power.systems,
      dBm: {
        dBm: {
          name: {
            singular: "Decibel-milliwatt",
            plural: "Decibel-milliwatts"
          },
          to_anchor: 1
        }
      },
      SQ: {
        SQ: {
          name: {
            singular: "SQ",
            plural: "SQ"
          },
          to_anchor: 1
        }
      }
    },
    anchors: {
      metric: {
        ...power.anchors.metric,
        dBm: {
          transform: (v) => {
            return 10 * Math.log10(1000 * v)
          }
        },
        SQ: {
          transform: (v) => {
            v = 10 * Math.log10(1000 * v)
            if (v <= -51) { return Math.round((v + 113) / 2) }
            return 0
          }
        }
      },
      imperial: {
        ...power.anchors.imperial,
        dBm: {
          transform: (v) => {
            v = v / 0.737562149
            return 10 * Math.log10(1000 * v)
          }
        },
        SQ: {
          transform: (v) => {
            v = v / 0.737562149
            v = 10 * Math.log10(1000 * v)
            if (v <= -51) { return Math.round((v + 113) / 2) }
            return 0
          }
        }
      },
      dBm: {
        metric: {
          transform: (v) => {
            return (10 ** (v / 10)) / 1000
          }
        },
        imperial: {
          transform: (v) => {
            return (10 ** (v / 10)) / 1000 * 0.737562149
          }
        },
        SQ: {
          transform: (v) => {
            if (v <= -51) { return Math.round((v + 113) / 2) }
            return 0
          }
        }
      },
      SQ: {
        metric: {
          transform: (v) => {
            v = v <= 31 ? Math.round(v * 2 - 113) : 0
            return (10 ** (v / 10)) / 1000
          }
        },
        imperial: {
          transform: (v) => {
            v = v <= 31 ? Math.round(v * 2 - 113) : 0
            return (10 ** (v / 10)) / 1000 * 0.737562149
          }
        },
        dBm: {
          transform: (v) => {
            if (v <= 31) { return Math.round(v * 2 - 113) }
            return 0
          }
        }
      }
    }
  }
}

export const numericalUnitConvertor = configureMeasurements({
  ...customMeasures,
  time,
  speed,
  length,
  voltage,
  current,
  energy,
  acceleration,
  pressure
});

export function GetUnitAbbr(name) {
  if (name == null) { return name }

  const measures = numericalUnitConvertor().list()
  for (const m of measures) {
    if ([m.abbr, m.singular, m.plural].includes(name)) {
      return m.abbr
    }
  }
  return name
}