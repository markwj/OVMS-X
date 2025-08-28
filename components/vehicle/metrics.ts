
export enum MetricDefined {
  NEVER = "never",
  FIRST = "first",
  DEFINED = "defined"
}

export enum MetricType {
  UNDEFINED = "undefined",
  BOOL = "bool",
  STRING = "string",
  NUMBER = "number"
}

export class Metric {
  value: string | null = null

  standard? : boolean;

  type: MetricType = MetricType.UNDEFINED
  unit: string | null = null
  precision: number | null = null

  staleSeconds: number | null = null
  explicitlyStale : boolean | null = null
  defined: MetricDefined = MetricDefined.NEVER
  lastModified: string | null = null

  trueStatement? : string = ""
  falseStatement? : string = ""

  constructor(options? : any) {
    this.standard = options?.standard ?? false;
    this.staleSeconds = options?.staleSeconds ?? null
    this.unit = options?.unit ?? null
    this.precision = options?.precision ?? null
    this.value = options?.value ?? null
    this.type = options?.type ?? MetricType.UNDEFINED
    this.trueStatement = options?.trueStatement ?? "true"
    this.falseStatement = options?.falseStatement ?? "false"
    this.explicitlyStale = options?.explicitlyStale ?? null
    
    if(this.value != null) {
      this.defined = MetricDefined.FIRST;
      this.lastModified = options?.currentTime ?? null;
    } else {
      this.defined = MetricDefined.NEVER;
    }
  }
}
export interface MetricRecord {
  stale: boolean
  rawValue: string
  localisedValueWithUnit: string
  localisedValue : string
  localisedUnit : string
  type: MetricType
}