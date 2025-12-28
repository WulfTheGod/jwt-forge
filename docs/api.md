# API Reference

Complete reference for all JWT Forge CLI commands, options, and output formats.

## Global Options

Available for all commands:

| Option | Description |
|--------|-------------|
| `-V, --version` | Display version number |
| `-h, --help` | Display help information |

## Commands

### `jwt-forge gen` - Generate JWT

Generate a new JWT token with RSA-256 signing.

#### Syntax
```bash
jwt-forge gen [options]
```

#### Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `--issuer <issuer>` | string | Token issuer (iss claim) | Interactive prompt or "jwt-forge" |
| `--subject <subject>` | string | Token subject (sub claim) | Interactive prompt or "user" |
| `--claims <json>` | string | Custom claims as JSON string | None |
| `--copy` | boolean | Copy token to clipboard | false |
| `--json` | boolean | Output machine-readable JSON | false |

#### Examples

```bash
# Interactive mode
jwt-forge gen

# Automated mode
jwt-forge gen --json --issuer "my-app" --subject "user123"

# With custom claims
jwt-forge gen --claims '{"role":"admin","dept":"engineering"}' --copy

# Full automation
jwt-forge gen --json --issuer "api" --subject "service" --claims '{"scope":"read:users"}'
```

#### Output Formats

**Interactive Mode:**
```
✓ JWT generated successfully!
Expires in: 1 hour
Expires at: 12/31/2021, 2:00:00 PM

Token:
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**JSON Mode:**
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "iss": "my-app",
    "sub": "user123",
    "iat": 1640995200,
    "exp": 1640998800
  },
  "expiresAt": "2021-12-31T14:00:00.000Z",
  "expiresIn": "1 hour"
}
```

---

### `jwt-forge verify` - Verify JWT

Verify a JWT token signature and display its contents.

#### Syntax
```bash
jwt-forge verify <token>
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | string | Yes | JWT token to verify |

#### Examples

```bash
jwt-forge verify "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Output Format

```
✓ JWT is valid!

Header:
{
  "alg": "RS256",
  "typ": "JWT"
}

Payload:
{
  "iss": "my-app",
  "sub": "user123",
  "role": "admin",
  "iat": 1640995200,
  "exp": 1640998800
}

Expiration:
✓ Expires in: 45 minutes
  Expires at: 12/31/2021, 2:00:00 PM

Issued at: 12/31/2021, 1:00:00 PM
```

#### Error Cases

- **Invalid signature:** `✗ JWT signature verification failed`
- **Expired token:** `✗ JWT has expired`
- **Malformed token:** `✗ Invalid JWT format`
- **Missing public key:** `✗ Public key not found`

---

### `jwt-forge keys` - Key Management

Manage RSA keypairs for JWT signing and verification.

#### Subcommands

- [`jwt-forge keys gen`](#jwt-forge-keys-gen) - Generate new keypair
- [`jwt-forge keys show`](#jwt-forge-keys-show) - Display key information
- [`jwt-forge keys set`](#jwt-forge-keys-set) - Set custom key paths

---

### `jwt-forge keys gen` - Generate Keypair

Generate a new RSA keypair for JWT signing.

#### Syntax
```bash
jwt-forge keys gen [options]
```

#### Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `--bits <bits>` | number | Key size in bits (2048 or 3072) | 2048 |

#### Examples

```bash
# Generate 2048-bit keypair (default)
jwt-forge keys gen

# Generate 3072-bit keypair
jwt-forge keys gen --bits 3072
```

#### Output

```
? Keys already exist. Overwrite? (y/N)

Generating new RSA keypair...
Generating 2048-bit RSA keypair...
✓ Keypair generated and saved
  Private key: ~/.config/jwt-forge/keys/private.pem
  Public key: ~/.config/jwt-forge/keys/public.pem
```

---

### `jwt-forge keys show` - Show Key Information

Display information about current RSA keys.

#### Syntax
```bash
jwt-forge keys show
```

#### Output

```
RSA Key Information:
──────────────────────────────────────────────────

Private Key:
  Path: ~/.config/jwt-forge/keys/private.pem
  Status: ✓ Found
  Size: 1704 bytes
  Modified: 12/28/2025, 6:09:15 AM
  Permissions: 600
  Key size: 2048 bits

Public Key:
  Path: ~/.config/jwt-forge/keys/public.pem
  Status: ✓ Found
  Size: 451 bytes
  Modified: 12/28/2025, 6:09:15 AM

Configuration:
  Default key size: 2048 bits
```

---

### `jwt-forge keys set` - Set Custom Key Paths

Configure custom paths for existing PEM files.

#### Syntax
```bash
jwt-forge keys set
```

#### Interactive Prompts

1. **Private key path:** Enter path to existing private key PEM file
2. **Public key path:** Enter path to existing public key PEM file

#### Examples

```bash
jwt-forge keys set
? Private key file path: /path/to/my-private.pem
? Public key file path: /path/to/my-public.pem
✓ Key paths updated successfully
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error (invalid arguments, file not found, etc.) |
| 2 | JWT verification failed |
| 3 | Key generation failed |
| 4 | Permission error |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_FORGE_CONFIG_DIR` | Override config directory | Platform default |
| `JWT_FORGE_KEY_BITS` | Default key size | 2048 |

## File Formats

### Private Key (private.pem)
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
-----END PRIVATE KEY-----
```

### Public Key (public.pem)
```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw7Cs4j...
-----END PUBLIC KEY-----
```

### Configuration (config.json)
```json
{
  "keyBits": 2048,
  "privateKeyPath": "~/.config/jwt-forge/keys/private.pem",
  "publicKeyPath": "~/.config/jwt-forge/keys/public.pem"
}
```

## JWT Claims Reference

### Standard Claims (RFC 7519)

| Claim | Name | Type | Description |
|-------|------|------|-------------|
| `iss` | Issuer | string | Token issuer |
| `sub` | Subject | string | Token subject |
| `aud` | Audience | string/array | Intended audience |
| `exp` | Expiration | number | Expiration timestamp |
| `nbf` | Not Before | number | Not valid before timestamp |
| `iat` | Issued At | number | Issue timestamp |
| `jti` | JWT ID | string | Unique token identifier |

### Custom Claims

Any additional claims can be added via the `--claims` option as JSON:

```bash
jwt-forge gen --claims '{
  "role": "admin",
  "permissions": ["read", "write", "delete"],
  "department": "engineering",
  "level": 5,
  "active": true
}'
```