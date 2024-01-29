# WebGallery

# Cara menjalankan WebGallery
🔸 Kofigurasi Backend
- Lakukan kloning repository pada perangkat Anda dengan mengeksekusi perintah:
### `git clone git@github.com:Ridwan-z/WebGallery.git`
- Gunakan editor kode atau IDE favorit Anda untuk membuka folder yang telah di-klon.
- Pastikan NodeJS dan NPM terpasang pada sistem Anda. Jika belum, silakan lakukan instalasi.
- Buka terminal dan navigasikan ke dalam direktori /backend.
- Eksekusi perintah
### `composer install`
- Salin file .env.example, tempelkan di dalam folder backend, dan ubah namanya menjadi .env.
- Buat database baru dengan nama web_gallery.
- Isi URL database ke dalam file .env dengan mengubah nilai DB_DATABASE=web_gallery.
- Setelah itu, tambahkan kode berikut setelah kode VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}":
`SESSION_DOMAIN=localhost`
`SANCTUM_STATEFUL_DOMAINS=localhost`
- Eksekusi perintah:
### `php artisan key:generate`
### `php artisan migrate`
### `php artisan serve`

🔸 Kofigurasi Frontend
- Buka terminal baru dan navigasikan ke dalam direktori /frontend.
- Eksekusi perintah: 
### `npm install`
### `npm start`
- Buka peramban web dan kunjungi `http://localhost:3000/home`.
- Selamat, Anda telah berhasil mengeksekusi WebGallery. Mari jelajahi fitur-fiturnya dengan bebas.