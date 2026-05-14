import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve('.env.local');
const content = fs.readFileSync(envPath, 'utf8');

// Remove the weird spaces/null characters if it's UTF-16
const cleaned = content.replace(/\0/g, '').replace(/O P E N A I _ A P I _ K E Y = /g, 'OPENAI_API_KEY=');

// Just to be safe, I'll rewrite the whole file with the correct format
const lines = cleaned.split('\n').map(line => line.trim()).filter(line => line.length > 0);
const fixedContent = lines.join('\n');

fs.writeFileSync(envPath, fixedContent);
console.log('Fixed .env.local encoding and content.');
