import * as vscode from 'vscode';
import { SecretGuardConfig } from '../types';
import { shouldIgnore } from '../utils/path';
import { scanDocument } from '../scanner/scanner';

export async function scanWorkspace(
  config: SecretGuardConfig,
  diagnosticCollection: vscode.DiagnosticCollection
): Promise<void> {
  const exclude =
    config.ignorePaths && config.ignorePaths.length > 0
      ? `{${config.ignorePaths.join(",")}}`
      : undefined;

  const files = await vscode.workspace.findFiles("**/*", exclude);

  if (!files.length) {
    vscode.window.showInformationMessage("Secret Guard: Workspace without files");
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Secret Guard: scan in progress",
      cancellable: true,
    },
    async (progress, token) => {
      let count = 0;
      const step = 100 / files.length;

      for (const file of files) {
        if (token.isCancellationRequested) break;

        if (shouldIgnore(file, config.ignorePaths)) {
          count += 1;
          progress.report({
            increment: step,
            message: `${count}/${files.length}`
          });
          continue;
        }

        try {
          const doc = await vscode.workspace.openTextDocument(file);
          scanDocument(doc, config, diagnosticCollection);
        } catch {
          // Ignore files that cannot be opened
        }

        count += 1;
        progress.report({
          increment: step,
          message: `${count}/${files.length}`
        });
      }

      vscode.window.showInformationMessage(`Secret Guard: scanned ${count} files`);
    }
  );
}