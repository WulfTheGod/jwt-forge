import { generateKeyPair } from 'crypto';
import { promisify } from 'util';
import { writeFileSync, readFileSync, existsSync, chmodSync } from 'fs';
import { importPKCS8, importSPKI, SignJWT, jwtVerify } from 'jose';
import chalk from 'chalk';

const generateKeyPairAsync = promisify(generateKeyPair);

export async function generateRSAKeyPair(bits = 2048) {
  console.log(chalk.blue(`Generating ${bits}-bit RSA keypair...`));
  
  const { publicKey, privateKey } = await generateKeyPairAsync('rsa', {
    modulusLength: bits,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  return { publicKey, privateKey };
}

export function saveKeyPair(privateKeyPath, publicKeyPath, privateKey, publicKey) {
  writeFileSync(privateKeyPath, privateKey, { mode: 0o600 });
  writeFileSync(publicKeyPath, publicKey, { mode: 0o644 });
  
  // Set restrictive permissions on private key (Unix-like systems)
  if (process.platform !== 'win32') {
    try {
      chmodSync(privateKeyPath, 0o600);
    } catch (error) {
      console.warn(chalk.yellow('Warning: Could not set restrictive permissions on private key'));
    }
  }
}

export function loadPrivateKey(path) {
  if (!existsSync(path)) {
    throw new Error(`Private key not found at: ${path}`);
  }
  
  const keyData = readFileSync(path, 'utf8');
  return importPKCS8(keyData, 'RS256');
}

export function loadPublicKey(path) {
  if (!existsSync(path)) {
    throw new Error(`Public key not found at: ${path}`);
  }
  
  const keyData = readFileSync(path, 'utf8');
  return importSPKI(keyData, 'RS256');
}

export async function signJWT(payload, privateKey) {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'RS256' })
    .setIssuedAt()
    .setExpirationTime(payload.exp)
    .sign(privateKey);
    
  return jwt;
}

export async function verifyJWT(token, publicKey) {
  const { payload, protectedHeader } = await jwtVerify(token, publicKey);
  return { payload, header: protectedHeader };
}

export function checkKeyPermissions(privateKeyPath) {
  if (process.platform === 'win32') return; // Skip on Windows
  
  try {
    const stats = require('fs').statSync(privateKeyPath);
    const mode = stats.mode & parseInt('777', 8);
    
    if (mode > parseInt('600', 8)) {
      console.warn(chalk.yellow(`Warning: Private key permissions are too open (${mode.toString(8)})`));
      console.warn(chalk.yellow(`Consider running: chmod 600 ${privateKeyPath}`));
    }
  } catch (error) {
    // Ignore permission check errors
  }
}