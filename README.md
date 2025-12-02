# Secret Guard

**ES:** Extensión de VS Code para detectar secretos y credenciales expuestas en tiempo real.

**EN:** VS Code extension to detect exposed secrets and credentials in real-time.

---

## Instalación / Installation

```bash
npm install
npm run build
```

Para desarrollo / For development:
```bash
npm run watch
```

---

## Características / Features

| ES | EN |
|----|-----|
| Escaneo en tiempo real | Real-time scanning |
| 18 patrones de secretos integrados | 18 built-in secret patterns |
| Patrones personalizados | Custom patterns support |
| Comando para escanear workspace | Workspace scan command |
| Severidad configurable | Configurable severity |
| Rutas ignoradas | Ignored paths |

---

## Secretos Detectados / Detected Secrets

- AWS Access Key / Secret Key
- GitHub Token
- GitLab Token
- Slack Token
- Stripe Key
- OpenAI Key
- Google API Key
- Azure Key
- Private Keys (RSA, EC, DSA, OPENSSH)
- JWT Tokens
- Database URLs (MySQL, PostgreSQL, MongoDB, Redis)
- Anthropic Key
- Twilio Key
- SendGrid Key
- NPM Token
- Heroku Key
- Generic secrets (password, api_key, token, etc.)

---

## Configuración / Configuration

Abre Settings y busca "Secret Guard" / Open Settings and search "Secret Guard":

### `secretGuard.severity`
- `error` - Muestra como error (default) / Shows as error (default)
- `warning` - Muestra como advertencia / Shows as warning
- `info` - Muestra como información / Shows as info

### `secretGuard.customPatterns`
Patrones personalizados / Custom patterns:
```json
[
  {
    "name": "My Company Key",
    "pattern": "MYCOMPANY_[A-Z0-9]{32}"
  }
]
```

### `secretGuard.ignorePaths`
Rutas a ignorar / Paths to ignore:
```json
[
  "**/node_modules/**",
  "**/.git/**",
  "**/dist/**"
]
```

---

## Comandos / Commands

| Comando / Command | Descripción / Description |
|-------------------|---------------------------|
| `Secret Guard: Scan Workspace` | Escanea todos los archivos / Scans all files |

---

## Uso / Usage

1. Abre un archivo con código / Open a code file
2. Si hay secretos, verás errores subrayados / If secrets exist, you'll see underlined errors
3. Revisa el panel de "Problems" / Check the "Problems" panel

---

## Lenguajes Soportados / Supported Languages

JavaScript, TypeScript, Python, Java, Go, Rust, Ruby, PHP, C#, JSON, YAML, .env, Properties, Shell, Dockerfile

---

## Desarrollo / Development

```bash
git clone https://github.com/jafcn09/vscode-secret-guardian.git
cd vscode-secret-guardian

npm install
npm run build

```

---

## Licencia / License

MIT License - Ver archivo LICENSE / See LICENSE file