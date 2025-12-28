import inquirer from 'inquirer';
import chalk from 'chalk';
import clipboardy from 'clipboardy';
import { existsSync } from 'fs';
import { loadConfig, saveConfig, getKeyPaths } from '../lib/config.js';
import { generateRSAKeyPair, saveKeyPair, loadPrivateKey, checkKeyPermissions } from '../lib/crypto.js';
import { selectExpiration, formatExpirationTime } from '../lib/expiration.js';
import { signJWT } from '../lib/crypto.js';

export async function genCommand(options) {
  try {
    const config = loadConfig();
    const keyPaths = getKeyPaths();
    
    // Check if keys exist
    const privateKeyExists = existsSync(keyPaths.privateKey);
    const publicKeyExists = existsSync(keyPaths.publicKey);
    
    let shouldGenerateNewKeys = false;
    
    if (privateKeyExists && publicKeyExists) {
      if (options.json) {
        // In JSON mode, always use existing keys if they exist
        shouldGenerateNewKeys = false;
      } else {
        const { keyChoice } = await inquirer.prompt([
          {
            type: 'list',
            name: 'keyChoice',
            message: 'RSA keypair found. What would you like to do?',
            choices: [
              { name: 'Use existing keys', value: 'existing' },
              { name: 'Generate new keypair', value: 'new' }
            ]
          }
        ]);
        
        shouldGenerateNewKeys = keyChoice === 'new';
      }
    } else {
      // Keys don't exist, need to generate them
      shouldGenerateNewKeys = true;
    }
    
    // Generate new keys if needed
    if (shouldGenerateNewKeys) {
      console.log(chalk.blue('\nGenerating new RSA keypair...'));
      const { privateKey, publicKey } = await generateRSAKeyPair(config.keyBits);
      saveKeyPair(keyPaths.privateKey, keyPaths.publicKey, privateKey, publicKey);
      console.log(chalk.green('✓ Keypair generated and saved'));
      console.log(chalk.gray(`  Private key: ${keyPaths.privateKey}`));
      console.log(chalk.gray(`  Public key: ${keyPaths.publicKey}`));
    }
    
    // Check key permissions
    checkKeyPermissions(keyPaths.privateKey);
    
    // Load private key
    const privateKey = await loadPrivateKey(keyPaths.privateKey);
    
    // Get token claims
    const claims = await getTokenClaims(options);
    
    // Select expiration
    const expirationSeconds = await selectExpiration(options.json);
    const exp = Math.floor(Date.now() / 1000) + expirationSeconds;
    
    // Build JWT payload
    const payload = {
      ...claims,
      iat: Math.floor(Date.now() / 1000),
      exp
    };
    
    // Sign JWT
    console.log(chalk.blue('\nSigning JWT...'));
    const token = await signJWT(payload, privateKey);
    
    // Format expiration info
    const expirationInfo = formatExpirationTime(exp);
    
    // Output results
    if (options.json) {
      const output = {
        token,
        header: { alg: 'RS256', typ: 'JWT' },
        payload,
        expiresAt: expirationInfo.expiresAt,
        expiresIn: expirationInfo.expiresIn
      };
      console.log(JSON.stringify(output, null, 2));
    } else {
      console.log(chalk.green('\n✓ JWT generated successfully!'));
      console.log(chalk.gray(`Expires in: ${expirationInfo.expiresIn}`));
      console.log(chalk.gray(`Expires at: ${new Date(expirationInfo.expiresAt).toLocaleString()}`));
      console.log(chalk.cyan('\nToken:'));
      console.log(token);
    }
    
    // Copy to clipboard if requested
    if (options.copy) {
      try {
        await clipboardy.write(token);
        console.log(chalk.green('\n✓ Token copied to clipboard'));
      } catch (error) {
        console.log(chalk.yellow('\n⚠ Could not copy to clipboard:', error.message));
      }
    }
    
  } catch (error) {
    console.error(chalk.red('\n✗ Error generating JWT:'), error.message);
    process.exit(1);
  }
}

async function getTokenClaims(options) {
  const claims = {};
  
  // Get issuer
  if (options.issuer) {
    claims.iss = options.issuer;
  } else if (options.json) {
    // In JSON mode, use default if not provided
    claims.iss = 'jwt-forge';
  } else {
    const { issuer } = await inquirer.prompt([
      {
        type: 'input',
        name: 'issuer',
        message: 'Token issuer (iss):',
        default: 'jwt-forge'
      }
    ]);
    claims.iss = issuer;
  }
  
  // Get subject
  if (options.subject) {
    claims.sub = options.subject;
  } else if (options.json) {
    // In JSON mode, use default if not provided
    claims.sub = 'user';
  } else {
    const { subject } = await inquirer.prompt([
      {
        type: 'input',
        name: 'subject',
        message: 'Token subject (sub):',
        default: 'user'
      }
    ]);
    claims.sub = subject;
  }
  
  // Handle custom claims
  if (options.claims) {
    try {
      const customClaims = JSON.parse(options.claims);
      Object.assign(claims, customClaims);
    } catch (error) {
      throw new Error(`Invalid JSON in --claims: ${error.message}`);
    }
  } else if (!options.json) {
    // Only prompt for custom claims in interactive mode
    const { addCustomClaims } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'addCustomClaims',
        message: 'Add custom claims?',
        default: false
      }
    ]);
    
    if (addCustomClaims) {
      const customClaims = await getCustomClaims();
      Object.assign(claims, customClaims);
    }
  }
  
  return claims;
}

async function getCustomClaims() {
  const claims = {};
  
  while (true) {
    const { key } = await inquirer.prompt([
      {
        type: 'input',
        name: 'key',
        message: 'Claim key (or press Enter to finish):',
        validate: (input) => {
          if (!input) return true; // Allow empty to finish
          if (input.match(/^(iss|sub|iat|exp|nbf|jti|aud)$/)) {
            return 'Cannot override standard JWT claims';
          }
          return true;
        }
      }
    ]);
    
    if (!key) break;
    
    const { value } = await inquirer.prompt([
      {
        type: 'input',
        name: 'value',
        message: `Value for "${key}":`,
        validate: (input) => input.length > 0 || 'Value cannot be empty'
      }
    ]);
    
    // Try to parse as JSON, fallback to string
    try {
      claims[key] = JSON.parse(value);
    } catch {
      claims[key] = value;
    }
  }
  
  return claims;
}