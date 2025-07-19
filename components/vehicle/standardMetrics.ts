import { prefetch } from "expo-router/build/global-state/routing"
import { MetricType } from "./metrics"

export const STANDARD_METRICS = [
  //
  //OVMS module metrics
  //
  { key: "m.version", type: MetricType.STRING },
  { key: "m.hardware", type: MetricType.STRING },
  { key: "m.serial", type: MetricType.STRING },
  { key: "m.tasks", type: MetricType.NUMBER, precision: 0 },
  { key: "m.freeram", type: MetricType.NUMBER, precision: 0 },
  { key: "m.monotonic", unit: "s", type: MetricType.NUMBER, precision: 0 },
  { key: "m.timeutc", unit: "utc", type: MetricType.STRING },

  { key: "m.net.type", type: MetricType.STRING },
  { key: "m.net.sq", unit: "dBm", type: MetricType.NUMBER, precision: 0 },
  { key: "m.net.provider", type: MetricType.STRING },
  { key: "m.net.connected", type: MetricType.BOOL },
  { key: "m.net.ip", type: MetricType.BOOL },
  { key: "m.net.good_sq", type: MetricType.BOOL },
  { key: "m.net.wifi_sq", unit: "dBm", type: MetricType.NUMBER },
  { key: "m.net.wifi_network", type: MetricType.STRING },
  { key: "m.net.mdm.sq", unit: "dBm", type: MetricType.STRING },
  { key: "m.net.mdm.netreg", type: MetricType.STRING },
  { key: "m.net.mdm.network", type: MetricType.STRING },
  { key: "m.net.mdm.iccid", type: MetricType.STRING },
  { key: "m.net.mdm.model", type: MetricType.STRING },
  { key: "m.net.mdm.mode", type: MetricType.STRING },

  //#ifdef CONFIG_OVMS_COMP_MAX7317
  { key: "m.egpio.input", type: MetricType.STRING }, //Technically bitsets
  { key: "m.egpio.output", type: MetricType.STRING },
  { key: "m.egpio.monitor", type: MetricType.STRING },
  //#endif

  { key: "m.obd2ecu_on", type: MetricType.BOOL, trueStatement: "yes", falseStatement: "no" },

  { key: "s.v2.connected", type: MetricType.BOOL, trueStatement: "yes", falseStatement: "no" },
  { key: "s.v2.peers", type: MetricType.NUMBER, precision: 0 },

  { key: "s.v3.connected", type: MetricType.BOOL, trueStatement: "yes", falseStatement: "no" },
  { key: "s.v3.peers", type: MetricType.STRING, precision: 0 },

  { key: "v.type", type: MetricType.STRING },
  { key: "v.vin", type: MetricType.STRING },

  //
  //Battery power and cell metrics
  //
  { key: "v.b.soc", unit: "%", type: MetricType.NUMBER },
  { key: "v.b.soh", unit: "%", type: MetricType.NUMBER },
  { key: "v.b.cac", unit: "Ah", type: MetricType.NUMBER },
  { key: "v.b.capacity", unit: "Ah", type: MetricType.NUMBER },
  { key: "v.b.health", type: MetricType.STRING },
  { key: "v.b.voltage", unit: "V", type: MetricType.NUMBER },
  { key: "v.b.coulomb_used", unit: "Ah", type: MetricType.NUMBER },
  { key: "v.b.coulomb_used_total", unit: "Ah", type: MetricType.NUMBER },
  { key: "v.b.coulomb_recd", unit: "Ah", type: MetricType.NUMBER },
  { key: "v.b.coulomb_recd_total", unit: "Ah", type: MetricType.NUMBER },
  { key: "v.b.power", unit: "kW", type: MetricType.NUMBER },
  { key: "v.b.consumption", unit: "Wh/km", type: MetricType.NUMBER },
  { key: "v.b.energy_used", unit: "kWh", type: MetricType.NUMBER },
  { key: "v.b.energy_used_total", unit: "kWh", type: MetricType.NUMBER },
  { key: "v.b.energy_recd", unit: "kWh", type: MetricType.NUMBER },
  { key: "v.b.energy_recd_total", unit: "kWh", type: MetricType.NUMBER },
  { key: "v.b.range.full", unit: "km", type: MetricType.NUMBER },
  { key: "v.b.range.ideal", unit: "km", type: MetricType.NUMBER },
  { key: "v.b.range.est", unit: "km", type: MetricType.NUMBER },
  { key: "v.b.range.speed", unit: "km/h", type: MetricType.NUMBER },
  { key: "v.b.temp", unit: "C", type: MetricType.NUMBER },

  { key: "v.b.12v.voltage", unit: "V", type: MetricType.NUMBER },
  { key: "v.b.12v.current", unit: "A", type: MetricType.NUMBER },
  { key: "v.b.12v.voltage_ref", unit: "V", type: MetricType.NUMBER },
  { key: "v.b.12v.voltage_alert", type: MetricType.BOOL, trueStatement: "yes", falseStatement: "no" },

  { key: "v.b.p.level.min", unit: "%", type: MetricType.NUMBER },
  { key: "v.b.p.level.max", unit: "%", type: MetricType.NUMBER },
  { key: "v.b.p.level.avg", unit: "%", type: MetricType.NUMBER },
  { key: "v.b.p.level.stddev", unit: "%", type: MetricType.NUMBER },

  { key: "v.b.p.vmin", unit: "V", type: MetricType.NUMBER },
  { key: "v.b.p.vmax", unit: "V", type: MetricType.NUMBER },
  { key: "v.b.p.vavg", unit: "V", type: MetricType.NUMBER },
  { key: "v.b.p.vstddev", unit: "V", type: MetricType.NUMBER },
  { key: "v.b.p.vstddev_max", unit: "V", type: MetricType.NUMBER },
  { key: "v.b.p.vgrad", unit: "V", type: MetricType.NUMBER },

  { key: "v.b.p.tmin", unit: "C", type: MetricType.NUMBER },
  { key: "v.b.p.tmax", unit: "C", type: MetricType.NUMBER },
  { key: "v.b.p.tavg", unit: "C", type: MetricType.NUMBER },
  { key: "v.b.p.tstddev", unit: "C", type: MetricType.NUMBER },
  { key: "v.b.p.tstddev_max", unit: "C", type: MetricType.NUMBER },

  //These are Metric Vectors of floats
  { key: "v.b.c.voltage", unit: "V",  },
  { key: "v.b.c.vmin", unit: "V",  },
  { key: "v.b.c.vmax", unit: "V",  },
  { key: "v.b.c.vdevmax", unit: "V",  },
  { key: "v.b.c.valert", unit: "V",  },

  //These are Metric Vectors of floats
  { key: "v.b.c.temp", unit: "C",  },
  { key: "v.b.c.tmin", unit: "C",  },
  { key: "v.b.c.tmax", unit: "C",  },
  { key: "v.b.c.tdevmax", unit: "C",  },
  { key: "v.b.c.talert",  },

  //
  //Charger metrics
  //
  { key: "v.c.voltage", unit: "V", type: MetricType.NUMBER },
  { key: "v.c.current", unit: "A", type: MetricType.NUMBER },
  { key: "v.c.power", unit: "kW", type: MetricType.NUMBER },
  { key: "v.c.efficiency", unit: "%", type: MetricType.NUMBER },
  { key: "v.c.climit", unit: "A", type: MetricType.NUMBER },
  { key: "v.c.time", unit: "s", type: MetricType.NUMBER },
  { key: "v.c.kwh", unit: "kWh", type: MetricType.NUMBER },
  { key: "v.c.kwh_grid", unit: "kWh", type: MetricType.NUMBER },
  { key: "v.c.kwh_grid_total", unit: "kWh", type: MetricType.NUMBER },
  { key: "v.c.mode", type: MetricType.STRING },
  { key: "v.c.timermode", type: MetricType.BOOL, trueStatement: "yes", falseStatement: "no" },
  { key: "v.c.timerstart", unit: "utc", type: MetricType.STRING, precision: 0 },
  { key: "v.c.state", type: MetricType.STRING },
  { key: "v.c.substate", type: MetricType.STRING },
  { key: "v.c.type", type: MetricType.STRING },
  { key: "v.c.pilot", type: MetricType.BOOL, trueStatement: "yes", falseStatement: "no" },
  { key: "v.c.inprogress", type: MetricType.BOOL, trueStatement: "yes", falseStatement: "no" },
  { key: "v.c.limit.range", unit: "km", type: MetricType.NUMBER },
  { key: "v.c.limit.soc", unit: "%", type: MetricType.NUMBER },
  { key: "v.c.duration.full", unit: "min", type: MetricType.NUMBER, precision: 0 },
  { key: "v.c.duration.range", unit: "min", type: MetricType.NUMBER, precision: 0 },
  { key: "v.c.duration.soc", unit: "min", type: MetricType.NUMBER, precision: 0 },
  { key: "v.c.duration.temp", unit: "C", type: MetricType.NUMBER },
  { key: "v.c.timestamp", unit: "DateLocal", type: MetricType.NUMBER, precision: 0 },

  { key: "v.c.12v.current", unit: "A", type: MetricType.NUMBER },
  { key: "v.c.12v.power", unit: "W", type: MetricType.NUMBER },
  { key: "v.c.12v.temp", unit: "C", type: MetricType.NUMBER },
  { key: "v.c.12v.voltage", unit: "V", type: MetricType.NUMBER },

  //
  //Power generator role metrics
  //
  { key: "v.g.voltage", unit: "V", type: MetricType.NUMBER },
  { key: "v.g.current", unit: "A", type: MetricType.NUMBER },
  { key: "v.g.power", unit: "kW", type: MetricType.NUMBER },
  { key: "v.g.efficiency", unit: "%", type: MetricType.NUMBER },
  { key: "v.g.climit", unit: "A", type: MetricType.NUMBER },
  { key: "v.g.time", unit: "s", type: MetricType.NUMBER, precision: 0 },
  { key: "v.g.kwh", unit: "kWh", type: MetricType.NUMBER },
  { key: "v.g.kwh_grid", unit: "kWh", type: MetricType.NUMBER },
  { key: "v.g.kwh_grid_total", unit: "kWh", type: MetricType.NUMBER },
  { key: "v.g.mode", type: MetricType.STRING },
  { key: "v.g.timermode", type: MetricType.BOOL, trueStatement: "yes", falseStatement: "no" },
  { key: "v.g.timerstart", unit: "utc", type: MetricType.STRING, precision: 0 },
  { key: "v.g.state", type: MetricType.STRING },
  { key: "v.g.substate", type: MetricType.STRING },
  { key: "v.g.type", type: MetricType.STRING },
  { key: "v.g.pilot", type: MetricType.BOOL, trueStatement: "yes", falseStatement: "no" },
  { key: "v.g.inprogress", type: MetricType.NUMBER },
  { key: "v.g.limit.range", unit: "km", type: MetricType.BOOL, trueStatement: "yes", falseStatement: "no" },
  { key: "v.g.limit.soc", unit: "%", type: MetricType.NUMBER },
  { key: "v.g.duration.empty", unit: "min", type: MetricType.NUMBER, precision: 0 },
  { key: "v.g.duration.range", unit: "km", type: MetricType.NUMBER, precision: 0 },
  { key: "v.g.duration.soc", unit: "min", type: MetricType.NUMBER, precision: 0 },
  { key: "v.g.temp", unit: "C", type: MetricType.NUMBER },
  { key: "v.g.timestamp", unit: "DateLocal", type: MetricType.NUMBER },

  //
  //Motor inverstor/controller metrics
  //
  { key: "v.i.temp", unit: "C", type: MetricType.NUMBER },
  { key: "v.i.power", unit: "kW", type: MetricType.NUMBER },
  { key: "v.i.efficiency", unit: "%", type: MetricType.NUMBER },

  //
  //Motor metrics
  //
  { key: "v.m.rpm", type: MetricType.NUMBER, precision: 0 },
  { key: "v.m.temp", unit: "C", type: MetricType.NUMBER },

  //
  //Doors & ports metrics
  //
  { key: "v.d.fl", type: MetricType.BOOL, trueStatement: "open", falseStatement: "closed" },
  { key: "v.d.fr", type: MetricType.BOOL, trueStatement: "open", falseStatement: "closed" },
  { key: "v.d.rl", type: MetricType.BOOL, trueStatement: "open", falseStatement: "closed" },
  { key: "v.d.rr", type: MetricType.BOOL, trueStatement: "open", falseStatement: "closed" },
  { key: "v.d.chargeport", type: MetricType.BOOL, trueStatement: "open", falseStatement: "closed" },
  { key: "v.d.hood", type: MetricType.BOOL, trueStatement: "open", falseStatement: "closed" },
  { key: "v.d.trunk", type: MetricType.BOOL, trueStatement: "open", falseStatement: "closed" },

  //
  //Environmental & general vehicle state metrics
  //
  { key: "v.e.aux12", type: MetricType.BOOL, trueStatement: "on", falseStatement: "off" },
  { key: "v.e.charging12", type: MetricType.BOOL, trueStatement: "on", falseStatement: "off" },
  { key: "v.e.awake12", type: MetricType.BOOL, trueStatement: "awake", falseStatement: "sleeping" },
  { key: "v.e.on", type: MetricType.BOOL, trueStatement: "on", falseStatement: "off" },
  { key: "v.e.drivemode", type: MetricType.NUMBER, precision: 0 },
  { key: "v.e.gear", type: MetricType.NUMBER, precision: 0 },
  { key: "v.e.throttle", unit: "%", type: MetricType.NUMBER },
  { key: "v.e.footbrake", unit: "%", type: MetricType.NUMBER },
  { key: "v.e.handbrake", type: MetricType.BOOL, trueStatement: "on", falseStatement: "off" },
  { key: "v.e.reggenbrake", type: MetricType.BOOL },
  { key: "v.e.cooling", type: MetricType.BOOL, trueStatement: "on", falseStatement: "off" },
  { key: "v.e.heating", type: MetricType.BOOL, trueStatement: "on", falseStatement: "off" },
  { key: "v.e.hvac", type: MetricType.BOOL, trueStatement: "on", falseStatement: "off" },
  { key: "v.e.locked", type: MetricType.BOOL, trueStatement: "locked", falseStatement: "unlocked" },
  { key: "v.e.valet", type: MetricType.BOOL, trueStatement: "yes", falseStatement: "no" },
  { key: "v.e.headlights", type: MetricType.BOOL, trueStatement: "on", falseStatement: "off" },
  { key: "v.e.alarm", type: MetricType.BOOL, trueStatement: "on", falseStatement: "off" },
  { key: "v.e.parktime", unit: "s", type: MetricType.NUMBER, precision: 0 },
  { key: "v.e.drivetime", unit: "s", type: MetricType.NUMBER, precision: 0 },
  { key: "v.e.ctrl.login", type: MetricType.BOOL, trueStatement: "yes", falseStatement: "no" },
  { key: "v.e.ctrl.config", type: MetricType.BOOL, trueStatement: "yes", falseStatement: "no" },

  { key: "v.e.temp", unit: "C", type: MetricType.NUMBER },
  { key: "v.e.cabintemp", unit: "C", type: MetricType.NUMBER },
  { key: "v.e.cabinfan", unit: "%", type: MetricType.NUMBER, precision: 0 },
  { key: "v.e.cabinsetpoint", unit: "C", type: MetricType.NUMBER },
  { key: "v.e.cabinintake", type: MetricType.STRING },
  { key: "v.e.cabinvent", type: MetricType.STRING },

  { key: "v.e.service.range", unit: "km", type: MetricType.NUMBER, precision: 0 },
  { key: "v.e.service.time", unit: "DateLocal", type: MetricType.NUMBER, precision: 0 },

  //
  //Position/movement metrics
  //
  { key: "v.p.gpslock", type: MetricType.BOOL, trueStatement: "yes", falseStatement: "no" },
  { key: "v.p.gpsmode", type: MetricType.STRING },
  { key: "v.p.gpshdop", type: MetricType.NUMBER },
  { key: "v.p.satcount", type: MetricType.NUMBER, precision: 0 },
  { key: "v.p.gpssq", unit: "%", type: MetricType.NUMBER, precision: 0 },
  { key: "v.p.gpstime", unit: "DateLocal", type: MetricType.NUMBER, precision: 0 },
  { key: "v.p.latitude", type: MetricType.NUMBER, precision: 6 },
  { key: "v.p.longitude", type: MetricType.NUMBER, precision: 6 },
  { key: "v.p.location", type: MetricType.NUMBER },
  { key: "v.p.direction", unit: "degrees", type: MetricType.NUMBER },
  { key: "v.p.altitude", unit: "m", type: MetricType.NUMBER },
  { key: "v.p.speed", unit: "km/h", type: MetricType.NUMBER },
  { key: "v.p.acceleration", unit: "m/s2", type: MetricType.NUMBER },
  { key: "v.p.gpsspeed", unit: "km/h", type: MetricType.NUMBER },
  { key: "v.p.odometer", unit: "km", type: MetricType.NUMBER },
  { key: "v.p.trip", unit: "km", type: MetricType.NUMBER },
  { key: "v.p.valet.latitude", type: MetricType.NUMBER, precision: 6 },
  { key: "v.p.valet.longitude", type: MetricType.NUMBER, precision: 6 },
  { key: "v.p.valet.distance", unit: "m", type: MetricType.NUMBER },

  //
  //TMPS: tyre monitoring metrics
  //
  { key: "v.tp.fl.t", unit: "C", type: MetricType.NUMBER, precision: 1 },
  { key: "v.tp.fr.t", unit: "C", type: MetricType.NUMBER, precision: 1 },
  { key: "v.tp.rr.t", unit: "C", type: MetricType.NUMBER, precision: 1 },
  { key: "v.tp.rl.t", unit: "C", type: MetricType.NUMBER, precision: 1 },
  { key: "v.tp.fl.p", unit: "kPa", type: MetricType.NUMBER, precision: 0 },
  { key: "v.tp.fr.p", unit: "kPa", type: MetricType.NUMBER, precision: 0 },
  { key: "v.tp.rr.p", unit: "kPa", type: MetricType.NUMBER, precision: 0 },
  { key: "v.tp.rl.p", unit: "kPa", type: MetricType.NUMBER, precision: 0 },

  //These are Metric Vectors of floats
  { key: "v.t.pressure", unit: "kPa",  },
  { key: "v.t.temp", unit: "C",  },
  { key: "v.t.health", unit: "%",  },
  { key: "v.t.alert",  },
]
