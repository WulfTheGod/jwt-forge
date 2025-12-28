import chalk from 'chalk';
import { getKeyPaths } from '../lib/config.js';
import { loadPublicKey, verifyJWT } from '../lib/crypto.js';
import { formatExpirationTime } from '../lib/expiration.js';

export async function verifyCommand(token) {
  try {
    const keyPaths = getKeyPaths();
    
    // Load public key
    const publicKey = await loadPublicKey(keyPaths.publicKey);
    
    console.log(chalk.blue('Verifying JWT...'));
    
    // Verify JWT
    const { payload, header } = await verifyJWT(token, publicKey);
    
    console.log(chalk.green('\n✓ JWT is valid!'));
    
    // Display header
    console.log(chalk.cyan('\nHeader:'));
    console.log(JSON.stringify(header, null, 2));
    
    // Display payload
    console.log(chalk.cyan('\nPayload:'));
    console.log(JSON.stringify(payload, null, 2));
    
    // Display expiration info if present
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      const expirationInfo = formatExpirationTime(payload.exp);
      
      console.log(chalk.cyan('\nExpiration:'));
      if (payload.exp > now) {
        console.log(chalk.green(`✓ Expires in: ${expirationInfo.expiresIn}`));
        console.log(chalk.gray(`  Expires at: ${new Date(expirationInfo.expiresAt).toLocaleString()}`));
      } else {
        const expiredAgo = formatExpirationTime(now - (now - payload.exp));
        console.log(chalk.red(`✗ Expired ${expiredAgo.expiresIn} ago`));
        console.log(chalk.gray(`  Expired at: ${new Date(expirationInfo.expiresAt).toLocaleString()}`));
      }
    }
    
    // Display issued time if present
    if (payload.iat) {
      const issuedAt = new Date(payload.iat * 1000);
      console.log(chalk.gray(`\nIssued at: ${issuedAt.toLocaleString()}`));
    }
    
  } catch (error) {
    console.error(chalk.red('\n✗ JWT verification failed:'));
    
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.error(chalk.red('Token has expired'));
    } else if (error.code === 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED') {
      console.error(chalk.red('Invalid signature - token may be tampered with or signed with different key'));
    } else if (error.code === 'ERR_JWT_MALFORMED') {
      console.error(chalk.red('Malformed JWT token'));
    } else if (error.message.includes('not found')) {
      console.error(chalk.red('Public key not found. Generate keys first with: jwt-forge keys gen'));
    } else {
      console.error(chalk.red(error.message));
    }
    
    process.exit(1);
  }
}