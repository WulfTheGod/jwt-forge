# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-12-28

### Added
- Initial release of JWT Forge CLI
- RSA-256 (RS256) JWT signing and verification
- Interactive expiration time picker with preset options
- Key management commands (generate, show, set)
- Cross-platform key storage with proper permissions
- Clipboard integration for token copying
- JSON output mode for scripting and automation
- Comprehensive CLI help and documentation
- Security features including key permission validation

### Features
- **JWT Generation**: Create RS256-signed JWTs with custom claims
- **JWT Verification**: Verify token signatures and display contents
- **Key Management**: Generate, view, and manage RSA keypairs
- **Interactive UI**: Arrow-key navigation for expiration selection
- **Automation Support**: Non-interactive JSON mode for scripts
- **Security**: Proper file permissions and validation
- **Cross-Platform**: Works on Windows, macOS, and Linux

### Commands
- `jwt-forge gen` - Generate JWT tokens
- `jwt-forge verify <token>` - Verify JWT tokens
- `jwt-forge keys gen` - Generate RSA keypairs
- `jwt-forge keys show` - Display key information
- `jwt-forge keys set` - Set custom key paths

### Options
- `--json` - Machine-readable JSON output
- `--copy` - Copy tokens to clipboard
- `--issuer` - Set token issuer
- `--subject` - Set token subject
- `--claims` - Add custom claims as JSON
- `--bits` - Set RSA key size (2048/3072)