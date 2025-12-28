import inquirer from 'inquirer';
import chalk from 'chalk';
import { existsSync, statSync, readFileSync } from 'fs';
import { loadConfig, saveConfig, getKeyPaths } from '../lib/config.js';
import { generateRSAKeyPair, saveKeyPair, checkKeyPermissions } from '../lib/crypto.js';

export async function keysCommand(action, options = {}) {
  try {
    switch (action) {
      case 'gen':
        await generateKeys(options);
        break;
      case 'show':
        await showKeys();
        break;
      case 'set':
        await setKeys();
        break;
      default:
        console.error(chalk.red('Unknown keys command'));
        process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red('\n✗ Error:'), error.message);
    process.exit(1);
  }
}

async function generateKeys(options) {
  const config = loadConfig();
  const keyPaths = getKeyPaths();
  
  // Parse key bits
  const bits = parseInt(options.bits);
  if (![2048, 3072].includes(bits)) {
    throw new Error('Key size must be 2048 or 3072 bits');
  }
  
  // Check if keys already exist
  if (existsSync(keyPaths.privateKey) || existsSync(keyPaths.publicKey)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: 'Keys already exist. Overwrite?',
        default: false
      }
    ]);
    
    if (!overwrite) {
      console.log(chalk.yellow('Key generation cancelled'));
      return;
    }
  }
  
  console.log(chalk.blue(`\nGenerating ${bits}-bit RSA keypair...`));
  
  // Generate keypair
  const { privateKey, publicKey } = await generateRSAKeyPair(bits);
  
  // Save keys
  saveKeyPair(keyPaths.privateKey, keyPaths.publicKey, privateKey, publicKey);
  
  // Update config
  config.keyBits = bits;
  saveConfig(config);
  
  console.log(chalk.green('✓ RSA keypair generated successfully!'));
  console.log(chalk.gray(`  Private key: ${keyPaths.privateKey}`));
  console.log(chalk.gray(`  Public key: ${keyPaths.publicKey}`));
  console.log(chalk.gray(`  Key size: ${bits} bits`));
  
  checkKeyPermissions(keyPaths.privateKey);
}

async function showKeys() {
  const config = loadConfig();
  const keyPaths = getKeyPaths();
  
  console.log(chalk.cyan('\nRSA Key Information:'));
  console.log(chalk.gray('─'.repeat(50)));
  
  // Private key info
  console.log(chalk.cyan('\nPrivate Key:'));
  console.log(chalk.gray(`  Path: ${keyPaths.privateKey}`));
  
  if (existsSync(keyPaths.privateKey)) {
    const stats = statSync(keyPaths.privateKey);
    console.log(chalk.green('  Status: ✓ Found'));
    console.log(chalk.gray(`  Size: ${stats.size} bytes`));
    console.log(chalk.gray(`  Modified: ${stats.mtime.toLocaleString()}`));
    
    if (process.platform !== 'win32') {
      const mode = stats.mode & parseInt('777', 8);
      const modeStr = mode.toString(8);
      console.log(chalk.gray(`  Permissions: ${modeStr}`));
      
      if (mode > parseInt('600', 8)) {
        console.log(chalk.yellow('  ⚠ Warning: Permissions too open'));
      }
    }
    
    // Try to detect key size
    try {
      const keyContent = readFileSync(keyPaths.privateKey, 'utf8');
      const keySize = detectKeySize(keyContent);
      if (keySize) {
        console.log(chalk.gray(`  Key size: ${keySize} bits`));
      }
    } catch (error) {
      console.log(chalk.red('  Error reading key file'));
    }
  } else {
    console.log(chalk.red('  Status: ✗ Not found'));
  }
  
  // Public key info
  console.log(chalk.cyan('\nPublic Key:'));
  console.log(chalk.gray(`  Path: ${keyPaths.publicKey}`));
  
  if (existsSync(keyPaths.publicKey)) {
    const stats = statSync(keyPaths.publicKey);
    console.log(chalk.green('  Status: ✓ Found'));
    console.log(chalk.gray(`  Size: ${stats.size} bytes`));
    console.log(chalk.gray(`  Modified: ${stats.mtime.toLocaleString()}`));
    
    // Try to detect key size
    try {
      const keyContent = readFileSync(keyPaths.publicKey, 'utf8');
      const keySize = detectKeySize(keyContent);
      if (keySize) {
        console.log(chalk.gray(`  Key size: ${keySize} bits`));
      }
    } catch (error) {
      console.log(chalk.red('  Error reading key file'));
    }
  } else {
    console.log(chalk.red('  Status: ✗ Not found'));
  }
  
  // Config info
  console.log(chalk.cyan('\nConfiguration:'));
  console.log(chalk.gray(`  Default key size: ${config.keyBits} bits`));
  
  // Recommendations
  const privateExists = existsSync(keyPaths.privateKey);
  const publicExists = existsSync(keyPaths.publicKey);
  
  if (!privateExists || !publicExists) {
    console.log(chalk.yellow('\n💡 Tip: Generate keys with: jwt-forge keys gen'));
  }
}

async function setKeys() {
  const config = loadConfig();
  
  console.log(chalk.cyan('\nSet custom key paths:'));
  
  const { privateKeyPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'privateKeyPath',
      message: 'Private key path:',
      default: config.privateKeyPath,
      validate: (input) => {
        if (!input) return 'Path cannot be empty';
        if (!existsSync(input)) return 'File does not exist';
        return true;
      }
    }
  ]);
  
  const { publicKeyPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'publicKeyPath',
      message: 'Public key path:',
      default: config.publicKeyPath,
      validate: (input) => {
        if (!input) return 'Path cannot be empty';
        if (!existsSync(input)) return 'File does not exist';
        return true;
      }
    }
  ]);
  
  // Update config
  config.privateKeyPath = privateKeyPath;
  config.publicKeyPath = publicKeyPath;
  saveConfig(config);
  
  console.log(chalk.green('\n✓ Key paths updated successfully!'));
  console.log(chalk.gray(`  Private key: ${privateKeyPath}`));
  console.log(chalk.gray(`  Public key: ${publicKeyPath}`));
  
  checkKeyPermissions(privateKeyPath);
}

function detectKeySize(keyContent) {
  // Simple heuristic based on key content length
  // This is approximate but good enough for display purposes
  const contentLength = keyContent.replace(/-----[^-]+-----/g, '').replace(/\s/g, '').length;
  
  if (contentLength > 3000) return 3072;
  if (contentLength > 2000) return 2048;
  if (contentLength > 1000) return 1024;
  
  return null;
}