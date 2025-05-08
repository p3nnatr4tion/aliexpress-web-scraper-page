# AliExpress Web Scraper Page

Web Scraper to CSV from AliExpress (Keyword-Page and Product URL) **without API key**.

## 🧰 Web Scraper Tool

🔍 **Web Scraper Tool** adalah aplikasi berbasis **Node.js** yang memungkinkan pengguna melakukan scraping data dari situs e-commerce **AliExpress**. Aplikasi ini mendukung dua mode scraping:

1. **Keyword Mode** — Scraping berdasarkan kata kunci dan jumlah halaman.
2. **URL Mode** — Scraping berdasarkan URL produk tertentu.

---

## 📋 Fitur

- Scraping data produk dari AliExpress.
- Mendukung dua mode scraping: kata kunci dan URL.
- Popup loading saat proses scraping berlangsung.
- Hasil scraping dapat diunduh dalam format **CSV**.

---

## 🛠️ Instalasi

### 1. Persyaratan Sistem

- **Node.js**: `>=22.15.0`
- **npm**: `>=10.9.2`
- **Google Chrome**: Pastikan terinstal di sistem Anda.

### 2. Clone Repository

```bash
git clone https://github.com/p3nnatr4tion/aliexpress-web-scraper-page.git
cd aliexpress-web-scraper-page
````

### 3. Instalasi Dependencies

```bash
npm install
```

---

## 🚀 Menjalankan Aplikasi

### 1. Jalankan Server

```bash
node server-dev2.js
```

Server akan berjalan di: [http://localhost:3002](http://localhost:3002)

### 2. Akses Frontend

Buka browser dan kunjungi URL di atas.

---

## 📖 Panduan Penggunaan

### 🔑 Keyword Mode

1. Klik tombol **"Keyword Mode"**.
2. Masukkan kata kunci pencarian dan jumlah halaman.
3. Klik **"🚀 Mulai Scraping"**.
4. Tunggu hingga proses selesai (akan muncul popup loading).
5. Unduh file hasil scraping dalam format CSV.

### 📁 Hasil CSV untuk Keyword Mode
File CSV akan disimpan di direktori proyek dengan nama:
```bash
aliexpress_<keyword>_page<jumlahHalaman>.csv
Contoh: aliexpress_laptop_page2.csv
```
File ini berisi data produk seperti nama produk, harga, diskon, ulasan, dan lainnya.

### 🔗 URL Mode

1. Klik tombol **"URL Mode"**.
2. Masukkan URL produk.
3. Klik **"🚀 Mulai Scraping URL"**.
4. Tunggu hingga proses selesai (akan muncul popup loading).
5. Unduh file hasil scraping dalam format CSV.

### 📁 Hasil CSV untuk URL Mode
File CSV akan disimpan di direktori proyek dengan nama:
```bash
aliexpress_<tanggal>.csv
Contoh: aliexpress_2025-05-08.csv
```
File ini berisi data produk dari URL yang dimasukkan, termasuk nama produk, harga, ulasan, dan lainnya.

---

## 📂 Struktur Proyek

```
aliexpress-web-scraper-page/
├── frontend-v1.html                 # Antarmuka pengguna utama
├── scraper-frontend-input-url.js    # Script scraping untuk mode URL
├── scraper-frontend-key-page.js     # Script scraping untuk mode Keyword
├── server-dev2.js                   # Server backend dan handler scraping
├── README.md                        # Dokumentasi proyek
```

---

## 🖼️ Screenshot Tampilan

### 1. Keyword Mode
![image](https://github.com/user-attachments/assets/28bd5e2d-dd82-45ce-98a1-f3398f0e69e1)

### 2. URL Mode
![image](https://github.com/user-attachments/assets/41d6cc05-404d-40be-b1c5-dcae40015586)
Format URL (wajib) berupa:
```bash
https://www.aliexpress.com/item/1005002878829589.html
```

### 3. Popup Loading dan Notif Hasil CSV
![image_2025-05-08_10-46-44](https://github.com/user-attachments/assets/b844734a-af43-41c6-91a8-162782e4a45a)

---

## 🛠️ Teknologi yang Digunakan

* **Node.js** — Backend server
* **Express.js** — Framework server
* **Puppeteer** — Library untuk scraping data
* **Tailwind CSS** — Styling frontend
---

## 📜 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.
