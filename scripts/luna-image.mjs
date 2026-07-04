#!/usr/bin/env node
/**
 * LUNA — Génération d'images via Nano Banana (Gemini)
 * ---------------------------------------------------
 * Usage :
 *   node scripts/luna-image.mjs "ta description d'image" [nom-fichier.png] [--ratio 4:5]
 *
 * Exemple :
 *   node scripts/luna-image.mjs "Une tasse de tisane fumante sur une table en bois, lumière douce du matin, ambiance cocooning, palette rose poudré et crème" tisane.png --ratio 4:5
 *
 * Les images sont enregistrées dans le dossier  generated-images/
 * La clé est lue dans .env (GEMINI_API_KEY) — jamais exposée à l'app.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// --- Lecture simple du .env (sans dépendance) ---
function loadEnv() {
  const path = join(ROOT, '.env');
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

const env = loadEnv();
const API_KEY = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ Aucune clé trouvée. Ajoute GEMINI_API_KEY dans le fichier .env');
  process.exit(1);
}

// --- Arguments ---
const args = process.argv.slice(2);
let ratio = '1:1';
const ratioIdx = args.indexOf('--ratio');
if (ratioIdx !== -1) {
  ratio = args[ratioIdx + 1] || '1:1';
  args.splice(ratioIdx, 2);
}
const prompt = args[0];
if (!prompt) {
  console.error('❌ Donne une description. Ex : node scripts/luna-image.mjs "un bol de fruits rouges" fruits.png');
  process.exit(1);
}
const rawName = args[1] || `luna-${Date.now()}.png`;
const fileName = rawName.endsWith('.png') ? rawName : `${rawName}.png`;

// --- Modèle Nano Banana ---
const MODEL = 'gemini-2.5-flash-image';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const body = {
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: {
    responseModalities: ['IMAGE'],
    imageConfig: { aspectRatio: ratio },
  },
};

console.log(`🍌 Génération en cours (${ratio})…`);
console.log(`   « ${prompt.slice(0, 90)}${prompt.length > 90 ? '…' : ''} »`);

const res = await fetch(URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY },
  body: JSON.stringify(body),
});

if (!res.ok) {
  const txt = await res.text();
  console.error(`❌ Erreur ${res.status} :`);
  console.error(txt);
  process.exit(1);
}

const data = await res.json();
const parts = data?.candidates?.[0]?.content?.parts || [];
let saved = false;
for (const part of parts) {
  if (part.inlineData?.data) {
    const dir = join(ROOT, 'generated-images');
    mkdirSync(dir, { recursive: true });
    const outPath = join(dir, fileName);
    writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
    console.log(`✅ Image enregistrée : generated-images/${fileName}`);
    saved = true;
  } else if (part.text) {
    console.log(`💬 ${part.text}`);
  }
}
if (!saved) {
  console.error('⚠️ Aucune image dans la réponse. Réponse brute :');
  console.error(JSON.stringify(data, null, 2).slice(0, 2000));
  process.exit(1);
}
