# Secret Guard

A powerful VS Code extension for real-time detection of exposed secrets, API keys, and sensitive credentials in your codebase.

## Features

- **Real-time Detection**: Instantly identifies exposed secrets as you type
- **18+ Built-in Patterns**: Detects common secrets from AWS, GitHub, Google, OpenAI, and more
- **Customizable Patterns**: Add your own regex patterns for company-specific secrets
- **Smart Scanning**: Configurable severity levels and ignore paths
- **Workspace Scanning**: Scan your entire project with a single command
- **High Performance**: Optimized with debouncing and file size limits
- **Multi-language Support**: Works with all major programming languages

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Type `ext install jhafetcanepa.secret-guard`
4. Press Enter

### From Source
```bash
git clone https://github.com/jafcn09/vscode-secret-guardian.git
cd vscode-secret-guardian
npm install
npm run build
```

## Quick Start

1. Install the extension
2. Open any code file - Secret Guard automatically starts scanning
3. Look for underlined text - Detected secrets appear as errors/warnings
4. Check Problems panel (`Ctrl+Shift+M` / `Cmd+Shift+M`) for all findings

## Example Usage

### Example 1: Detecting AWS Credentials
```javascript
// config.js - This will trigger a HIGH severity warning
const config = {
  awsAccessKey: "AKIA[EXAMPLE_KEY_HERE]",  // ← Secret Guard detects this pattern
  region: "us-west-2"
};
```
**Result**: Error underline with message "[HIGH] Potential AWS Access Key detected"

### Example 2: Database Connection String
```python
# database.py - This will trigger a HIGH severity warning
DATABASE_URL = "mongodb://admin:[PASSWORD]@localhost:27017/mydb"  # ← Detected
```
**Result**: Error underline with message "[HIGH] Potential Database URL detected"

### Example 3: API Keys in Environment Variables
```bash
# .env file - Multiple detections
OPENAI_API_KEY=sk-[YOUR_OPENAI_KEY_HERE]  # ← Detected
GITHUB_TOKEN=ghp_[YOUR_GITHUB_TOKEN_HERE]  # ← Detected
STRIPE_KEY=sk_live_[YOUR_STRIPE_KEY_HERE]  # ← Detected
```
**Result**: Each line gets underlined with its respective secret type warning

### Example 4: Generic Password Detection
```typescript
// auth.service.ts - This will trigger a MEDIUM severity warning
const userCredentials = {
  username: "admin",
  password: "[YOUR_PASSWORD_HERE]"  // ← Secret Guard detects password patterns
};
```
**Result**: Warning underline with message "[MEDIUM] Potential Generic Secret detected"

### What Secret Guard Shows You

When secrets are detected:
1. **Red underline** (Error) - HIGH severity secrets
2. **Yellow underline** (Warning) - MEDIUM severity secrets
3. **Blue underline** (Info) - LOW severity secrets
4. **Problems Panel** - Lists all detected secrets with file location and line numbers
5. **Hover Information** - Shows the type of secret detected when hovering over the underlined text

## Detected Secrets

Secret Guard can detect:

### Cloud Providers
- **AWS**: Access Keys, Secret Keys
- **Azure**: Connection Strings, Keys
- **Google Cloud**: API Keys, Service Account Keys

### Version Control
- **GitHub**: Personal Access Tokens, OAuth Tokens
- **GitLab**: Personal Access Tokens

### API Services
- **OpenAI**: API Keys
- **Anthropic**: API Keys
- **Stripe**: Live/Test Keys
- **Twilio**: API Keys
- **SendGrid**: API Keys
- **Slack**: Bot/User Tokens

### Development
- **NPM**: Auth Tokens
- **Heroku**: API Keys
- **JWT**: JSON Web Tokens
- **Private Keys**: RSA, EC, DSA, OpenSSH

### Databases
- **Connection Strings**: MySQL, PostgreSQL, MongoDB, Redis

### Generic Patterns
- Passwords, API Keys, Tokens, Credentials

## Configuration

Access settings via `File > Preferences > Settings` and search for "Secret Guard"

### Core Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `secretGuard.severity` | Severity level for detected secrets (`error`, `warning`, `info`) | `error` |
| `secretGuard.scanOnSave` | Enable scanning when files are saved | `true` |
| `secretGuard.maxFindingsPerFile` | Maximum number of findings per file | `200` |
| `secretGuard.debounceMs` | Debounce delay for real-time scanning (ms) | `300` |

### Custom Patterns

Add your organization-specific patterns:

```json
"secretGuard.customPatterns": [
  {
    "name": "Internal API Key",
    "pattern": "INT_KEY_[A-Z0-9]{32}",
    "severity": "HIGH"
  },
  {
    "name": "Legacy Token",
    "pattern": "legacy-token-[a-f0-9]{16}",
    "flags": "gi",
    "severity": "MEDIUM"
  }
]
```

### Ignore Paths

Exclude specific directories or files:

```json
"secretGuard.ignorePaths": [
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**",
  "**/build/**",
  "**/out/**",
  "**/*.test.js"
]
```

## Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| `Secret Guard: Scan Workspace` | Scan all files in the current workspace | Access via Command Palette (`Ctrl+Shift+P`) |

## Architecture

Secret Guard uses a modular architecture for maintainability and performance:

```
src/
├── extension.ts        # Main extension entry point
├── types/             # TypeScript interfaces
├── config/            # Configuration management
├── patterns/          # Secret detection patterns
├── scanner/           # Core scanning logic
├── diagnostics/       # VS Code diagnostics integration
├── commands/          # Command implementations
└── utils/             # Utility functions
```

## Performance Optimization

- **Debounced Scanning**: Prevents excessive scanning during rapid typing
- **File Limits**: Configurable maximum findings per file
- **Smart Ignore**: Efficient path exclusion using glob patterns
- **Lazy Pattern Compilation**: Regex patterns compiled on-demand

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Privacy & Security

- **Local Processing**: All scanning happens locally in your VS Code instance
- **No Data Collection**: Secret Guard never sends your code or findings anywhere
- **Open Source**: Full source code available for security audit

## Support

- **Issues**: [GitHub Issues](https://github.com/jafcn09/vscode-secret-guardian/issues)
- **Documentation**: [GitHub Wiki](https://github.com/jafcn09/vscode-secret-guardian/wiki)

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

**Jhafet Cánepa**
- GitHub: [@jafcn09](https://github.com/jafcn09)

---

Copyright (c) 2025-present Jhafet Cánepa. All rights reserved.