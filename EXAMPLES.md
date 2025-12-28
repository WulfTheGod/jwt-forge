# JWT Forge Examples

This document provides practical examples of using the JWT Forge tool.

## Setup

First, generate your RSA keypair:

```bash
jwt-forge keys gen
```

## Basic Usage Examples

### 1. Generate a Simple JWT

```bash
# Interactive generation with expiration picker
jwt-forge gen
```

This will prompt you for:
- Issuer (iss claim)
- Subject (sub claim) 
- Whether to add custom claims
- Expiration time (using arrow keys to select)

### 2. Generate JWT with Predefined Claims

```bash
# Generate with specific issuer and subject
jwt-forge gen --issuer "my-api" --subject "user-123"

# Generate with custom claims as JSON
jwt-forge gen --issuer "auth-service" --subject "admin" --claims '{"role":"admin","permissions":["read","write","delete"]}'

# Generate and copy to clipboard
jwt-forge gen --issuer "my-app" --subject "user-456" --copy

# Generate with JSON output for scripting
jwt-forge gen --issuer "api" --subject "service" --json
```

### 3. Verify JWTs

```bash
# Verify a token (replace with actual token)
jwt-forge verify eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJ0ZXN0...

# Example output:
# ✓ JWT is valid!
# Header: { "alg": "RS256" }
# Payload: { "iss": "my-api", "sub": "user-123", ... }
# Expiration: ✓ Expires in: 1 hour
```

### 4. Key Management

```bash
# Show current key information
jwt-forge keys show

# Generate new 3072-bit keypair
jwt-forge keys gen --bits 3072

# Set custom key paths
jwt-forge keys set
```

## Advanced Examples

### Scripting with JSON Output

```bash
#!/bin/bash

# Generate token and extract just the token value
TOKEN=$(jwt-forge gen --json --issuer "api" --subject "service" | jq -r '.token')

# Use in API calls
curl -H "Authorization: Bearer $TOKEN" https://api.example.com/protected

# Check expiration
EXPIRES_AT=$(jwt-forge gen --json --issuer "api" --subject "service" | jq -r '.expiresAt')
echo "Token expires at: $EXPIRES_AT"
```

### Custom Claims Examples

```bash
# User authentication token
jwt-forge gen \
  --issuer "auth-service" \
  --subject "user-789" \
  --claims '{"role":"user","email":"user@example.com","verified":true}'

# Service-to-service token
jwt-forge gen \
  --issuer "payment-service" \
  --subject "order-processor" \
  --claims '{"scope":["orders:read","payments:write"],"version":"v2"}'

# Admin token with complex permissions
jwt-forge gen \
  --issuer "admin-panel" \
  --subject "admin-001" \
  --claims '{"role":"admin","permissions":{"users":["create","read","update","delete"],"settings":["read","update"]},"department":"IT"}'
```

### Expiration Options

When using the interactive picker, you can select:

- **5 minutes** - For short-lived tokens
- **15 minutes** - Quick operations
- **30 minutes** - Standard session length
- **1 hour** - Default for most applications
- **6 hours** - Extended sessions
- **12 hours** - Long-running processes
- **1 day** - Daily tokens
- **7 days** - Weekly tokens
- **Custom** - Specify your own duration

For custom durations, you can specify:
- Minutes (1-59)
- Hours (1-23) 
- Days (1-365)

## Error Handling Examples

### Invalid Token Verification

```bash
# Try to verify an invalid token
jwt-forge verify "invalid.token.here"

# Output:
# ✗ JWT verification failed:
# Malformed JWT token
```

### Expired Token

```bash
# Verify an expired token
jwt-forge verify eyJhbGciOiJSUzI1NiJ9...

# Output:
# ✗ JWT verification failed:
# Token has expired
```

### Missing Keys

```bash
# Try to generate without keys
rm ~/.config/jwt-forge/keys/*.pem
jwt-forge gen

# Will prompt to generate new keypair
```

## Integration Examples

### Node.js Application

```javascript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function generateToken(issuer, subject, customClaims = {}) {
  const claimsJson = JSON.stringify(customClaims);
  const command = `jwt-forge gen --json --issuer "${issuer}" --subject "${subject}" --claims '${claimsJson}'`;
  
  const { stdout } = await execAsync(command);
  const result = JSON.parse(stdout);
  
  return {
    token: result.token,
    expiresAt: result.expiresAt,
    expiresIn: result.expiresIn
  };
}

// Usage
const tokenData = await generateToken('my-app', 'user-123', { role: 'admin' });
console.log('Generated token:', tokenData.token);
```

### Docker Usage

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY src/ ./src/
COPY demo.js ./

# Generate keys on container start
RUN jwt-forge keys gen

# Make CLI available
RUN npm link

CMD ["jwt-forge", "--help"]
```

### CI/CD Pipeline

```yaml
# GitHub Actions example
- name: Generate JWT for API testing
  run: |
    jwt-forge keys gen --bits 2048
    TOKEN=$(jwt-forge gen --json --issuer "ci-cd" --subject "test-runner" | jq -r '.token')
    echo "JWT_TOKEN=$TOKEN" >> $GITHUB_ENV
    
- name: Test API with JWT
  run: |
    curl -H "Authorization: Bearer $JWT_TOKEN" \
         -H "Content-Type: application/json" \
         https://api.example.com/test
```

## Demo Script

Run the included demo to see all functionality:

```bash
npm run demo
```

This will:
1. Load existing keys
2. Generate a sample JWT with complex claims
3. Verify the JWT
4. Display formatted output

## Tips and Best Practices

1. **Key Security**: Keep private keys secure with proper file permissions
2. **Expiration**: Use appropriate expiration times for your use case
3. **Claims**: Don't include sensitive data in JWT payloads
4. **Verification**: Always verify JWTs before trusting their contents
5. **Key Rotation**: Regularly generate new keypairs for production use

## Troubleshooting

### Permission Issues (Unix/Linux/macOS)

```bash
# Fix private key permissions
chmod 600 ~/.config/jwt-forge/keys/private.pem

# Check current permissions
ls -la ~/.config/jwt-forge/keys/
```

### Windows Path Issues

The CLI automatically handles Windows paths, storing keys in:
```
%APPDATA%\jwt-forge\keys\
```

### JSON Parsing Errors

When using `--claims`, ensure valid JSON:

```bash
# ✓ Correct
jwt-forge gen --claims '{"role":"admin","active":true}'

# ✗ Incorrect (single quotes inside)
jwt-forge gen --claims '{"role":'admin',"active":true}'
```