# ⚡ Quick Start - Digiflazz Discord Bot

TL;DR untuk yang ingin langsung setup.

## 🎯 5 Menit Setup

### 1. Install & Setup

```bash
# Clone/download
cd digiflazz-bot

# Install dependencies
npm install

# Copy dan edit .env
cp .env.example .env
# Edit dengan editor favorit, isi:
# - DISCORD_TOKEN (dari Discord Dev Portal)
# - DIGIFLAZZ_USERNAME
# - DIGIFLAZZ_API_KEY
```

### 2. Discord Bot Token

1. Buka https://discord.com/developers/applications
2. New Application → Add Bot
3. Copy token ke `DISCORD_TOKEN` di `.env`
4. Enable "MESSAGE CONTENT INTENT"
5. Invite bot ke server (OAuth2 > URL Generator > bot scope)

### 3. Jalankan

```bash
npm start
```

### 4. Test

Di Discord:
```
!ping
```

Bot harus reply dengan ping time.

---

## 📝 Format Transaksi

```
SKU.nomor/idtujuan
```

**Contoh:**
- `AXIS100.081234567890/user` - Pulsa AXIS 100rb
- `TELKOMSEL50.089876543210/game` - Data Telkomsel 50rb
- `PLN100000.123456789012/payment` - PLN Token

---

## 🎮 Command

```
!help      - Bantuan
!balance   - Cek saldo
!status    - Status bot
!ping      - Response time
```

---

## 🔑 Credentials

**Dari Discord Developer Portal:**
- Application → Bot → TOKEN (copy ini)
- Bot → MESSAGE CONTENT INTENT (enable ini!)

**Dari Digiflazz Dashboard:**
- Settings → API Credentials
- Copy username dan API key

---

## 🐛 Troubleshoot

| Error | Solusi |
|-------|--------|
| `Invalid token` | Generate ulang token di Discord Portal |
| `Cannot read messages` | Enable MESSAGE CONTENT INTENT |
| `API error` | Cek DIGIFLAZZ_USERNAME dan API_KEY |
| Bot offline | Cek error di terminal, baca log |
| Format error | Gunakan format: `SKU.nomor/id` |

---

## 📁 File Structure

```
├── .env ← Edit ini (credentials)
├── src/
│   ├── index.js (main bot)
│   ├── config.js (config)
│   ├── handlers/
│   │   ├── message-handler.js (transaksi)
│   │   └── command-handler.js (command)
│   └── utils/
│       ├── parser.js (parse format)
│       ├── digiflazz-api.js (API client)
│       └── embed-builder.js (response)
├── package.json
├── README.md (detailed guide)
└── TECHNICAL_DOCS.md (for developers)
```

---

## 📖 Dokumentasi Lengkap

- **README.md** - User guide & features
- **SETUP_GUIDE.md** - Step-by-step setup
- **TECHNICAL_DOCS.md** - Technical details

---

## 🔒 Security

- ❌ Jangan share `.env` file
- ❌ Jangan push ke GitHub
- ❌ Jangan share token/API key

---

**Sudah siap? Baca README.md untuk panduan lengkap!**
