import * as vscode from 'vscode';
import { SecretGuardConfig, SecretPattern } from '../types';

export function mapOverrideSeverity(s: SecretGuardConfig["severity"]): vscode.DiagnosticSeverity {
  if (s === "warning") return vscode.DiagnosticSeverity.Warning;
  if (s === "info") return vscode.DiagnosticSeverity.Information;
  return vscode.DiagnosticSeverity.Error;
}

export function mapPatternSeverity(s: SecretPattern["severity"]): vscode.DiagnosticSeverity {
  if (s === "LOW") return vscode.DiagnosticSeverity.Information;
  if (s === "MEDIUM") return vscode.DiagnosticSeverity.Warning;
  return vscode.DiagnosticSeverity.Error;
}