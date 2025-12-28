# Usage Guide

Complete guide to using JWT Forge CLI commands and features.

## Command Overview

| Command | Purpose |
|---------|---------|
| `jwt-forge gen` | Generate JWT tokens |
| `jwt-forge verify <token>` | Verify JWT tokens |
| `jwt-forge keys gen` | Generate RSA keypairs |
| `jwt-forge keys show` | Display key information |
| `jwt-forge keys set` | Set custom key paths |

## JWT Generation

### Interactive Mode

```bash
jwt-forge gen
```

This launches an interactive session where you can:
- Set issuer and subject
- Choose expiration time with arrow keys
- Add custom claims
- Copy to clipboard

### Automated Mode (JSON)

```bash
# Basic generation
jwt-forge gen --json

# With specific claims
jwt-forge gen --json --issuer "my-app" --subject "user123"

# With custom claims
jwt-forge gen --json --claims '{"role":"admin","dept":"engineering"}'

# Copy to clipboard
jwt-forge gen --json --copy
```

### Generation Options

| Option | Description | Example |
|--------|-------------|---------|
| `--issuer <iss>` | Set token issuer | `--issuer "my-service"` |
| `--subject <sub>` | Set token subject | `--subject "user-456"` |
| `--claims <json>` | Add custom claims | `--claims '{"role":"admin"}'` |
| `--copy` | Copy to clipboard | `--copy` |
| `--json` | JSON output mode | `--json` |

## JWT Verification

### Basic Verification

```bash
jwt-forge verify "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Output includes:
- Signature validation status
- Header information
- Payload claims
- Expiration status and time remaining
- Issue time

### Example Output

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

## Key Management

### Generate New Keys

```bash
# Generate 2048-bit keys (default)
jwt-forge keys gen

# Generate 3072-bit keys
jwt-forge keys gen --bits 3072

# Force overwrite existing keys
jwt-forge keys gen --force
```

### View Key Information

```bash
jwt-forge keys show
```

Shows:
- Key file paths
- File existence status
- File sizes and modification dates
- Key bit length
- File permissions (Unix systems)

### Set Custom Key Paths

```bash
jwt-forge keys set
```

Prompts for:
- Private key file path
- Public key file path

Useful for using existing keys or custom locations.

## Expiration Options

### Preset Options
- 5 minutes
- 15 minutes
- 30 minutes
- 1 hour (default for JSON mode)
- 6 hours
- 12 hours
- 1 day
- 7 days
- Custom

### Custom Expiration

When selecting "Custom":
1. Choose time unit (minutes/hours/days)
2. Enter number of units
3. Maximum: 1 year

## Custom Claims

### Via Command Line

```bash
jwt-forge gen --claims '{"role":"admin","permissions":["read","write","delete"]}'
```

### Interactive Mode

When prompted "Add custom claims?":
1. Enter claim key
2. Enter claim value
3. Repeat or press Enter to finish

Values are automatically parsed as JSON when possible.

### Reserved Claims

These standard JWT claims are handled automatically:
- `iss` (issuer) - set via `--issuer`
- `sub` (subject) - set via `--subject`
- `iat` (issued at) - set automatically
- `exp` (expiration) - set via expiration picker
- `nbf`, `jti`, `aud` - reserved for future use

## Output Formats

### Interactive Mode Output

```
✓ JWT generated successfully!
Expires in: 1 hour
Expires at: 12/31/2021, 2:00:00 PM

Token:
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

### JSON Mode Output

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

## Scripting Examples

### Extract Token Value

```bash
TOKEN=$(jwt-forge gen --json --issuer "api" | jq -r '.token')
echo "Token: $TOKEN"
```

### Use in API Calls

```bash
# Generate token
TOKEN=$(jwt-forge gen --json --issuer "api" --subject "service" | jq -r '.token')

# Use in curl
curl -H "Authorization: Bearer $TOKEN" https://api.example.com/protected

# Use in HTTPie
http GET api.example.com/protected Authorization:"Bearer $TOKEN"
```

### Batch Processing

```bash
# Generate multiple tokens
for user in alice bob charlie; do
  jwt-forge gen --json --subject "$user" --issuer "batch-job" | jq -r '.token' > "${user}_token.txt"
done
```

## Error Handling

Common error scenarios and solutions:

### Missing Keys
```
Error: Private key not found
Solution: Run 'jwt-forge keys gen'
```

### Invalid Token
```
Error: Invalid JWT format
Solution: Check token format and completeness
```

### Expired Token
```
Error: Token has expired
Solution: Generate new token or check system time
```

### Permission Errors
```
Warning: Private key permissions too open
Solution: Run 'chmod 600 /path/to/private.pem'
```