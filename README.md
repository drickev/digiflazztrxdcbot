# 🤖 Digiflazz Discord Bot

Bot Discord untuk melakukan transaksi Digiflazz secara otomatis. Cukup kirimkan format tertentu, bot akan memproses transaksi ke akun Digiflazz Anda.

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Cara Kerja](#cara-kerja)
- [Setup](#setup)
- [Penggunaan](#penggunaan)
- [Command](#command)
- [Troubleshooting](#troubleshooting)

## ✨ Fitur

✅ Transaksi otomatis ke Digiflazz dengan format sederhana
✅ Support semua tipe layanan Digiflazz (Pulsa, Data, PLN, Game Voucher)
✅ Validasi format dan data otomatis
✅ Response dengan embed yang cantik
✅ Logging transaksi ke channel khusus
✅ Command untuk cek balance, status bot, help
✅ Error handling komprehensif
✅ Timezone dan timestamp tracking

## 🔧 Cara Kerja

```
User mengetik di Discord:
AXIS100.081234567890/username_tujuan
         ↓
Bot parsing format
         ↓
Bot validasi data
         ↓
Bot kirim request ke API Digiflazz dengan signature MD5
         ↓
Digiflazz proses transaksi
         ↓
Bot terima response
         ↓
Bot reply dengan status: SUKSES / GAGAL / PENDING
```

### Autentikasi Digiflazz

Bot menggunakan MD5 signature untuk autentikasi:
- Signature = MD5(username + api_key + ref_id)
- Reference ID = Unique ID untuk setiap transaksi
- Setiap request akan dicatat dengan ref_id untuk tracking

## 📦 Setup

### 1. Prerequisites

- Node.js v18 atau lebih baru
- NPM atau Yarn
- Discord Bot Token
- Digiflazz Account (username + API key)

### 2. Install Dependencies

```bash
cd digiflazz-bot
npm install
# atau
yarn install
```

### 3. Setup Environment Variables

Copy `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit `.env` dan isi nilai-nilai berikut:

```env
# Discord Bot Token (dari Discord Developer Portal)
DISCORD_TOKEN=your_discord_bot_token_here

# Digiflazz Username dan API Key
DIGIFLAZZ_USERNAME=your_digiflazz_username
DIGIFLAZZ_API_KEY=your_digiflazz_api_key

# Optional: Channel ID untuk logging transaksi
LOG_CHANNEL_ID=your_log_channel_id_optional

# Command prefix (default: !)
COMMAND_PREFIX=!
```

### 4. Cara Mendapatkan Discord Bot Token

1. Buka [Discord Developer Portal](https://discord.com/developers/applications)
2. Klik "New Application" dan beri nama
3. Pergi ke tab "Bot"
4. Klik "Add Bot"
5. Di bagian TOKEN, klik "Copy"
6. Paste ke `.env` sebagai `DISCORD_TOKEN`

**PENTING: Jangan share token dengan siapapun!**

### 5. Invite Bot ke Server

1. Di Developer Portal, buka tab "OAuth2" → "URL Generator"
2. Pilih scopes: `bot`
3. Pilih permissions:
   - `Send Messages`
   - `Embed Links`
   - `Read Messages/View Channels`
   - `Read Message History`
4. Copy generated URL dan buka di browser
5. Pilih server dan authorize

### 6. Enable Message Content Intent

1. Di Developer Portal, tab "Bot"
2. Scroll ke "Privileged Gateway Intents"
3. Enable: `MESSAGE CONTENT INTENT`
4. Klik "Save Changes"

**Ini penting! Tanpa ini, bot tidak bisa membaca isi pesan.**

### 7. Jalankan Bot

Development mode (dengan auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Bot akan menampilkan pesan "DIGIFLAZZ DISCORD BOT READY ✅" jika berhasil.

## 🚀 Penggunaan

### Format Transaksi

Format sederhana yang harus diikuti user:

```
SKU.nomor/idtujuan
```

Dimana:
- **SKU**: Kode produk Digiflazz (contoh: AXIS100, TELKOMSEL50)
- **nomor**: Nomor tujuan (HP untuk pulsa, meter untuk PLN)
- **idtujuan**: ID tujuan transaksi (bisa username, nickname, atau apapun)

### Contoh Penggunaan

**Pulsa AXIS 100rb ke nomor:**
```
AXIS100.081234567890/username_tujuan
```

**Data Telkomsel 50rb ke nomor:**
```
TELKOMSEL50.089876543210/nama_game
```

**PLN Token 100rb:**
```
PLN100000.123456789012/pembayaran
```

**Game Voucher (Mobile Legends, CODM, dll):**
```
CODM5000.usernamecodm/nickname
```

### Format yang Valid

✅ Valid:
```
AXIS100.081234567890/user
TELKOMSEL50.089876543210/nama_game
PLN100000.123456789012/username
```

❌ Invalid:
```
AXIS100 081234567890 user  (spasi, bukan . dan /)
AXIS.081234567890/user     (SKU tidak boleh cuma AXIS)
AXIS100.user/081234567890  (urutan salah)
```

### Response Bot

**Jika Sukses:**
- Embed hijau dengan status "✅ Transaksi Berhasil"
- Tampil semua detail transaksi + Ref ID

**Jika Gagal:**
- Embed merah dengan status "❌ Transaksi Gagal"
- Tampil pesan error dari Digiflazz

**Jika Pending:**
- Embed orange dengan status "⏳ Transaksi Pending"
- Pesan untuk menunggu proses selesai

**Jika Format Salah:**
- Embed kuning dengan pesan error format
- Tampil contoh format yang benar

## 💬 Command

Gunakan prefix `!` untuk menjalankan command (bisa diubah di `.env`):

### `!help`
Tampilkan panduan lengkap penggunaan bot

```
!help
```

### `!balance`
Cek saldo akun Digiflazz Anda

```
!balance
```

Response:
```
💰 Cek Saldo
Saldo Anda: Rp 1.500.000
```

### `!status`
Cek status bot dan koneksi

```
!status
```

Response:
```
🟢 Bot Status
🤖 Bot Name: Digiflazz Bot
⏰ Uptime: 2d 5h 30m
📊 Guild Count: 3
👥 User Count: 250
📡 Ping: 45ms
🔗 Digiflazz API: Connected ✅
```

### `!ping`
Check response time bot

```
!ping
```

Response:
```
🏓 Pong!
📊 Discord Ping: 45ms | API Ping: 50ms
```

## 📝 Logging

Jika Anda set `LOG_CHANNEL_ID` di `.env`, setiap transaksi akan tercatat di channel tersebut dengan informasi:
- Status transaksi (SUCCESS/FAILED/PENDING)
- User yang melakukan transaksi
- Detail transaksi (SKU, nomor, tujuan)
- Ref ID untuk tracking

Contoh log:
```
📋 Transaksi SUCCESS
User: username#1234
User ID: 123456789
SKU: AXIS100
Nomor: 081234567890
Tujuan: username_game
Ref ID: BOT1693456789abc
Channel: #transaksi
```

## 🐛 Troubleshooting

### Bot tidak online

**Error: "Gagal login bot: Invalid token"**

Solusi:
- Cek apakah `DISCORD_TOKEN` di `.env` benar
- Generate ulang token di Discord Developer Portal
- Pastikan tidak ada spasi di awal/akhir token

**Error: "Cannot read messages"**

Solusi:
- Enable "MESSAGE CONTENT INTENT" di Developer Portal
- Invite ulang bot dengan scope dan permission yang tepat

### Transaksi tidak dikirim ke Digiflazz

**Error: "Koneksi timeout"**

Solusi:
- Cek koneksi internet
- Coba lagi dalam beberapa saat
- Pastikan API Digiflazz sedang online

**Error: "Username atau API Key tidak valid"**

Solusi:
- Verify `DIGIFLAZZ_USERNAME` dan `DIGIFLAZZ_API_KEY` di `.env`
- Login ke dashboard Digiflazz dan verify credentials
- Copy ulang API key dari dashboard

### Format error

**"Format tidak valid. Gunakan: SKU.nomor/idtujuan"**

Solusi:
- Ikuti format dengan benar
- Gunakan titik (.) dan slash (/)
- Jangan pakai spasi

### Transaksi pending terus

- Jangan kirim ulang transaksi yang sama
- Tunggu hingga Digiflazz selesai memproses
- Jika sudah lama, hubungi support Digiflazz dengan Ref ID

## 📞 Support

Jika mengalami masalah:

1. Cek kembali `.env` file
2. Baca bagian Troubleshooting
3. Cek console log untuk error message detail
4. Hubungi support dengan Ref ID transaksi

## 📜 License

MIT License

## ⚠️ Disclaimer

Bot ini bersifat edukatif. Pastikan Anda:
- Hanya menggunakan di server Anda sendiri atau dengan izin owner
- Mengerti risiko keamanan (jangan share token/API key)
- Mematuhi Terms of Service Discord dan Digiflazz
- Bertanggung jawab atas transaksi yang dilakukan

---

**Happy Transacting! 🎉**
