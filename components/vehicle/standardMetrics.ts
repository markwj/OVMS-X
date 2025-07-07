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
  { key: "m.version", type: MetricType.STRING },
  { key: "m.hardware", type: MetricType.STRING },
  { key: "m.serial", type: MetricType.STRING },
  { key: "m.tasks", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "m.freeram", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "m.monotonic", unit: "seconds", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER, precision: 0 },
  { key: "m.timeutc", unit: "utc", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER },

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
  { key: "v.bat.soc", unit: "%", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.soh", unit: "%", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.cac", unit: "Ah", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.capacity", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.bat.health", staleSeconds: SM_STALE_HIGH, type: MetricType.STRING },
  { key: "v.bat.health", unit: "V", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.bat.coulomb_used", unit: "Ah", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.bat.coulomb_used_total", unit: "Ah", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.bat.coulomb_recd", unit: "Ah", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.bat.coulomb_recd_total", unit: "Ah", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.bat.power", unit: "kW", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.bat.consumption", unit: "Wh/k", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.bat.energy_used", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.bat.energy_used_total", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.bat.energy_recd", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.bat.energy_recd_total", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.bat.range.full", unit: "km", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.range.ideal", unit: "km", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.range.est", unit: "km", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.range.speed", unit: "km/h", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.temp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },

  { key: "v.bat.12v.voltage", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.12v.current", unit: "A", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.12v.voltage_ref", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.12v.voltage_alert", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },

  { key: "v.bat.pack.level.min", unit: "%", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.pack.level.max", unit: "%", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.pack.level.avg", unit: "%", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.pack.level.stddev", unit: "%", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },

  { key: "v.bat.pack.vmin", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.pack.vmax", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.pack.vavg", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.pack.vstddev", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.pack.vstddev_max", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.pack.vgrad", unit: "V", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },

  { key: "v.bat.pack.tmin", unit: "celsius", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.pack.tmax", unit: "celsius", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.pack.tavg", unit: "celsius", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.pack.tstddev", unit: "celsius", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.bat.pack.tstddev_max", unit: "celsius", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },

  //These are Metric Vectors of floats
  { key: "v.bat.cell.voltage", unit: "V", staleSeconds: SM_STALE_HIGH }, 
  { key: "v.bat.cell.vmin", unit: "V", staleSeconds: SM_STALE_HIGH },
  { key: "v.bat.cell.vmax", unit: "V", staleSeconds: SM_STALE_HIGH },
  { key: "v.bat.cell.vdevmax", unit: "V", staleSeconds: SM_STALE_HIGH },
  { key: "v.bat.cell.valert", unit: "V", staleSeconds: SM_STALE_HIGH },

  //These are Metric Vectors of floats
  { key: "v.bat.cell.temp", unit: "celsius", staleSeconds: SM_STALE_HIGH },
  { key: "v.bat.cell.tmin", unit: "celsius", staleSeconds: SM_STALE_HIGH },
  { key: "v.bat.cell.tmax", unit: "celsius", staleSeconds: SM_STALE_HIGH },
  { key: "v.bat.cell.tdevmax", unit: "celsius", staleSeconds: SM_STALE_HIGH },
  { key: "v.bat.cell.talert", staleSeconds: SM_STALE_HIGH },

  //
  //Charger metrics
  //
  { key: "v.charge.voltage", unit: "V", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.charge.current", unit: "A", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.charge.power", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.charge.efficiency", unit: "%", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.charge.climit", unit: "A", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.charge.time", unit: "seconds", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.charge.kwh", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.charge.kwh_grid", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.charge.kwh_grid_total", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.charge.mode", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.charge.timermode", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.charge.timerstart", unit: "utc", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.charge.state", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.charge.substate", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.charge.type", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.charge.pilot", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.charge.inprogress", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.charge.limit.range", unit: "km", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.charge.limit.soc", unit: "%", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.charge.duration.full", unit: "minutes", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.charge.duration.range", unit: "minutes", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.charge.duration.soc", unit: "minutes", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.charge.duration.temp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.charge.timestamp", unit: "DateLocal", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER, precision: 0 },

  { key: "v.charge.12v.current", unit: "A", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.charge.12v.power", unit: "W", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.charge.12v.temp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.charge.12v.voltage", unit: "V", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },

  //
  //Power generator role metrics
  //
  { key: "v.gen.voltage", unit: "V", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.gen.current", unit: "A", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.gen.power", unit: "kW", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.gen.efficiency", unit: "%", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.gen.climit", unit: "A", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.gen.time", unit: "seconds", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.gen.kwh", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.gen.kwh_grid", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.gen.kwh_grid_total", unit: "kWh", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.gen.mode", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.gen.timermode", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.gen.timerstart", unit: "utc", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.gen.state", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.gen.substate", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.gen.type", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.gen.pilot", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.gen.inprogress", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.gen.limit.range", unit: "km", staleSeconds: SM_STALE_HIGH, type: MetricType.BOOL },
  { key: "v.gen.limit.soc", unit: "%", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },
  { key: "v.gen.duration.empty", unit: "minutes", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.gen.duration.range", unit: "km", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.gen.duration.soc", unit: "minutes", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.gen.temp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.gen.timestamp", unit: "DateLocal", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },

  //
  //Motor inverstor/controller metrics
  //
  { key: "v.inv.temp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.inv.power", unit: "kW", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.inv.efficiency", unit: "%", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },

  //
  //Motor metrics
  //
  { key: "v.mot.rpm", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.mot.temp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },

  //
  //Doors & ports metrics
  //
  { key: "v.door.fl", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.door.fr", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.door.rl", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.door.rr", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.door.chargeport", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.door.hood", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.door.trunk", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },

  //
  //Environmental & general vehicle state metrics
  //
  { key: "v.env.aux12", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.env.charging12", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.env.awake12", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.env.on", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.env.drivemode", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.env.gear", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.env.throttle", unit: "%", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.env.footbrake", unit: "%", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.env.handbrake", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.env.reggenbrake", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.env.cooling", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.env.heating", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.env.hvac", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.env.locked", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.env.valet", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.env.headlights", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.env.alarm", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.env.parktime", unit: "seconds", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.env.drivetime", unit: "seconds", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.env.ctrl.login", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },
  { key: "v.env.ctrl.config", staleSeconds: SM_STALE_MID, type: MetricType.BOOL },

  { key: "v.env.temp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.env.cabintemp", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.env.cabinfan", unit: "%", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0},
  { key: "v.env.cabinsetpoint", unit: "celsius", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.env.cabinintake", staleSeconds: SM_STALE_MID, type: MetricType.STRING },
  { key: "v.env.cabinvent", staleSeconds: SM_STALE_MID, type: MetricType.STRING },

  { key: "v.env.service.range", unit: "km", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },
  { key: "v.env.service.time", unit: "DateLocal", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER, precision: 0 },

  //
  //Position/movement metrics
  //
  { key: "v.pos.gpslock", staleSeconds: SM_STALE_MIN, type: MetricType.BOOL },
  { key: "v.pos.gpsmode", staleSeconds: SM_STALE_MIN, type: MetricType.STRING },
  { key: "v.pos.gpshdop", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER },
  { key: "v.pos.satcount", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER, precision: 0 },
  { key: "v.pos.gpssq", unit: "%", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER, precision: 0 },
  { key: "v.pos.gpstime", unit: "DateLocal", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER, precision: 0 },
  { key: "v.pos.latitude", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER, precision: 6 },
  { key: "v.pos.longitude", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER, precision: 6 },
  { key: "v.pos.location", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.pos.directon", unit: "degrees", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER },
  { key: "v.pos.altitude", unit: "m", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER },
  { key: "v.pos.speed", unit: "km/h", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER },
  { key: "v.pos.acceleration", unit: "m/s^2", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER },
  { key: "v.pos.gpsspeed", unit: "km/h", staleSeconds: SM_STALE_MIN, type: MetricType.NUMBER },
  { key: "v.pos.odometer", unit: "km", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.pos.trip", staleSeconds: SM_STALE_MID, type: MetricType.NUMBER },
  { key: "v.pos.valet.latitude", staleSeconds: SM_STALE_NONE, type: MetricType.NUMBER, precision: 6 },
  { key: "v.pos.valet.longitude", staleSeconds: SM_STALE_NONE, type: MetricType.NUMBER, precision: 6 },
  { key: "v.pos.valet.distance", unit: "m", staleSeconds: SM_STALE_HIGH, type: MetricType.NUMBER },

  //
  //TMPS: tyre monitoring metrics
  //These are Metric Vectors of floats
  //
  { key: "v.tpms.pressure", unit: "kPa", staleSeconds: SM_STALE_HIGH },
  { key: "v.tpms.temp", unit: "celsius", staleSeconds: SM_STALE_HIGH },
  { key: "v.tpms.health", unit: "%", staleSeconds: SM_STALE_HIGH },
  { key: "v.tpms.alert", staleSeconds: SM_STALE_HIGH },
]
