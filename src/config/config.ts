import * as vscode from 'vscode';
import { SecretGuardConfig } from '../types';

export function getConfig(): SecretGuardConfig {
  const config = vscode.workspace.getConfiguration("secretGuard");
  return {
    severity: config.get<SecretGuardConfig["severity"]>("severity", "error"),
    customPatterns: config.get<SecretGuardConfig["customPatterns"]>("customPatterns", []),
    ignorePaths: config.get<string[]>("ignorePaths", [
      "**/node_modules/**",
      "**/.git/**",
      "**/dist/**",
      "**/out/**"
    ]),
    maxFindingsPerFile: Math.max(1, Number(config.get<number>("maxFindingsPerFile", 200))),
    scanOnSave: Boolean(config.get<boolean>("scanOnSave", true)),
    debounceMs: Math.max(50, Number(config.get<number>("debounceMs", 300))),
  };
}