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
git clone https://github.com/username/web-scraper-tool.git
cd web-scraper-tool
````

### 3. Instalasi Dependencies

```bash
npm install
```

---

## 🚀 Menjalankan Aplikasi

### 1. Jalankan Server

```bash
npm start
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

### 🔗 URL Mode

1. Klik tombol **"URL Mode"**.
2. Masukkan URL produk.
3. Klik **"🚀 Mulai Scraping URL"**.
4. Tunggu hingga proses selesai (akan muncul popup loading).
5. Unduh file hasil scraping dalam format CSV.

---

## 📂 Struktur Proyek

```
web-scraper-tool/
├── backend/               # Server dan scraping logic
├── frontend/              # Antarmuka pengguna
├── public/                # Aset statis
├── output/                # Hasil scraping (CSV)
├── .env                   # Konfigurasi environment
├── package.json
└── README.md
```

---

## 🖼️ Screenshot Tampilan

### 1. Halaman Utama

![Halaman Utama](https://via.placeholder.com/800x400?text=Halaman+Utama)

### 2. Keyword Mode

![Keyword Mode](https://via.placeholder.com/800x400?text=Keyword+Mode)

### 3. URL Mode

![URL Mode](https://via.placeholder.com/800x400?text=URL+Mode)

### 4. Popup Loading

![Popup Loading](https://via.placeholder.com/800x400?text=Popup+Loading)

---

## 🛠️ Teknologi yang Digunakan

* **Node.js** — Backend server
* **Express.js** — Framework server
* **Puppeteer** — Library untuk scraping data
* **Tailwind CSS** — Styling frontend
---

## 📜 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.
