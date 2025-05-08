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
[git clone https://github.com/username/web-scraper-tool.git](https://github.com/p3nnatr4tion/aliexpress-web-scraper-page.git)
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

### 1. Keyword Mode

![image_2025-05-08_10-53-03](https://github.com/user-attachments/assets/0ce08a85-f22e-4de2-badd-fc916749fcbf)

### 2. URL Mode

![image_2025-05-08_10-53-15](https://github.com/user-attachments/assets/324b9c59-7b64-4351-8f7a-0d7e62991eeb)

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
