# Scanner LJK OMR — APK Android (gratis, tanpa Play Store)

Membungkus `index.html` (Scanner LJK OMR) menjadi APK memakai Capacitor. APK dibangun gratis di GitHub Actions, jadi **Android Studio tidak diperlukan**.

## Cara 1 — Build APK via GitHub Actions (disarankan)
1. Buat repository baru di GitHub (public atau private).
2. Unggah **seluruh isi folder ini** (termasuk folder tersembunyi `.github`). Lewat terminal:
   ```bash
   git init && git add . && git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
3. Buka tab **Actions** → workflow **Build APK** (otomatis jalan setelah push; bisa juga **Run workflow**). Durasi ± 5–8 menit.
4. Setelah hijau, buka run tersebut → bagian **Artifacts** → unduh **Scanner-LJK-APK** → ekstrak ZIP → `app-debug.apk`.
5. Pindahkan ke HP → buka → izinkan *Install dari sumber tidak dikenal*. Jika muncul peringatan Play Protect, pilih *Tetap instal*.

## Cara 2 — Build lokal (Android Studio/JDK 21 + Node 20+)
```bash
npm install
node scripts/prepare.mjs
npx cap add android
node scripts/patch-android.mjs
npx cap sync android
cd android && ./gradlew assembleDebug
# hasil: android/app/build/outputs/apk/debug/app-debug.apk
```

## Cara 3 — PWA (tanpa APK, paling cepat)
Folder `pwa/` siap di-hosting statis (Netlify / GitHub Pages, HTTPS). Buka di Chrome Android → menu ⋮ → **Instal aplikasi**. Pustaka Excel (CDN) ter-cache setelah pertama dipakai.

## Yang disesuaikan untuk Android
| Fitur di web | Perilaku di APK |
|---|---|
| Unduh `.xlsx` / ekspor `.json` (`<a download>` + blob) | Ditangkap shim → disimpan ke cache → *Share sheet* (simpan ke Drive/File/WhatsApp) |
| `print()` (Cetak LJK / laporan) | Plugin native `NativePrint` → dialog cetak Android → **Simpan sebagai PDF** |
| Kamera `getUserMedia` & `capture` | Izin `CAMERA` ditambahkan; origin `https://localhost` (secure context) |
| SheetJS dari cdnjs | Dibundel lokal (`www/xlsx.full.min.js`), jalan offline |
| `localStorage` | Tetap berfungsi; hilang jika aplikasi di-uninstall → gunakan **Ekspor hasil** sebagai cadangan |

## Catatan
- APK bertipe *debug* (ter-sign otomatis) — cukup untuk sideload pribadi/dibagikan.
- Saat mencetak LJK, di dialog cetak pilih ukuran kertas sesuai Template dan skala 100% (jangan *fit to page*); WebView Android tidak selalu menghormati `@page size`.
- Untuk mengubah aplikasi: edit `src/index.html`, lalu push — APK baru dibangun otomatis.
- Nama/ID aplikasi: `capacitor.config.json` (`appName`, `appId`).
