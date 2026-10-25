// Menyalin src/index.html + pustaka SheetJS lokal ke www/ (offline di APK)
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
mkdirSync('www', { recursive: true });
copyFileSync('src/index.html', 'www/index.html');
const xlsx = 'node_modules/xlsx/dist/xlsx.full.min.js';
if (!existsSync(xlsx)) throw new Error('xlsx belum terpasang: jalankan "npm install" dulu');
copyFileSync(xlsx, 'www/xlsx.full.min.js');
console.log('www/ siap');
