# 📖 Setup Guide - Digiflazz Discord Bot

Panduan lengkap untuk setup dan menjalankan Digiflazz Discord Bot dari awal.

## 🎯 Tujuan

Setelah mengikuti guide ini, Anda akan memiliki:
- ✅ Discord bot yang aktif di server Anda
- ✅ Bot terhubung dengan akun Digiflazz
- ✅ Bisa transaksi langsung dari Discord

## 📋 Prasyarat

Pastikan Anda sudah menyiapkan:

1. **Node.js v18+**
   - Download dari https://nodejs.org/
   - Verify: `node --version` (harus v18 atau lebih)

2. **Text Editor atau IDE**
   - VS Code (recommended)
   - Sublime Text
   - Atau text editor apapun

3. **Discord Account** (sudah punya)

4. **Digiflazz Account**
   - Username
   - API Key (bisa didapat dari dashboard)

5. **Terminal/Command Prompt**

## 🚀 Step-by-Step Setup

### Step 1: Download / Clone Bot

**Opsi A: Download ZIP**
1. Download file ini
2. Extract ke folder yang Anda inginkan
3. Buka terminal/command prompt
4. Navigate ke folder: `cd digiflazz-bot`

**Opsi B: Git Clone**
```bash
git clone <repo-url>
cd digiflazz-bot
```

### Step 2: Install Dependencies

Buka terminal di folder `digiflazz-bot` dan jalankan:

```bash
npm install
```

Tunggu hingga selesai. Akan ada output seperti ini:

```
added 80 packages, and audited 81 packages in 9s
found 0 vulnerabilities
```

### Step 3: Setup Discord Bot Token

#### 3.1 Buat Application di Discord Developer Portal

1. Buka https://discord.com/developers/applications
2. Klik tombol **"New Application"**
3. Masukkan nama: `Digiflazz Bot` (atau nama lain)
4. Klik **"Create"**

#### 3.2 Konfigurasi Bot

1. Di sidebar kiri, klik **"Bot"**
2. Klik **"Add Bot"**
3. Di bagian TOKEN, klik **"Copy"** untuk copy token
4. **JANGAN SHARE TOKEN INI KE SIAPAPUN!**

#### 3.3 Enable Message Content Intent

Bot perlu permission untuk membaca isi pesan. Ini PENTING!

1. Masih di tab "Bot", scroll ke bawah
2. Cari **"Privileged Gateway Intents"**
3. Aktifkan switch untuk **"MESSAGE CONTENT INTENT"**
4. Klik **"Save Changes"** (jangan lupa ini!)

#### 3.4 Copy Token ke .env

1. Di folder project, buka file `.env.example`
2. Copy isi ke file baru bernama `.env`
3. Di `.env`, ganti `your_discord_bot_token_here` dengan token yang sudah di-copy
4. Simpan file

Contoh:
```env
DISCORD_TOKEN=MTk4NjIyNDgzNTAxNDQwOTYw.Clwa7A.ZZrCUVOse7YqZoJlkJlkJ1234567890
```

### Step 4: Setup Digiflazz Credentials

#### 4.1 Dapatkan Digiflazz API Key

1. Login ke dashboard Digiflazz: https://digiflazz.com/
2. Pergi ke menu **"Pengaturan"** atau **"Settings"**
3. Cari **"API Key"** atau **"Credentials"**
4. Copy username dan API key

#### 4.2 Input ke .env

Di file `.env` Anda, isi:

```env
DIGIFLAZZ_USERNAME=your_username_here
DIGIFLAZZ_API_KEY=your_api_key_here
```

Contoh:
```env
DIGIFLAZZ_USERNAME=user123
DIGIFLAZZ_API_KEY=abc123def456ghi789
```

### Step 5: Invite Bot ke Server Discord

#### 5.1 Generate Invite URL

1. Kembali ke Discord Developer Portal
2. Di sidebar, klik **"OAuth2"** → **"URL Generator"**
3. Di bagian **SCOPES**, pilih:
   - ✅ `bot`

4. Di bagian **PERMISSIONS**, pilih:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Read Messages/View Channels
   - ✅ Read Message History

5. Di bagian bawah, akan ada generated URL
6. Klik **"Copy"** untuk copy URL

#### 5.2 Invite Bot ke Server

1. Buka URL yang sudah di-copy
2. Di dropdown, pilih server Discord Anda
3. Klik **"Authorize"**
4. Selesaikan CAPTCHA jika diminta
5. Bot akan bergabung ke server Anda!

### Step 6: Konfigurasi Opsional (Recommended)

Edit file `.env` untuk setting tambahan:

```env
# Command prefix (default: !)
COMMAND_PREFIX=!

# Log channel ID (untuk logging transaksi)
# Jika tidak diisi, logging tidak akan dilakukan
LOG_CHANNEL_ID=your_channel_id
```

**Cara mendapatkan Channel ID:**
1. Di Discord, aktifkan Developer Mode (User Settings → Advanced → Developer Mode)
2. Right-click channel → Copy ID
3. Paste ke `.env`

### Step 7: Jalankan Bot

Di terminal, jalankan:

```bash
npm start
```

Atau jika Anda ingin development mode dengan auto-reload:

```bash
npm run dev
```

**Jika berhasil, akan tampil:**

