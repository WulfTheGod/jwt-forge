# Installation Guide

## Prerequisites

- Node.js 16.0.0 or higher
- npm or yarn package manager
- Git (for cloning the repository)

## Installation Methods

### Method 1: Clone and Install (Recommended)

```bash
# Clone the repository
git clone https://github.com/WulfTheGod/jwt-forge.git
cd jwt-forge

# Install dependencies
npm install

# Link globally (makes jwt-forge available system-wide)
npm link
```

After linking, you can use `jwt-forge` from anywhere in your terminal.

### Method 2: Local Usage Only

```bash
# Clone and install
git clone https://github.com/WulfTheGod/jwt-forge.git
cd jwt-forge
npm install

# Use with npm start
npm start -- --help
npm start -- gen --json
```

### Method 3: Direct Execution

```bash
# Run commands directly without global install
node src/index.js --help
node src/index.js keys gen
node src/index.js gen
```

## Quick Start After Installation

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

## File Storage Locations

The CLI stores files in platform-appropriate locations:

- **Linux**: `~/.config/jwt-forge/`
- **macOS**: `~/Library/Application Support/jwt-forge/`
- **Windows**: `%APPDATA%\jwt-forge\`

Files created:
- `keys/private.pem` - RSA private key (600 permissions on Unix)
- `keys/public.pem` - RSA public key  
- `config.json` - Configuration settings

## Verification

Test your installation:

```bash
# Check version
jwt-forge --version

# View help
jwt-forge --help

# Generate initial keypair
jwt-forge keys gen

# Test JWT generation
jwt-forge gen --json --issuer "test"
```

## Platform-Specific Notes

### Windows
- Use PowerShell or Command Prompt
- Keys stored in `%APPDATA%/jwt-forge/keys/`
- File paths use backslashes (handled automatically)

### macOS
- Keys stored in `~/Library/Application Support/jwt-forge/keys/`
- May need to allow terminal access in Security preferences

### Linux
- Keys stored in `~/.config/jwt-forge/keys/`
- Ensure proper file permissions (600) for private keys

## Troubleshooting

### Permission Errors
```bash
# Fix npm permissions (Linux/macOS)
sudo chown -R $(whoami) ~/.npm

# Fix private key permissions
chmod 600 ~/.config/jwt-forge/keys/private.pem

# Or use npx instead of npm link
npx jwt-forge --help
```

### Node.js Version Issues
```bash
# Check Node.js version
node --version

# Update Node.js if needed (using nvm)
nvm install 18
nvm use 18
```

### Global Command Not Found
```bash
# If jwt-forge command not found after npm link
echo $PATH
npm config get prefix

# Add npm global bin to PATH if needed
export PATH=$PATH:$(npm config get prefix)/bin

# Or check npm global directory
npm list -g --depth=0
```

### Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear npm cache if needed
npm cache clean --force
```

### Development Setup
```bash
# For development with auto-reload
npm run dev -- --help

# Run tests
npm test
```