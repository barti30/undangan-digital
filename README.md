# Undangan Pernikahan Next.js

## Cara menjalankan
```bash
npm install
npm run dev
```
Buka http://localhost:3000?to=NamaTamu

## Yang perlu kamu ganti
1. `public/images/bg.jpg` -> sudah diisi gambar ilustrasimu, ganti kalau mau pakai gambar lain (perhatikan posisi wajah, lihat poin 3).
2. `public/audio/music.mp3` -> tambahkan file musik latar (opsional).
3. `components/OpeningScreen.jsx`:
   - Object `FOCUS` di paling atas file = titik fokus kamera dalam persen (x% y%) dari gambar. Kalau ganti gambar dan posisi wajah beda, sesuaikan angka `bride`, `groom`, `left`, `right`.
   - Array `SEQUENCE` = urutan animasi kamera (zoom ke mana, berapa lama transisi `trans`, berapa lama bertahan `hold`, overlay teks apa yang muncul). Urutan array = urutan tampil, ubah/tambah/hapus baris sesuai kebutuhan.
   - Teks Bismillah, nama, lokasi, ayat Quran ada langsung di JSX komponen ini, tinggal edit.
4. `components/MainContent.jsx` -> data mempelai, tanggal, lokasi untuk konten setelah undangan dibuka.

## Deploy
Push ke GitHub lalu import project ke https://vercel.com (gratis, otomatis build Next.js).
