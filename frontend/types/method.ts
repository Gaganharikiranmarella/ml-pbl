export type MethodId = "grape" | "krotov" | "pontryagin" | "shortcuts";

export interface ComplexityPoint {
  n: number;
  time: number;
  space: number;
}

export interface MethodContent {
  id: MethodId;
  title: string;
  subtitle: string;
  theory: string;
  code: string;
  example: string;
  complexity: ComplexityPoint[];
}
