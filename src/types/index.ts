export interface SecretPattern {
  name: string;
  regex: RegExp;
  severity: "HIGH" | "MEDIUM" | "LOW";
}

export interface CustomPatternConfig {
  name: string;
  pattern: string;
  flags?: string;
  severity?: "HIGH" | "MEDIUM" | "LOW";
}

export interface SecretGuardConfig {
  severity: "error" | "warning" | "info";
  customPatterns: CustomPatternConfig[];
  ignorePaths: string[];
  maxFindingsPerFile: number;
  scanOnSave: boolean;
  debounceMs: number;
}