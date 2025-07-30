#!/usr/bin/env node

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

const envPath = join(process.cwd(), '.env.local');
const envExamplePath = join(process.cwd(), 'env.example');

console.log('🔧 Setting up environment variables...');

// Read the example file
if (!existsSync(envExamplePath)) {
  console.error('❌ env.example file not found');
  process.exit(1);
}

const envExample = readFileSync(envExamplePath, 'utf-8');

// Generate a random NextAuth secret
const nextAuthSecret = crypto.randomBytes(32).toString('hex');

// Replace placeholder values
const envContent = envExample
  .replace(/your_neynar_api_key_here/g, process.env.NEYNAR_API_KEY || 'your_neynar_api_key_here')
  .replace(/your_nextauth_secret_here/g, nextAuthSecret)
  .replace(/your_seed_phrase_here/g, process.env.SEED_PHRASE || 'your_seed_phrase_here');

// Write the .env.local file
writeFileSync(envPath, envContent);

console.log('✅ Environment variables set up successfully!');
console.log('📝 Please update the following variables in .env.local:');
console.log('   - NEYNAR_API_KEY: Your Neynar API key');
console.log('   - NEXT_PUBLIC_APP_URL: Your app URL (update after deployment)');
console.log('   - SEED_PHRASE: Your seed phrase (optional)'); 