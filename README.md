# JWT Forge

A Node.js CLI tool for generating and verifying RSA-signed JWTs (RS256) with an interactive expiration picker.

## Quick Start

```bash
git clone https://github.com/WulfTheGod/jwt-forge.git
cd jwt-forge
npm install && npm link
jwt-forge keys gen
jwt-forge gen --json --issuer "my-app" --subject "user123"
```

## Features

- 🔐 **RSA-256 Signing**: Uses RSA SHA-256 (RS256) algorithm
- ⌨️ **Interactive UI**: Arrow-key navigation for expiration selection
- 🔑 **Key Management**: Generate, view, and manage RSA keypairs
- 📋 **Clipboard Support**: Copy tokens directly to clipboard
- 🎨 **Styled Output**: Clean, colorful terminal interface
- 🔒 **Security**: Proper key permissions and validation
- 🌍 **Cross-Platform**: Works on Windows, macOS, and Linux
- 🤖 **Automation**: JSON mode for scripting and CI/CD

## Documentation

- **[Installation Guide](docs/installation.md)** - Detailed setup instructions
- **[Quick Start](docs/quick-start.md)** - Get running in 2 minutes
- **[Usage Guide](docs/usage.md)** - Complete command reference
- **[API Reference](docs/api.md)** - Detailed command documentation
- **[Examples](docs/examples.md)** - Real-world usage examples
- **[Security](docs/security.md)** - Security considerations
- **[Changelog](docs/changelog.md)** - Version history and changes
- **[Contributing](docs/contributing.md)** - How to contribute

## Commands

| Command | Description |
|---------|-------------|
| `jwt-forge gen` | Generate JWT tokens |
| `jwt-forge verify <token>` | Verify JWT tokens |
| `jwt-forge keys gen` | Generate RSA keypairs |
| `jwt-forge keys show` | Display key information |

## Examples

```bash
# Interactive generation
jwt-forge gen

# Automated with custom claims
jwt-forge gen --json --issuer "api" --claims '{"role":"admin"}' --copy

# Verify a token
jwt-forge verify eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Requirements

- Node.js 16.0.0 or higher
- npm or yarn

## License

MIT - see [LICENSE](LICENSE) file for details.