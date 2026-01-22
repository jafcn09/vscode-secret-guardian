import * as vscode from "vscode";
import { getConfig } from './config/config';
import { scanDocument } from './scanner/scanner';
import { scanWorkspace } from './commands/scanWorkspace';
import { DebounceManager } from './utils/debounce';

let diagnosticCollection: vscode.DiagnosticCollection;
const debounceManager = new DebounceManager();

export function activate(context: vscode.ExtensionContext): void {

  diagnosticCollection = vscode.languages.createDiagnosticCollection("secretGuard");
  context.subscriptions.push(diagnosticCollection);


  const scan = (doc: vscode.TextDocument) => {
    const config = getConfig();
    scanDocument(doc, config, diagnosticCollection);
  };


  const debounceScan = (doc: vscode.TextDocument) => {
    if (doc.uri.scheme !== "file") return;

    const config = getConfig();
    const key = doc.uri.toString();

    debounceManager.debounce(key, () => {
      scanDocument(doc, config, diagnosticCollection);
    }, config.debounceMs);
  };

  context.subscriptions.push(

    vscode.workspace.onDidOpenTextDocument(scan),


    vscode.workspace.onDidChangeTextDocument((e) => debounceScan(e.document)),


    vscode.workspace.onDidSaveTextDocument((doc) => {
      const config = getConfig();
      if (config.scanOnSave) {
        scanDocument(doc, config, diagnosticCollection);
      }
    }),


    vscode.workspace.onDidCloseTextDocument((doc) => {
      diagnosticCollection.delete(doc.uri);
    }),

    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("secretGuard")) {
        vscode.workspace.textDocuments.forEach(scan);
      }
    }),


    vscode.commands.registerCommand("secretGuard.scanWorkspace", () => {
      const config = getConfig();
      return scanWorkspace(config, diagnosticCollection);
    })
  );


  vscode.workspace.textDocuments.forEach(scan);

  console.log("Secret Guard extension activated");
}

export function deactivate(): void {

  debounceManager.clear();
  diagnosticCollection.clear();
  console.log("Secret Guard extension deactivated");
}