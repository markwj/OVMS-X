
export enum MetricDefined {
  NEVER = "never",
  FIRST = "first",
  DEFINED = "defined"
}

export enum MetricType {
  UNDEFINED = 0,
  BOOL = 1,
  STRING = 2,
  NUMBER = 3
}

export class Metric {
  value: string | null = null

  standard? : boolean;

  type: MetricType = MetricType.UNDEFINED
  unit: string | null = null
  precision: number | null = null

  staleSeconds: number | null = null
  defined: MetricDefined = MetricDefined.NEVER
  lastModified: Date | null = null

  trueStatement? : string = ""
  falseStatement? : string = ""

  constructor(options? : any) {
    this.standard = options?.standard ?? false;
    this.staleSeconds = options?.staleSeconds ?? null
    this.unit = options?.unit ?? null
    this.precision = options?.precision ?? null
    this.value = options?.value ?? null
    this.trueStatement = options?.trueStatement ?? null
    this.falseStatement = options?.falseStatement ?? null
    
    if(this.value != null) {
      this.defined = MetricDefined.FIRST;
      this.lastModified = options?.currentTime ?? null;
    } else {
      this.defined = MetricDefined.NEVER;
    }
  }
}