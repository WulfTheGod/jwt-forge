# JWT Forge

A Node.js CLI tool for generating and verifying RSA-signed JWTs (RS256) with an interactive expiration picker.

## Features

- 🔐 **RSA-256 Signing**: Uses RSA SHA-256 (RS256) algorithm for JWT signing
- ⌨️ **Interactive Expiration Picker**: Select expiration times using keyboard navigation
- 🔑 **Key Management**: Generate, view, and manage RSA keypairs
- 📋 **Clipboard Support**: Copy tokens directly to clipboard
- 🎨 **Styled Output**: Clean, colorful terminal interface
- 🔒 **Security**: Proper key permissions and validation
- 🌍 **Cross-Platform**: Works on Windows, macOS, and Linux

## Installation

```bash
npm install
npm link  # Makes jwt-forge available globally
```

Or run directly:
```bash
npm start -- <command>
```

## Quick Start

1. **Generate a keypair:**
   ```bash
   jwt-forge keys gen
   ```

2. **Generate a JWT:**
   ```bash
   jwt-forge gen
   ```
   Use arrow keys to select expiration time, then press Enter.

3. **Verify a JWT:**
   ```bash
   jwt-forge verify <your-jwt-token>
   ```

## Commands

### `jwt-forge gen` - Generate JWT

Generate a new JWT token with interactive expiration selection.

**Options:**
- `--issuer <issuer>` - Set token issuer (iss claim)
- `--subject <subject>` - Set token subject (sub claim)  
- `--claims <json>` - Add custom claims as JSON string
- `--copy` - Copy token to clipboard
- `--json` - Output machine-readable JSON

**Examples:**
```bash
# Interactive generation
jwt-forge gen

# With predefined claims
jwt-forge gen --issuer "my-app" --subject "user123"

# With custom claims and clipboard copy
jwt-forge gen --claims '{"role":"admin","permissions":["read","write"]}' --copy

# JSON output for scripting
jwt-forge gen --json
```

### `jwt-forge verify <token>` - Verify JWT

Verify a JWT token and display its contents.

**Examples:**
```bash
jwt-forge verify eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...

# Output shows:
# ✓ JWT is valid!
# Header: { "alg": "RS256", "typ": "JWT" }
# Payload: { "iss": "my-app", "sub": "user123", ... }
# Expiration: ✓ Expires in: 1 hour
```

### `jwt-forge keys` - Key Management

Manage RSA keypairs for signing and verification.

#### `jwt-forge keys gen` - Generate Keypair

Generate a new RSA keypair.

**Options:**
- `--bits <bits>` - Key size: 2048 or 3072 (default: 2048)

**Examples:**
```bash
# Generate 2048-bit keypair (default)
jwt-forge keys gen

# Generate 3072-bit keypair
jwt-forge keys gen --bits 3072
```

#### `jwt-forge keys show` - Show Key Info

Display information about current keys.

```bash
jwt-forge keys show

# Output shows:
# RSA Key Information:
# Private Key:
#   Path: ~/.config/jwt-forge/keys/private.pem
#   Status: ✓ Found
#   Key size: 2048 bits
# Public Key:
#   Path: ~/.config/jwt-forge/keys/public.pem  
#   Status: ✓ Found
```

#### `jwt-forge keys set` - Set Custom Key Paths

Set paths to existing PEM files.

```bash
jwt-forge keys set
# Prompts for private and public key file paths
```

## Interactive Expiration Picker

When generating tokens, you'll see an interactive menu:

```
? Choose expiration time: (Use arrow keys)
❯ 5 minutes
  15 minutes  
  30 minutes
  1 hour
  6 hours
  12 hours
  1 day
  7 days
  Custom
```

**Keyboard Controls:**
- ↑/↓ - Navigate options
- Enter - Select option
- Esc - Cancel

**Custom Expiration:**
If you select "Custom", you'll get additional prompts:
1. Select time unit (minutes/hours/days)
2. Enter the number of units

## Key Storage

Keys are stored in platform-appropriate locations:

- **Linux/macOS**: `~/.config/jwt-forge/keys/`
- **Windows**: `%APPDATA%/jwt-forge/keys/`
- **macOS**: `~/Library/Application Support/jwt-forge/keys/`

**Files:**
- `private.pem` - RSA private key (600 permissions on Unix)
- `public.pem` - RSA public key  
- `../config.json` - Configuration file

## Security Features

- Private keys are created with restrictive permissions (600 on Unix systems)
- Warning displayed if private key permissions are too open
- Keys are validated before use
- Proper error handling for invalid tokens and missing keys

## Token Format

Generated JWTs include standard claims:

```json
{
  "iss": "issuer",           // Configurable issuer
  "sub": "subject",          // Configurable subject  
  "iat": 1640995200,         // Issued at (automatic)
  "exp": 1640998800,         // Expiration (from picker)
  "custom": "claims"         // Any custom claims
}
```

## Error Handling

The CLI provides clear error messages for common issues:

- Missing or invalid keys
- Expired tokens
- Invalid signatures  
- Malformed JWTs
- Permission issues

## Examples

### Complete Workflow

```bash
# 1. Generate keypair
jwt-forge keys gen --bits 2048

# 2. Generate token with custom claims
jwt-forge gen --issuer "my-service" --subject "user-456" --claims '{"role":"admin"}' --copy

# 3. Verify the token
jwt-forge verify <paste-token-here>

# 4. Check key information
jwt-forge keys show
```

### Scripting with JSON Output

```bash
# Generate token and extract just the token value
TOKEN=$(jwt-forge gen --json --issuer "api" --subject "service" | jq -r '.token')

# Use in API calls
curl -H "Authorization: Bearer $TOKEN" https://api.example.com/protected
```

## Requirements

- Node.js 16.0.0 or higher
- npm or yarn

## Dependencies

- `jose` - JWT signing and verification
- `inquirer` - Interactive CLI prompts
- `commander` - Command-line parsing
- `chalk` - Terminal styling
- `clipboardy` - Clipboard operations