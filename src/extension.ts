import * as vscode from "vscode";

interface SecretPattern {
  name: string;
  regex: RegExp;
  severity: "HIGH" | "MEDIUM" | "LOW";
}

const PATTERNS: SecretPattern[] = [
  { name: "AWS Access Key", regex: /AKIA[0-9A-Z]{16}/g, severity: "HIGH" },
  {
    name: "AWS Secret Key",
    regex: /(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/g,
    severity: "HIGH",
  },
  {
    name: "GitHub Token",
    regex: /gh[pousr]_[A-Za-z0-9_]{36,}/g,
    severity: "HIGH",
  },
  {
    name: "GitLab Token",
    regex: /glpat-[A-Za-z0-9\-_]{20,}/g,
    severity: "HIGH",
  },
  {
    name: "Slack Token",
    regex: /xox[baprs]-[0-9A-Za-z\-]{10,}/g,
    severity: "HIGH",
  },
  {
    name: "Stripe Key",
    regex: /sk_live_[0-9a-zA-Z]{24,}/g,
    severity: "HIGH",
  },
  {
    name: "OpenAI Key",
    regex: /sk-[A-Za-z0-9]{48,}/g,
    severity: "HIGH",
  },
  {
    name: "Google API Key",
    regex: /AIza[0-9A-Za-z\-_]{35}/g,
    severity: "HIGH",
  },
  {
    name: "Azure Key",
    regex: /[A-Za-z0-9/+]{86}==/g,
    severity: "MEDIUM",
  },
  {
    name: "Private Key",
    regex: /-----BEGIN\s+(RSA|EC|DSA|OPENSSH)?\s*PRIVATE KEY-----/g,
    severity: "HIGH",
  },
  {
    name: "JWT Token",
    regex: /eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g,
    severity: "MEDIUM",
  },
  {
    name: "Generic Secret",
    regex:
      /(?:password|secret|api[_-]?key|token|credential)[\s]*[=:]["']?\s*[^\s"']{8,}/gi,
    severity: "MEDIUM",
  },
  {
    name: "Database URL",
    regex: /(?:mysql|postgres|mongodb|redis):\/\/[^\s"']+:[^\s"']+@[^\s"']+/gi,
    severity: "HIGH",
  },
  {
    name: "Anthropic Key",
    regex: /sk-ant-[A-Za-z0-9\-_]{90,}/g,
    severity: "HIGH",
  },
  {
    name: "Twilio Key",
    regex: /SK[0-9a-fA-F]{32}/g,
    severity: "HIGH",
  },
  {
    name: "SendGrid Key",
    regex: /SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}/g,
    severity: "HIGH",
  },
  {
    name: "NPM Token",
    regex: /npm_[A-Za-z0-9]{36}/g,
    severity: "HIGH",
  },
  {
    name: "Heroku Key",
    regex:
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g,
    severity: "LOW",
  },
];

interface SecretGuardConfig {
  severity: "error" | "warning" | "info";
  customPatterns: { name: string; pattern: string; severity?: "HIGH" | "MEDIUM" | "LOW" }[];
  ignorePaths: string[];
}

let diagnosticCollection: vscode.DiagnosticCollection;
let debounceTimers = new Map<string, NodeJS.Timeout>();

export function activate(context: vscode.ExtensionContext): void {
  diagnosticCollection = vscode.languages.createDiagnosticCollection("secretGuard");
  context.subscriptions.push(diagnosticCollection);

  const scan = (doc: vscode.TextDocument) => scanDocument(doc, getConfig());

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(scan),
    vscode.workspace.onDidChangeTextDocument((e) => debounceScan(e.document, 300)),
    vscode.workspace.onDidCloseTextDocument((doc) => diagnosticCollection.delete(doc.uri)),
    vscode.commands.registerCommand("secretGuard.scanWorkspace", () => scanWorkspace())
  );

  vscode.workspace.textDocuments.forEach(scan);
}

function getConfig(): SecretGuardConfig {
  const config = vscode.workspace.getConfiguration("secretGuard");
  return {
    severity: config.get<SecretGuardConfig["severity"]>("severity", "error"),
    customPatterns: config.get<SecretGuardConfig["customPatterns"]>("customPatterns", []),
    ignorePaths: config.get<string[]>("ignorePaths", []),
  };
}

function debounceScan(doc: vscode.TextDocument, delay: number): void {
  const key = doc.uri.toString();
  const existing = debounceTimers.get(key);
  if (existing) {
    clearTimeout(existing);
  }
  const timeout = setTimeout(() => {
    debounceTimers.delete(key);
    scanDocument(doc, getConfig());
  }, delay);
  debounceTimers.set(key, timeout);
}

function shouldIgnore(uri: vscode.Uri, ignorePaths: string[]): boolean {
  const path = uri.fsPath;
  if (!ignorePaths || ignorePaths.length === 0) {
    return false;
  }
  return ignorePaths.some((pattern) => {
    const regex = new RegExp(pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*"));
    return regex.test(path);
  });
}

function scanDocument(doc: vscode.TextDocument, config: SecretGuardConfig): void {
  if (shouldIgnore(doc.uri, config.ignorePaths)) {
    return;
  }

  const text = doc.getText();
  const diagnostics: vscode.Diagnostic[] = [];

  const severityOverrideMap: Record<SecretGuardConfig["severity"], vscode.DiagnosticSeverity> =
    {
      error: vscode.DiagnosticSeverity.Error,
      warning: vscode.DiagnosticSeverity.Warning,
      info: vscode.DiagnosticSeverity.Information,
    };

  const severityByPattern: Record<SecretPattern["severity"], vscode.DiagnosticSeverity> = {
    HIGH: vscode.DiagnosticSeverity.Error,
    MEDIUM: vscode.DiagnosticSeverity.Warning,
    LOW: vscode.DiagnosticSeverity.Information,
  };

  const allPatterns: SecretPattern[] = [
    ...PATTERNS,
    ...config.customPatterns.map((p) => ({
      name: p.name,
      regex: new RegExp(p.pattern, "g"),
      severity: p.severity ?? "MEDIUM",
    })),
  ];

  for (const pattern of allPatterns) {
    pattern.regex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.regex.exec(text)) !== null) {
      const start = doc.positionAt(match.index);
      const end = doc.positionAt(match.index + match[0].length);
      const range = new vscode.Range(start, end);

      const severity =
        severityOverrideMap[config.severity] ?? severityByPattern[pattern.severity];

      const diagnostic = new vscode.Diagnostic(
        range,
        `[${pattern.severity}] Potential ${pattern.name} detected`,
        severity
      );
      diagnostic.source = "Secret Guard";
      diagnostic.code = pattern.name;
      diagnostics.push(diagnostic);
    }
  }

  diagnosticCollection.set(doc.uri, diagnostics);
}

async function scanWorkspace(): Promise<void> {
  const config = getConfig();
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
        if (token.isCancellationRequested) {
          break;
        }
        try {
          const doc = await vscode.workspace.openTextDocument(file);
          scanDocument(doc, config);
          count += 1;
          progress.report({
            increment: step,
            message: `${count}/${files.length}`,
          });
        } catch {
          // ignore
        }
      }

      vscode.window.showInformationMessage(`Secret Guard: scanned ${count} files`);
    }
  );
}

export function deactivate(): void {
  debounceTimers.forEach((t) => clearTimeout(t));
  debounceTimers.clear();
  diagnosticCollection.clear();
}
