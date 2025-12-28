# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Features

This JWT CLI tool implements several security best practices:

### Key Security
- **RSA Key Generation**: Uses Node.js crypto module for secure key generation
- **Key Storage**: Private keys stored with restrictive permissions (600 on Unix systems)
- **Key Size**: Supports 2048-bit and 3072-bit RSA keys (default: 2048-bit)
- **Permission Warnings**: Alerts users if private key permissions are too open

### JWT Security
- **RS256 Algorithm**: Uses RSA SHA-256 for signing (asymmetric cryptography)
- **Standard Claims**: Implements standard JWT claims (iss, sub, iat, exp)
- **Expiration Validation**: Enforces token expiration during verification
- **Signature Verification**: Validates JWT signatures before trusting content

### Input Validation
- **JSON Parsing**: Safe JSON parsing with error handling for custom claims
- **File Path Validation**: Validates key file paths and existence
- **Parameter Validation**: Validates CLI parameters and options

## Security Considerations

### What This Tool Does NOT Do
- **Encryption**: JWTs are signed but not encrypted (payload is base64-encoded, not encrypted)
- **Key Rotation**: Does not automatically rotate keys
- **Revocation**: Does not implement token revocation lists
- **Network Security**: Does not handle HTTPS/TLS (that's your application's responsibility)

### Best Practices for Users

1. **Private Key Security**
   - Keep private keys secure and never share them
   - Use appropriate file permissions (600 on Unix systems)
   - Consider key rotation for production use
   - Never commit private keys to version control

2. **JWT Usage**
   - Use appropriate expiration times for your use case
   - Don't include sensitive data in JWT payloads
   - Always verify JWTs before trusting their contents
   - Use HTTPS when transmitting JWTs over networks

3. **Production Deployment**
   - Use environment-specific key pairs
   - Implement proper key management practices
   - Monitor for expired or invalid tokens
   - Consider using a proper secret management system

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this project, please report it responsibly:

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Email security concerns to the maintainers (create an issue for contact info)
3. Include detailed information about the vulnerability
4. Allow reasonable time for the issue to be addressed before public disclosure

## Security Audit Information

### Dependencies
This project uses well-established, actively maintained dependencies:

- `jose`: Industry-standard JWT library with regular security updates
- `inquirer`: Popular CLI interaction library
- `commander`: Widely-used command-line parsing library
- `chalk`: Terminal styling library (no security implications)
- `clipboardy`: Clipboard access library

### Code Review
- No hardcoded secrets or credentials
- Proper error handling and input validation
- Secure file operations with appropriate permissions
- No eval() or other dangerous dynamic code execution

### Known Limitations
- Private keys are stored on the local filesystem
- No built-in key rotation mechanism
- No token revocation capability
- Clipboard operations may be logged by system monitoring tools

## Updates and Patches

Security updates will be released as patch versions. Users should:
- Keep dependencies updated with `npm audit` and `npm update`
- Monitor for security advisories
- Update to the latest version when security patches are available

## Compliance

This tool generates JWTs that comply with:
- RFC 7519 (JSON Web Token)
- RFC 7515 (JSON Web Signature)
- Industry standard RS256 algorithm implementation