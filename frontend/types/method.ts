export type MethodId = "grape" | "krotov" | "pontryagin" | "shortcuts";

export interface ComplexityPoint {
  n: number;
  time: number;
  space: number;
}

export interface ExampleControl {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
}

export interface ExampleSensitivity {
  fidelity: number;
  iterations: number;
  energy: number;
}

export interface MethodExampleLab {
  title: string;
  description: string;
  controls: ExampleControl[];
  baseline: {
    fidelity: number;
    iterations: number;
    energy: number;
  };
  sensitivity: Record<string, ExampleSensitivity>;
}

export interface MethodContent {
  id: MethodId;
  title: string;
  subtitle: string;
  theory: string;
  code: string;
  example: string;
  exampleLab: MethodExampleLab;
  complexity: ComplexityPoint[];
}
