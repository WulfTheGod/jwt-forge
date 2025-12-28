import { homedir } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';

// Cross-platform config directory
function getConfigDir() {
  const platform = process.platform;
  
  if (platform === 'win32') {
    return join(process.env.APPDATA || join(homedir(), 'AppData', 'Roaming'), 'jwt-forge');
  } else if (platform === 'darwin') {
    return join(homedir(), 'Library', 'Application Support', 'jwt-forge');
  } else {
    return join(process.env.XDG_CONFIG_HOME || join(homedir(), '.config'), 'jwt-forge');
  }
}

const CONFIG_DIR = getConfigDir();
const KEYS_DIR = join(CONFIG_DIR, 'keys');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG = {
  privateKeyPath: join(KEYS_DIR, 'private.pem'),
  publicKeyPath: join(KEYS_DIR, 'public.pem'),
  keyBits: 2048
};

export function ensureConfigDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  if (!existsSync(KEYS_DIR)) {
    mkdirSync(KEYS_DIR, { recursive: true });
  }
}

export function loadConfig() {
  ensureConfigDir();
  
  if (!existsSync(CONFIG_FILE)) {
    saveConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
  
  try {
    const configData = readFileSync(CONFIG_FILE, 'utf8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(configData) };
  } catch (error) {
    console.error('Error loading config, using defaults:', error.message);
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config) {
  ensureConfigDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getKeyPaths() {
  const config = loadConfig();
  return {
    privateKey: config.privateKeyPath,
    publicKey: config.publicKeyPath
  };
}

export { CONFIG_DIR, KEYS_DIR };