```
╔════════════════════════════════════════════════════════╗
║          🤖 DIGIFLAZZ DISCORD BOT READY ✅             ║
╠════════════════════════════════════════════════════════╣
║  Bot Name     : Digiflazz Bot
║  Guild Count  : 1
║  Prefix       : !
║  API URL      : https://api.digiflazz.com/v1
╚════════════════════════════════════════════════════════╝
```

**Selamat! Bot siap digunakan! 🎉**

## ✅ Verifikasi Setup

### Test 1: Bot Online di Discord

1. Pergi ke server Discord Anda
2. Lihat di member list, bot harus muncul dengan status Online
3. Jika status Offline, cek error di terminal

### Test 2: Test Command

Di channel Discord, ketik:

```
!ping
```

Bot harus reply:
```
🏓 Pong!
📊 Discord Ping: XXms | API Ping: XXms
```

Jika berhasil, berarti bot berfungsi!

### Test 3: Test Balance

Ketik di Discord:
```
!balance
```

Bot harus menampilkan saldo Digiflazz Anda. Jika error, berarti credentials Digiflazz tidak valid.

## 🚀 Cara Menggunakan

Setelah verified, Anda bisa langsung transaksi.

**Format:**
```
SKU.nomor/idtujuan
```

**Contoh:**
```
AXIS100.081234567890/username
```

Bot akan memproses secara otomatis dan reply dengan status transaksi.

## 🐛 Common Errors & Solutions

### ❌ Error: "Cannot find module 'discord.js'"

**Penyebab:** Dependencies belum di-install

**Solusi:**
```bash
npm install
```

---

### ❌ Error: "Invalid token"

**Penyebab:** DISCORD_TOKEN tidak valid atau expired

**Solusi:**
1. Generate ulang token di Discord Developer Portal
2. Copy token yang baru ke `.env`
3. Pastikan tidak ada spasi di awal/akhir

---

### ❌ Error: "Cannot read messages"

**Penyebab:** MESSAGE CONTENT INTENT tidak di-enable

**Solusi:**
1. Buka Discord Developer Portal
2. Bot section → Privileged Gateway Intents
3. Enable "MESSAGE CONTENT INTENT"
4. Klik "Save Changes"
5. Restart bot

---

### ❌ Bot offline saat start

**Penyebab:** Ada error di code atau missing .env

**Solusi:**
1. Cek apakah file `.env` ada di folder
2. Cek apakah DISCORD_TOKEN ada di `.env`
3. Lihat error message di terminal
4. Copy error message dan cari di Google

---

### ❌ Transaksi error "API Digiflazz error"

**Penyebab:** Credentials Digiflazz tidak valid

**Solusi:**
1. Verify DIGIFLAZZ_USERNAME dan DIGIFLAZZ_API_KEY di `.env`
2. Login ke Digiflazz dan double-check credentials
3. Jika belum ada API key, generate dari dashboard
4. Restart bot setelah update `.env`

---

### ❌ Command tidak dikenali (Unknown command)

**Penyebab:** Command typo atau prefix salah

**Solusi:**
1. Pastikan prefix benar (default: `!`)
2. Typing command dengan benar: `!help`, `!balance`, dll
3. Jangan pakai prefix untuk transaksi (format: `SKU.nomor/id`)

---

## 📝 File Structure

```
digiflazz-bot/
├── src/
│   ├── index.js                 # Main bot file
│   ├── config.js                # Configuration
│   ├── utils/
│   │   ├── parser.js            # Format parser
│   │   ├── digiflazz-api.js     # API handler
│   │   └── embed-builder.js     # Discord embed
│   └── handlers/
│       ├── message-handler.js   # Transaction handler
│       └── command-handler.js   # Command handler
├── .env                         # Your credentials (JANGAN PUSH!)
├── .env.example                 # Template .env
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies
├── README.md                    # User guide
├── SETUP_GUIDE.md              # Setup guide (ini)
└── node_modules/               # Dependencies folder
```

## 🔒 Security Best Practices

⚠️ **PENTING - JANGAN LAKUKAN INI:**

1. ❌ Jangan share `.env` file
2. ❌ Jangan push `.env` ke GitHub
3. ❌ Jangan share Discord bot token
4. ❌ Jangan share Digiflazz API key
5. ❌ Jangan beri akses bot ke orang yang tidak terpercaya

✅ **LAKUKAN INI:**

1. ✅ Keep `.env` di `.gitignore` (sudah ada)
2. ✅ Generate ulang token jika merasa terekspos
3. ✅ Gunakan `.env.example` sebagai template
4. ✅ Only share credentials di private channel
5. ✅ Review bot permissions berkala

## 📞 Bantuan Lebih Lanjut

Jika masih ada yang tidak jelas:

1. Baca file `README.md` untuk informasi lebih lengkap
2. Cek error message di terminal
3. Search error message di Google
4. Baca dokumentasi Discord.js: https://discord.js.org/
5. Baca dokumentasi Digiflazz: https://digiflazz.com/

## ✨ Next Steps

Setelah bot siap:

1. **Customize bot**: Edit prefix, embed colors, messages
2. **Add more features**: Custom commands, database logging, dll
3. **Deploy ke server**: Agar bot selalu online (Heroku, VPS, dll)
4. **Invite lebih banyak user**: Share ke teman/server lain

---

**Happy Transacting! 🎉**

Semoga berhasil setup bot-nya. Jika ada pertanyaan, jangan ragu untuk tanya!
