# 📡 Digiflazz API Integration Guide

Panduan lengkap integrasi API Digiflazz dengan bot Discord ini.

## 🔑 Important Information

### API Base URL
```
https://api.digiflazz.com/v1
```

### API Endpoints yang Digunakan
```
POST /transaction    - Melakukan transaksi
POST /balance        - Cek saldo
POST /pricelist      - Ambil list harga produk
```

### Authentication
Setiap request memerlukan:
- `username` - Username Digiflazz Anda
- `ref_id` - Reference ID unik (opsional tapi recommended)
- `sign` - MD5 hash dari: `username + apiKey + ref_id`

## 📋 Detailed Endpoints

### 1. Transaction Endpoint
**Purpose:** Melakukan transaksi pembelian produk

**URL:** `POST /transaction`

**Required Parameters:**
```json
{
  "username": "your_username",
  "buyer_sku_code": "AXIS100",
  "customer_no": "081234567890",
  "ref_id": "unique_transaction_id",
  "sign": "md5_hash_signature",
  "notes": "optional_notes"
}
```

**Response (Success):**
```json
{
  "status": "00",
  "message": "Transaksi berhasil",
  "data": {
    "sisa_saldo": 450000,
    "tgl": "2024-01-20 10:30:45",
    "no_ref": "ref_id_dari_anda"
  }
}
```

**Response (Failed):**
```json
{
  "status": "02",
  "message": "Saldo tidak cukup",
  "data": {}
}
```

**Status Codes:**
- `00` = Success
- `01` = Pending (proses)
- `02` = Failed (gagal)

---

### 2. Balance Endpoint
**Purpose:** Mengecek saldo akun Digiflazz

**URL:** `POST /balance`

**Required Parameters:**
```json
{
  "username": "your_username",
  "ref_id": "unique_id",
  "sign": "md5_hash_signature"
}
```

**Response:**
```json
{
  "status": "00",
  "saldo": 500000,
  "message": "success"
}
```

---

### 3. Price List Endpoint
**Purpose:** Mendapatkan list harga produk

**URL:** `POST /pricelist`

**Required Parameters:**
```json
{
  "username": "your_username",
  "buyer_sku_code": "AXIS100",
  "ref_id": "unique_id",
  "sign": "md5_hash_signature"
}
```

**Response:**
```json
{
  "status": "00",
  "data": [
    {
      "buyer_sku_code": "AXIS100",
      "buyer_product_status": 1,
      "buyer_product_name": "AXIS 100 Ribu",
      "buyer_product_description": "...",
      "buyer_product_price": 97000
    }
  ]
}
```

---

## 🔒 Security Requirements

### 1. IP Whitelisting
⚠️ **PENTING:** Whitelist IP Anda di dashboard Digiflazz!

Default Digiflazz IP: `52.74.250.133`

Jika bot Anda di VPS, tambahkan IP VPS Anda ke whitelist.

**How to Whitelist:**
1. Login ke https://www.digiflazz.com/
2. Go to Settings → IP Whitelist
3. Add your IP address
4. Save

### 2. API Key Security
- JANGAN share API key Anda
- Keep `.env` file private
- Regenerate key jika exposed
- Use environment variables

### 3. Request Headers
```
Content-Type: application/json
```

---

## 📝 Example Transaction Flow

```
1. User: mlcek5.47852212078/username
   
2. Bot Parse:
   SKU = mlcek5
   Nomor = 47852212078
   ID Tujuan = username
   
3. Bot Generate Signature:
   ref_id = BOT1785327645384wgtu
   sign = md5("your_username" + "api_key" + "BOT1785327645384wgtu")
   
4. Bot Send Request:
   POST https://api.digiflazz.com/v1/transaction
   {
     "username": "your_username",
     "buyer_sku_code": "mlcek5",
     "customer_no": "47852212078",
     "ref_id": "BOT1785327645384wgtu",
     "sign": "c1b1b1b1b1b1b1b1b1b1",
     "notes": "username"
   }
   
5. Digiflazz Response:
   {
     "status": "00",
     "message": "Transaksi berhasil",
     "data": {
       "sisa_saldo": 450000,
       "tgl": "2024-01-20 10:30:45",
       "no_ref": "BOT1785327645384wgtu"
     }
   }
   
6. Bot Reply:
   ✅ Transaksi Berhasil
   SKU: mlcek5
   Nomor: 47852212078
   Status: Sukses
   Sisa Saldo: Rp 450.000
```

---

## 🧪 Testing API Manually

### Using cURL

