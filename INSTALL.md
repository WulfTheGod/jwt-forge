# Installation Guide

## Prerequisites

- Node.js 16.0.0 or higher
- npm (comes with Node.js)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Make CLI Globally Available (Optional)

```bash
npm link
```

After linking, you can use `jwt-forge` from anywhere:

```bash
jwt-forge --help
jwt-forge keys gen
jwt-forge gen
```

### 3. Alternative: Run Directly

If you prefer not to link globally, run commands with:

```bash
node src/index.js --help
node src/index.js keys gen
node src/index.js gen
```

## Quick Start

1. **Generate RSA keypair:**
   ```bash
   jwt-forge keys gen
   ```

2. **Generate your first JWT:**
   ```bash
   jwt-forge gen
   ```
   
   Use arrow keys to select expiration time, press Enter to confirm.

3. **Verify a JWT:**
   ```bash
   jwt-forge verify <your-jwt-token>
   ```

## File Locations

The CLI stores files in platform-appropriate locations:

- **Linux**: `~/.config/jwt-forge/`
- **macOS**: `~/Library/Application Support/jwt-forge/`
- **Windows**: `%APPDATA%\jwt-forge\`

Files created:
- `keys/private.pem` - RSA private key
- `keys/public.pem` - RSA public key  
- `config.json` - Configuration settings

## Verification

Run the demo to verify everything works:

```bash
npm run demo
```

You should see:
- ✓ Keys loaded successfully
- ✓ JWT generated successfully
- ✓ JWT verified successfully
- 🎉 Demo completed successfully!

## Troubleshooting

### Permission Issues (Unix/Linux/macOS)

If you see permission warnings:

```bash
chmod 600 ~/.config/jwt-forge/keys/private.pem
```

### Windows Issues

- Ensure Node.js is in your PATH
- Run commands in Command Prompt or PowerShell
- File paths use backslashes on Windows (handled automatically)

### Module Not Found

If you get "module not found" errors:

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Global Command Not Found

If `jwt-forge` command isn't found after `npm link`:

```bash
# Check npm global bin directory
npm config get prefix

# Add to PATH if needed (Linux/macOS)
export PATH=$PATH:$(npm config get prefix)/bin

# Or use direct execution
node src/index.js --help
```

## Development

For development with auto-reload:

```bash
npm run dev -- --help
```

## Next Steps

- Read [README.md](README.md) for detailed usage
- Check [EXAMPLES.md](EXAMPLES.md) for practical examples
- Run `jwt-forge --help` to see all available commands