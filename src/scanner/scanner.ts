import * as vscode from 'vscode';
import { SecretGuardConfig } from '../types';
import { shouldIgnore } from '../utils/path';
import { buildPatterns } from '../patterns/builder';
import { mapOverrideSeverity, mapPatternSeverity } from '../diagnostics/severity';

const SOURCE = "Secret Guard";

export function scanDocument(
  doc: vscode.TextDocument,
  config: SecretGuardConfig,
  diagnosticCollection: vscode.DiagnosticCollection
): void {
  if (doc.uri.scheme !== "file") return;

  if (shouldIgnore(doc.uri, config.ignorePaths)) {
    diagnosticCollection.delete(doc.uri);
    return;
  }

  const text = doc.getText();
  const diagnostics: vscode.Diagnostic[] = [];

  const override = mapOverrideSeverity(config.severity);
  const patterns = buildPatterns(config);

  for (const pattern of patterns) {
    pattern.regex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.regex.exec(text)) !== null) {
      const start = doc.positionAt(match.index);
      const end = doc.positionAt(match.index + match[0].length);
      const range = new vscode.Range(start, end);

      const sev = override ?? mapPatternSeverity(pattern.severity);

      const diagnostic = new vscode.Diagnostic(
        range,
        `[${pattern.severity}] Potential ${pattern.name} detected`,
        sev
      );
      diagnostic.source = SOURCE;
      diagnostic.code = pattern.name;

      diagnostics.push(diagnostic);

      if (diagnostics.length >= config.maxFindingsPerFile) break;

      // Prevent infinite loops with zero-width matches
      if (match.index === pattern.regex.lastIndex) {
        pattern.regex.lastIndex++;
      }
    }

    if (diagnostics.length >= config.maxFindingsPerFile) break;
  }

  diagnosticCollection.set(doc.uri, diagnostics);
}