**Test Balance:**
```bash
curl -X POST https://api.digiflazz.com/v1/balance \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "ref_id": "test123",
    "sign": "YOUR_MD5_HASH"
  }'
```

**Test Transaction:**
```bash
curl -X POST https://api.digiflazz.com/v1/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "buyer_sku_code": "AXIS100",
    "customer_no": "081234567890",
    "ref_id": "test123",
    "sign": "YOUR_MD5_HASH",
    "notes": "test"
  }'
```

### Generate MD5 Hash

**Node.js:**
```javascript
const crypto = require('crypto');

const username = "your_username";
const apiKey = "your_api_key";
const refId = "test123";

const sign = crypto.createHash('md5')
  .update(username + apiKey + refId)
  .digest('hex');

console.log(sign);
```

**Python:**
```python
import hashlib

username = "your_username"
api_key = "your_api_key"
ref_id = "test123"

sign = hashlib.md5(
  (username + api_key + ref_id).encode()
).hexdigest()

print(sign)
```

---

## ❌ Common Errors & Solutions

### 404 Not Found
**Cause:** Endpoint URL salah atau typo

**Solution:**
- Check endpoint nama (transaction, bukan transaksi)
- Pastikan base URL benar: `https://api.digiflazz.com/v1`
- Check parameter names

**Bot Code:**
```javascript
// BENAR:
const response = await this.client.post('/transaction', payload);

// SALAH:
const response = await this.client.post('/transaksi', payload);
```

### 401 Unauthorized
**Cause:** Username, API Key, atau signature salah

**Solution:**
- Verify username & API key di .env
- Check MD5 signature generation
- Ensure correct parameter order: username + apiKey + refId

### 403 Forbidden
**Cause:** IP address tidak ter-whitelist

**Solution:**
1. Login ke Digiflazz dashboard
2. Go to Settings → IP Whitelist
3. Add your server IP
4. Wait 5-10 minutes for propagation

### Saldo Tidak Cukup
**Cause:** Balance tidak cukup untuk transaksi

**Solution:**
- Top up saldo Digiflazz
- Check balance dengan command: `!balance`
- Verify product price

### Invalid SKU
**Cause:** SKU tidak valid atau tidak active

**Solution:**
- Check SKU format di Digiflazz
- Ensure product is active in dashboard
- Try with different SKU

---

## 🔧 Troubleshooting

### Bot tidak merespon transaksi

**Step 1: Check logs**
```bash
# Lihat console output saat npm start
npm start
# Cari [Digiflazz] prefix
```

**Step 2: Verify format**
```
Benar: mlcek5.47852212078/username
Salah: mlcek5.47852212078 (tanpa /username)
```

**Step 3: Test endpoint manually**
```bash
# Test dengan curl atau Postman
curl -X POST https://api.digiflazz.com/v1/balance \
  -H "Content-Type: application/json" \
  -d '{"username":"test","ref_id":"test","sign":"test"}'
```

**Step 4: Check .env**
```bash
# Verify credentials
cat .env
# Should have:
# DIGIFLAZZ_USERNAME=your_username
# DIGIFLAZZ_API_KEY=your_api_key
```

### Signature mismatch

**Ensure correct order:**
```javascript
// Format: username + apiKey + refId (PENTING: URUTAN!)
const sign = md5(username + apiKey + refId);

// JANGAN:
const sign = md5(username + refId + apiKey); // SALAH!
const sign = md5(apiKey + username + refId); // SALAH!
```

### Request timeout

**Causes:**
- Internet connection slow
- Digiflazz server down
- Firewall blocking request

**Solution:**
- Check internet connection
- Increase timeout in .env: `REQUEST_TIMEOUT=15000`
- Verify IP whitelisting

---

## 📚 Additional Resources

**Official Digiflazz Documentation:**
- https://developer.digiflazz.com/api

**Supported Products:**
- Pulsa (GSM/CDMA)
- Paket Data
- Token PLN
- Voucher Game
- Dll.

**Need Help?**
- Contact Digiflazz support
- Check bot logs: `npm start`
- Verify credentials in .env

---

## ✅ Pre-Launch Checklist

Before deploying to production:

- [ ] API credentials (.env) verified
- [ ] IP whitelisted at Digiflazz
- [ ] Test transaction successful
- [ ] Test balance check successful
- [ ] Discord bot online
- [ ] MESSAGE CONTENT INTENT enabled
- [ ] No 404 errors
- [ ] Logs show successful connection
- [ ] Product SKU codes verified
- [ ] Saldo sufficient for testing

---

**Last Updated:** 2024
**API Version:** v1
**Status:** ✅ Working
