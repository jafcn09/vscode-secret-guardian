import { SecretPattern, SecretGuardConfig } from '../types';
import { PATTERNS } from './patterns';

export function buildPatterns(config: SecretGuardConfig): SecretPattern[] {
  const customs: SecretPattern[] = [];

  for (const p of config.customPatterns) {
    if (!p?.name || !p?.pattern) continue;
    try {
      const flagsRaw = (p.flags || "g").trim();
      const flags = flagsRaw.includes("g") ? flagsRaw : `${flagsRaw}g`;
      customs.push({
        name: p.name,
        regex: new RegExp(p.pattern, flags),
        severity: p.severity ?? "MEDIUM",
      });
    } catch {
      // Ignore invalid regex patterns
      continue;
    }
  }

  return [...PATTERNS, ...customs];
}