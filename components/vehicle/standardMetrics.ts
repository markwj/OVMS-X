import { prefetch } from "expo-router/build/global-state/routing"
import { MetricType } from "./metrics"

export const SM_STALE_NONE = 0
export const SM_STALE_MIN = 10
export const SM_STALE_MID = 120
export const SM_STALE_HIGH = 3000
export const SM_STALE_MAX = 65535

export const STANDARD_METRICS = [
  //
  //OVMS module metrics
  //
  { key: "m.version", type: MetricType.STRING },
  { key: "m.hardware", type: MetricType.STRING },
  { key: "m.serial", type: MetricType.STRING },
  { key: "m.tasks", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "m.freeram", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "m.monotonic", unit: "seconds", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER, precision: 0 },
  { key: "m.timeutc", unit: "utc", staleSeconds: SM_STALE_MIN, type: MetricType.STRING },

  { key: "m.net.type", staleSeconds: SM_STALE_MAX, type: MetricType.STRING },
  { key: "m.net.sq", unit: "dbm", staleSeconds: SM_STALE_MAX, type: MetricType.NUMBER, precision: 0 },
  { key: "m.net.provider", staleSeconds: SM_STALE_MAX, type: MetricType.STRING },
  { key: "m.net.connected", type: MetricType.BOOL},
  { key: "m.net.ip", type: MetricType.BOOL},
  { key: "m.net.good_sq", type: MetricType.BOOL},
  { key: "m.net.wifi_sq", unit: "dbm", staleSeconds: SM_STALE_MAX, type: MetricType.NUMBER },
  { key: "m.net.wifi_network", staleSeconds: SM_STALE_MAX, type: MetricType.STRING },
  { key: "m.net.mdm.sq", unit: "dbm", staleSeconds: SM_STALE_MAX, type: MetricType.STRING },
  { key: "m.net.mdm.netreg", type: MetricType.STRING },
  { key: "m.net.mdm.network", staleSeconds: SM_STALE_MAX, type: MetricType.STRING },
  { key: "m.net.mdm.iccid", staleSeconds: SM_STALE_MAX, type: MetricType.STRING },
  { key: "m.net.mdm.model", staleSeconds: SM_STALE_MAX, type: MetricType.STRING },
  { key: "m.net.mdm.mode", staleSeconds: SM_STALE_MAX, type: MetricType.STRING },

  //#ifdef CONFIG_OVMS_COMP_MAX7317
  { key: "m.egpio.input", staleSeconds: SM_STALE_MAX, type: MetricType.STRING }, //Technically bitsets
  { key: "m.egpio.output", staleSeconds: SM_STALE_MAX, type: MetricType.STRING },
  { key: "m.egpio.monitor", staleSeconds: SM_STALE_MAX, type: MetricType.STRING },
  //#endif

  { key: "m.obd2ecu_on", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },

  { key: "s.v2.connected", type: MetricType.BOOL},
  { key: "s.v2.peers", type: MetricType.NUMBER, precision: 0 },

  { key: "s.v3.connected", type: MetricType.BOOL},
  { key: "s.v3.peers", type: MetricType.STRING, precision: 0 },

  { key: "v.type", type: MetricType.STRING },
  { key: "s.v.vin", type: MetricType.STRING },

  //
  //Battery power and cell metrics
  //
  { key: "v.b.soc", unit: "%", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.soh", unit: "%", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.cac", unit: "Ah", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.capacity", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.b.health", staleSeconds: SM_STALE_HIGH, type: MetricType.STRING },
  { key: "v.b.health", unit: "V", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.b.coulomb_used", unit: "Ah", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.b.coulomb_used_total", unit: "Ah", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.b.coulomb_recd", unit: "Ah", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.b.coulomb_recd_total", unit: "Ah", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.b.power", unit: "kW", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.b.consumption", unit: "Wh/k", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.b.energy_used", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.b.energy_used_total", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.b.energy_recd", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.b.energy_recd_total", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.b.range.full", unit: "km", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.range.ideal", unit: "km", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.range.est", unit: "km", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.range.speed", unit: "km/h", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.temp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },

  { key: "v.b.12v.voltage", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.12v.current", unit: "A", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.12v.voltage_ref", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.12v.voltage_alert", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },

  { key: "v.b.p.level.min", unit: "%", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.p.level.max", unit: "%", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.p.level.avg", unit: "%", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.p.level.stddev", unit: "%", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },

  { key: "v.b.p.vmin", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.p.vmax", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.p.vavg", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.p.vstddev", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.p.vstddev_max", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.p.vgrad", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },

  { key: "v.b.p.tmin", unit: "celsius", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.p.tmax", unit: "celsius", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.p.tavg", unit: "celsius", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.p.tstddev", unit: "celsius", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.b.p.tstddev_max", unit: "celsius", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },

  //These are Metric Vectors of floats
  { key: "v.b.c.voltage", unit: "V", staleSeconds: SM_STALE_HIGH }, 
  { key: "v.b.c.vmin", unit: "V", staleSeconds: SM_STALE_HIGH },
  { key: "v.b.c.vmax", unit: "V", staleSeconds: SM_STALE_HIGH },
  { key: "v.b.c.vdevmax", unit: "V", staleSeconds: SM_STALE_HIGH },
  { key: "v.b.c.valert", unit: "V", staleSeconds: SM_STALE_HIGH },

  //These are Metric Vectors of floats
  { key: "v.b.c.temp", unit: "celsius", staleSeconds: SM_STALE_HIGH },
  { key: "v.b.c.tmin", unit: "celsius", staleSeconds: SM_STALE_HIGH },
  { key: "v.b.c.tmax", unit: "celsius", staleSeconds: SM_STALE_HIGH },
  { key: "v.b.c.tdevmax", unit: "celsius", staleSeconds: SM_STALE_HIGH },
  { key: "v.b.c.talert", staleSeconds: SM_STALE_HIGH },

  //
  //Charger metrics
  //
  { key: "v.c.voltage", unit: "V", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.c.current", unit: "A", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.c.power", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.c.efficiency", unit: "%", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.c.climit", unit: "A", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.c.time", unit: "seconds", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.c.kwh", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.c.kwh_grid", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.c.kwh_grid_total", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.c.mode", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.c.timermode", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.c.timerstart", unit: "utc", staleSeconds: SM_STALE_MID, type: MetricType.STRING, precision: 0 },
  { key: "v.c.state", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.c.substate", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.c.type", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.c.pilot", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.c.inprogress", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.c.limit.range", unit: "km", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.c.limit.soc", unit: "%", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.c.duration.full", unit: "minutes", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.c.duration.range", unit: "minutes", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.c.duration.soc", unit: "minutes", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.c.duration.temp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.c.timestamp", unit: "DateLocal", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER, precision: 0 },

  { key: "v.c.12v.current", unit: "A", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.c.12v.power", unit: "W", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.c.12v.temp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.c.12v.voltage", unit: "V", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },

  //
  //Power generator role metrics
  //
  { key: "v.g.voltage", unit: "V", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.g.current", unit: "A", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.g.power", unit: "kW", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.g.efficiency", unit: "%", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.g.climit", unit: "A", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.g.time", unit: "seconds", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.g.kwh", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.g.kwh_grid", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.g.kwh_grid_total", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.g.mode", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.g.timermode", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.g.timerstart", unit: "utc", staleSeconds: SM_STALE_MID, type: MetricType.STRING, precision: 0 },
  { key: "v.g.state", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.g.substate", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.g.type", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.g.pilot", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.g.inprogress", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.g.limit.range", unit: "km", staleSeconds: SM_STALE_HIGH, type: MetricType.BOOL },
  { key: "v.g.limit.soc", unit: "%", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.g.duration.empty", unit: "minutes", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.g.duration.range", unit: "km", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.g.duration.soc", unit: "minutes", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.g.temp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.g.timestamp", unit: "DateLocal", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },

  //
  //Motor inverstor/controller metrics
  //
  { key: "v.i.temp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.i.power", unit: "kW", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.i.efficiency", unit: "%", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },

  //
  //Motor metrics
  //
  { key: "v.m.rpm", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.m.temp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },

  //
  //Doors & ports metrics
  //
  { key: "v.d.fl", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.d.fr", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.d.rl", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.d.rr", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.d.chargeport", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.d.hood", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.d.trunk", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },

  //
  //Environmental & general vehicle state metrics
  //
  { key: "v.e.aux12", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.e.charging12", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.e.awake12", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.e.on", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.e.drivemode", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.e.gear", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.e.throttle", unit: "%", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.e.footbrake", unit: "%", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.e.handbrake", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.e.reggenbrake", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.e.cooling", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.e.heating", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.e.hvac", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.e.locked", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.e.valet", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.e.headlights", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.e.alarm", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.e.parktime", unit: "seconds", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.e.drivetime", unit: "seconds", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.e.ctrl.login", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.e.ctrl.config", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },

  { key: "v.e.temp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.e.cabintemp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.e.cabinfan", unit: "%", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0},
  { key: "v.e.cabinsetpoint", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.e.cabinintake", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.e.cabinvent", staleSeconds: SM_STALE_MID, type: MetricType.STRING },

  { key: "v.e.service.range", unit: "km", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.e.service.time", unit: "DateLocal", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },

  //
  //Position/movement metrics
  //
  { key: "v.p.gpslock", staleSeconds: SM_STALE_MIN, type: MetricType.BOOL },
  { key: "v.p.gpsmode", staleSeconds: SM_STALE_MIN, type: MetricType.STRING },
  { key: "v.p.gpshdop", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER },
  { key: "v.p.satcount", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER, precision: 0 },
  { key: "v.p.gpssq", unit: "%", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER, precision: 0 },
  { key: "v.p.gpstime", unit: "DateLocal", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER, precision: 0 },
  { key: "v.p.latitude", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER, precision: 6 },
  { key: "v.p.longitude", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER, precision: 6 },
  { key: "v.p.location", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.p.direction", unit: "degrees", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER },
  { key: "v.p.altitude", unit: "m", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER },
  { key: "v.p.speed", unit: "km/h", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER },
  { key: "v.p.acceleration", unit: "m/s^2", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER },
  { key: "v.p.gpsspeed", unit: "km/h", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER },
  { key: "v.p.odometer", unit: "km", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.p.trip", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.p.valet.latitude", staleSeconds: SM_STALE_NONE, type: MetricType.NUMBER, precision: 6 },
  { key: "v.p.valet.longitude", staleSeconds: SM_STALE_NONE, type: MetricType.NUMBER, precision: 6 },
  { key: "v.p.valet.distance", unit: "m", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },

  //
  //TMPS: tyre monitoring metrics
  //
  { key: "v.tp.fl.t", unit: "celsius", type: MetricType.NUMBER },
  { key: "v.tp.fr.t", unit: "celsius", type: MetricType.NUMBER },
  { key: "v.tp.rr.t", unit: "celsius", type: MetricType.NUMBER },
  { key: "v.tp.rl.t", unit: "celsius", type: MetricType.NUMBER },
  { key: "v.tp.fl.p", unit: "kPa", type: MetricType.NUMBER },
  { key: "v.tp.fr.p", unit: "kPa", type: MetricType.NUMBER },
  { key: "v.tp.rr.p", unit: "kPa", type: MetricType.NUMBER },
  { key: "v.tp.rl.p", unit: "kPa", type: MetricType.NUMBER },

  //These are Metric Vectors of floats
  { key: "v.t.pressure", unit: "kPa", staleSeconds: SM_STALE_HIGH },
  { key: "v.t.temp", unit: "celsius", staleSeconds: SM_STALE_HIGH },
  { key: "v.t.health", unit: "%", staleSeconds: SM_STALE_HIGH },
  { key: "v.t.alert", staleSeconds: SM_STALE_HIGH },
]
