# Quick Start Guide

Get JWT Forge running in under 2 minutes.

## Installation

```bash
git clone https://github.com/WulfTheGod/jwt-forge.git
cd jwt-forge
npm install
npm link
```

## First Steps

### 1. Generate Keys
```bash
jwt-forge keys gen
```

### 2. Create a JWT
```bash
# Interactive mode
jwt-forge gen

# Or automated mode
jwt-forge gen --json --issuer "my-app" --subject "user123"
```

### 3. Verify the JWT
```bash
jwt-forge verify "your-jwt-token-here"
```

## Common Examples

### Development Testing
```bash
jwt-forge gen --issuer "dev-app" --subject "test-user" --copy
```

### CI/CD Automation
```bash
TOKEN=$(jwt-forge gen --json --issuer "ci" --subject "automation" | jq -r '.token')
```

### Custom Claims
```bash
jwt-forge gen --claims '{"role":"admin","permissions":["read","write"]}' --json
```

## Next Steps

- Read the [Usage Guide](usage.md) for detailed examples
- Check [Security Best Practices](security.md)
- Explore [API Reference](api.md) for all options