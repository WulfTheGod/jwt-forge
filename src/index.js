#!/usr/bin/env node

import { Command } from 'commander';
import { genCommand } from './commands/gen.js';
import { verifyCommand } from './commands/verify.js';
import { keysCommand } from './commands/keys.js';

const program = new Command();

program
  .name('jwt-forge')
  .description('Generate and verify RSA-signed JWTs with interactive expiration picker')
  .version('1.0.0');

program
  .command('gen')
  .description('Generate a JWT token')
  .option('--issuer <issuer>', 'Token issuer (iss claim)')
  .option('--subject <subject>', 'Token subject (sub claim)')
  .option('--claims <json>', 'Custom claims as JSON string')
  .option('--copy', 'Copy token to clipboard')
  .option('--json', 'Output machine-readable JSON')
  .action(genCommand);

program
  .command('verify <token>')
  .description('Verify a JWT token using the public key')
  .action(verifyCommand);

const keys = program
  .command('keys')
  .description('Manage RSA keypairs');

keys
  .command('gen')
  .description('Generate a new RSA keypair')
  .option('--bits <bits>', 'Key size in bits (2048 or 3072)', '2048')
  .action((options) => keysCommand('gen', options));

keys
  .command('show')
  .description('Show key paths and basic info')
  .action(() => keysCommand('show'));

keys
  .command('set')
  .description('Set paths to existing PEM files')
  .action(() => keysCommand('set'));

program.parse();