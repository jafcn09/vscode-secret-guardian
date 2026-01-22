import { SecretPattern } from '../types';

export const PATTERNS: SecretPattern[] = [
  {
    name: "AWS Access Key",
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
    severity: "HIGH"
  },
  {
    name: "AWS Secret Key",
    regex: /(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/g,
    severity: "HIGH",
  },
  {
    name: "GitHub Token",
    regex: /\bgh[pousr]_[A-Za-z0-9_]{36,255}\b/g,
    severity: "HIGH",
  },
  {
    name: "GitLab Token",
    regex: /\bglpat-[A-Za-z0-9\-_]{20,255}\b/g,
    severity: "HIGH",
  },
  {
    name: "Slack Token",
    regex: /\bxox[baprs]-[0-9A-Za-z\-]{10,48}\b/g,
    severity: "HIGH",
  },
  {
    name: "Stripe Key",
    regex: /\bsk_(live|test)_[0-9a-zA-Z]{10,255}\b/g,
    severity: "HIGH",
  },
  {
    name: "OpenAI Key",
    regex: /\bsk-[A-Za-z0-9]{20,255}\b/g,
    severity: "HIGH",
  },
  {
    name: "Google API Key",
    regex: /\bAIza[0-9A-Za-z\-_]{35}\b/g,
    severity: "HIGH",
  },
  {
    name: "Azure Key",
    regex: /\b[A-Za-z0-9/+]{86}==\b/g,
    severity: "MEDIUM",
  },
  {
    name: "Private Key Block",
    regex:
      /-----BEGIN\s+(?:RSA|EC|DSA|OPENSSH)?\s*PRIVATE KEY-----[\s\S]*?-----END\s+(?:RSA|EC|DSA|OPENSSH)?\s*PRIVATE KEY-----/g,
    severity: "HIGH",
  },
  {
    name: "JWT Token",
    regex: /\beyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\b/g,
    severity: "MEDIUM",
  },
  {
    name: "Generic Secret",
    regex:
      /(?:password|secret|api[_-]?key|token|credential)\s*[=:]\s*["']?\s*[^\s"']{8,}/gi,
    severity: "MEDIUM",
  },
  {
    name: "Database URL",
    regex: /\b(mysql|postgres(ql)?|mongodb(\+srv)?|redis):\/\/[^\s"']+\b/gi,
    severity: "HIGH",
  },
  {
    name: "Anthropic Key",
    regex: /\bsk-ant-[A-Za-z0-9\-_]{10,255}\b/g,
    severity: "HIGH",
  },
  {
    name: "Twilio Key",
    regex: /\bSK[0-9a-fA-F]{32}\b/g,
    severity: "HIGH",
  },
  {
    name: "SendGrid Key",
    regex: /\bSG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
    severity: "HIGH",
  },
  {
    name: "NPM Token",
    regex: /\bnpm_[A-Za-z0-9]{36,}\b/g,
    severity: "HIGH",
  },
  {
    name: "Heroku Key",
    regex:
      /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g,
    severity: "LOW",
  },
];