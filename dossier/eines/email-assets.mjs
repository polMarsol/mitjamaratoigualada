// Genera les imatges del correu (PNG/JPG) a partir dels SVG i les fotos. Executar: node dossier/eines/email-assets.mjs
import { createRequire } from 'module';
import path from 'path';
const require = createRequire(path.resolve('web/package.json'));
const sharp = require('sharp');
const D = 'dossier/assets', O = 'web/public/patrocini/email';
await sharp(`${D}/logos/logo-horitzontal-blanc.svg`, { density: 300 }).resize({ width: 480 }).png().toFile(`${O}/logo-blanc.png`);
await sharp(`${D}/logos/logo-horitzontal.svg`, { density: 300 }).resize({ width: 480 }).png().toFile(`${O}/logo.png`);
await sharp(`${D}/logos/logo-icona.svg`, { density: 300 }).resize({ width: 96 }).png().toFile(`${O}/icona.png`);
await sharp(`${D}/img/aeria.jpg`).resize({ width: 1200, height: 520, fit: 'cover', position: 'centre' }).modulate({ brightness: 0.9 }).jpeg({ quality: 72, progressive: true }).toFile(`${O}/hero.jpg`);
await sharp(`${D}/img/ruta-21k-color.svg`, { density: 200 }).resize({ width: 520 }).png().toFile(`${O}/ruta.png`);
console.log('ok');
