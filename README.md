# 🏘️ Aplikasi Pencarian Kecamatan

Dokumen ini menjelaskan langkah-langkah untuk melakukan setup dan menjalankan aplikasi pencarian kecamatan menggunakan Docker.

---

## 📋 Prasyarat

Pastikan Anda telah menginstal:

- [Git](https://git-scm.com/downloads)
- [Composer](https://getcomposer.org/download/)
- [Docker](https://docs.docker.com/engine/install/ubuntu/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## 🚀 Langkah-langkah Setup

### 1. Clone Repository

Clone repository project ke dalam direktori lokal Anda:

```bash
git clone git@github.com:sangvictim/troben-logistik.git
cd troben-logistik
```
### 2. Jalankan Aplikasi dengan Docker
Setelah masuk ke direktori project, jalankan perintah berikut untuk membangun dan menjalankan container:
```bash
docker compose up --build
```
Perintah ini akan:

 - Membangun image Docker yang diperlukan berdasarkan konfigurasi Dockerfile.

- Menjalankan container sesuai pengaturan pada docker-compose.yml.

### 3. Akses Aplikasi
Setelah container berhasil berjalan, Anda dapat mengakses aplikasi melalui browser di alamat:
```bash
http://localhost:8000
```