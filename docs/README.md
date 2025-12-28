# JWT Forge Documentation

Welcome to JWT Forge - a powerful CLI tool for generating and verifying RSA-signed JWTs.

## Getting Started

- **[Installation Guide](installation.md)** - Complete setup instructions for all platforms
- **[Quick Start](quick-start.md)** - Get up and running in 2 minutes

## Usage Documentation

- **[Usage Guide](usage.md)** - Complete command reference and examples
- **[API Reference](api.md)** - Detailed command documentation

## Additional Resources

- **[Examples](examples.md)** - Real-world usage examples
- **[Security Guide](security.md)** - Security considerations and best practices
- **[Changelog](changelog.md)** - Version history and changes
- **[Contributing](contributing.md)** - How to contribute to the project

## Quick Reference

### Essential Commands
```bash
jwt-forge keys gen          # Generate RSA keypair
jwt-forge gen              # Generate JWT (interactive)
jwt-forge gen --json      # Generate JWT (automated)
jwt-forge verify <token>   # Verify JWT token
```

### Common Options
- `--json` - Machine-readable output
- `--copy` - Copy to clipboard
- `--issuer <iss>` - Set token issuer
- `--subject <sub>` - Set token subject
- `--claims <json>` - Add custom claims

## Support

For issues, feature requests, or questions:
- Check the [Usage Guide](usage.md) for detailed examples
- Review [Examples](examples.md) for common use cases
- Open an issue on [GitHub](https://github.com/WulfTheGod/jwt-forge/issues)