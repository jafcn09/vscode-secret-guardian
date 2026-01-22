import * as vscode from 'vscode';
import * as path from 'path';

export function normalizeSlash(p: string): string {
  return p.replace(/\\/g, "/");
}

export function globToRegExp(glob: string): RegExp {
  const g = normalizeSlash(glob).trim();
  const escaped = g.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  const withStars = escaped
    .replace(/\\\*\\\*/g, "<<<TWOSTAR>>>")
    .replace(/\\\*/g, "[^/]*")
    .replace(/<<<TWOSTAR>>>/g, ".*");
  return new RegExp(`^${withStars}$`, "i");
}

export function shouldIgnore(uri: vscode.Uri, ignorePaths: string[]): boolean {
  if (!ignorePaths || ignorePaths.length === 0) return false;

  const ws = vscode.workspace.getWorkspaceFolder(uri);
  if (!ws) return false;

  const rel = normalizeSlash(path.relative(ws.uri.fsPath, uri.fsPath));
  if (!rel || rel.startsWith("../") || rel === "..") return false;

  for (const pattern of ignorePaths) {
    if (!pattern) continue;
    const re = globToRegExp(pattern);
    if (re.test(rel)) return true;
  }
  return false;
}