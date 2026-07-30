# Digiflazz API Response Format Guide

## Overview

Dokumentasi lengkap tentang format request dan response dari Digiflazz API v1 sesuai dengan endpoint yang berbeda.

## Request Format

### Endpoint: `/transaction` (Topup)

**Method:** POST

**Headers:**
```
Content-Type: application/x-www-form-urlencoded
```

**Body Parameters:**
```
username       : String    - Username Digiflazz (dari env DIGIFLAZZ_USERNAME)
buyer_sku_code: String    - Kode produk (SKU) dari Digiflazz
customer_no    : String    - Nomor tujuan (HP, ID, username game, dll)
ref_id         : String    - Reference ID unik (di-generate bot)
sign           : String    - MD5 signature: md5(username + apiKey + ref_id)
```

**Example:**
```json
{
  "username": "your_digiflazz_username",
  "buyer_sku_code": "mlcek5",
  "customer_no": "47852212078",
  "ref_id": "BOT1785372912417ui9t",
  "sign": "abc123...hash"
}
```

## Response Format

### Success Response (Status: Pending/Processing)

Digiflazz mengembalikan response dengan struktur berikut:

```json
{
  "data": {
    "ref_id": "BOT1785372912417ui9t",
    "customer_no": "47852212078",
    "buyer_sku_code": "mlcek5",
    "message": "",
    "status": "Pending",
    "rc": "",
    "buyer_last_saldo": 990000,
    "sn": "",
    "price": 10000,
    "tele": "@telegram",
    "wa": "081234512345"
  }
}
```

### Response Fields Explanation

| Field | Type | Description |
|-------|------|-------------|
| `ref_id` | String | Reference ID transaksi (yang kita kirim) |
| `customer_no` | String | Nomor tujuan |
| `buyer_sku_code` | String | Kode produk |
| `message` | String | Pesan dari Digiflazz (biasanya kosong untuk success) |
| `status` | String | Status transaksi: "Pending", "Success", "Failed", dll |
| `rc` | String | Response code (biasanya kosong untuk pending) |
| `buyer_last_saldo` | Number | Saldo terakhir setelah transaksi |
| `sn` | String | Serial number (kosong jika pending) |
| `price` | Number | Harga produk yang dibeli |
| `tele` | String | Contact telegram support |
| `wa` | String | Contact WhatsApp support |

### Status Values

- **Pending** - Transaksi sedang diproses oleh Digiflazz
- **Success** - Transaksi berhasil
- **Failed** - Transaksi gagal
- **Cancelled** - Transaksi dibatalkan

### Error Response

Jika request gagal (kredensial salah, IP tidak whitelisted, dll):

```json
{
  "data": {
    "ref_id": "BOT1785372912417ui9t",
    "status": "Gagal",
    "rc": "403",
    "message": "Signature tidak valid / IP tidak terdaftar"
  }
}
```

### Possible Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| IP tidak terdaftar | Server IP not whitelisted | Add IP to Digiflazz settings |
| Signature tidak valid | Wrong MD5 hash | Check username, API key, ref_id |
| Saldo tidak cukup | Insufficient balance | Topup saldo di Digiflazz |
| Produk tidak ditemukan | Invalid SKU | Check buyer_sku_code |
| Username tidak ditemukan | Wrong username | Check DIGIFLAZZ_USERNAME in .env |

## How Bot Processes Response

### 1. Check Response Status

```javascript
if (data.status === "Success" || data.rc === "00") {
  // Transaction successful
  return { success: true, status: "SUKSES" }
} else if (data.status === "Pending") {
  // Transaction pending
  return { success: null, status: "PENDING" }
} else {
  // Transaction failed
  return { success: false, status: "GAGAL" }
}
```

### 2. Extract Data

Bot mengambil informasi penting dari response:
- `ref_id` - Untuk tracking transaksi
- `price` - Harga yang dibayarkan
- `buyer_last_saldo` - Saldo setelah transaksi
- `status` - Status transaksi

### 3. Build Response to Discord

Tergantung status, bot membuat embed dengan warna:
- **Green** (#00FF00) - Success
- **Orange** (#FFA500) - Pending
- **Red** (#FF0000) - Failed

## Example Transaction Flow

### Request
```
User sends: mlcek5.47852212078
```

### Bot Action
```
1. Parse: sku=mlcek5, nomor=47852212078
2. Generate: ref_id=BOT1785372912417ui9t
3. Calculate: sign=md5(username+apikey+refid)
4. Send POST to /transaction with payload
```

### Digiflazz Response
```json
{
  "data": {
    "ref_id": "BOT1785372912417ui9t",
    "customer_no": "47852212078",
    "buyer_sku_code": "mlcek5",
    "message": "",
    "status": "Pending",
    "rc": "",
    "buyer_last_saldo": 990000,
    "sn": "",
    "price": 10000,
    "tele": "@telegram",
    "wa": "081234512345"
  }
}
```

### Bot Discord Reply
```
⏳ Transaksi Pending

Transaksi Anda sedang diproses oleh Digiflazz. Mohon tunggu...

📦 SKU: mlcek5
📱 Nomor: 47852212078
🆔 Ref ID: BOT1785372912417ui9t
⏰ Waktu: 2 minutes ago
💰 Price: Rp 10.000
🔗 Status: PENDING ⏳
```

## Important Notes

1. **Response Format**: Bot hanya menggunakan field yang ada dalam response
2. **idTujuan**: BUKAN bagian dari response Digiflazz, hanya input user
3. **Price**: Selalu ada di response untuk reference
4. **Saldo**: `buyer_last_saldo` adalah saldo SETELAH transaksi
5. **Status Field**: Berbeda dengan HTTP status code

## Testing

Untuk test, gunakan format:
```
SKU.nomor
mlcek5.47852212078
```

Bot akan:
1. Send request ke Digiflazz
2. Receive response dengan structure di atas
3. Parse dan display ke Discord

## Troubleshooting

### Error: `idTujuan is not defined`
- **Cause**: Code masih referencing idTujuan yang sudah dihapus
- **Solution**: Sudah fixed, gunakan update terbaru

### Error: `Price is undefined`
- **Cause**: Response dari Digiflazz tidak include price field
- **Solution**: Bot fallback ke 0, akan ditampilkan sebagai "Rp 0"

### Error: `status tidak dikenali`
- **Cause**: Response status value dari Digiflazz tidak match
- **Solution**: Bot treat sebagai pending/unknown dan highlight untuk review

