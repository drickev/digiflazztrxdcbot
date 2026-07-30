# 🧪 Testing Guide - Digiflazz Discord Bot

Panduan lengkap untuk testing bot sebelum production deployment.

## 📋 Pre-Testing Checklist

Sebelum mulai test, pastikan:

- [ ] Node.js v18+ installed
- [ ] npm dependencies installed (`npm install`)
- [ ] `.env` file configured with valid credentials
- [ ] Discord bot token valid
- [ ] Digiflazz credentials valid
- [ ] Bot invited to test Discord server
- [ ] MESSAGE CONTENT INTENT enabled
- [ ] Test server has text channels

## ✅ Test Suite 1: Bot Startup

### Test 1.1: Bot Runs Without Errors

```bash
npm start
```

**Expected Result:**
```
╔════════════════════════════════════════════════════════╗
║          🤖 DIGIFLAZZ DISCORD BOT READY ✅             ║
╠════════════════════════════════════════════════════════╣
║  Bot Name     : [Bot Username]
║  Guild Count  : [Number]
║  Prefix       : !
║  API URL      : https://api.digiflazz.com/v1
╚════════════════════════════════════════════════════════╝
```

**Status:** ✅ Pass / ❌ Fail

---

### Test 1.2: Bot Online in Discord

**Expected Result:**
- Bot appears in Discord member list
- Bot status shows "Online" (green dot)

**Status:** ✅ Pass / ❌ Fail

---

## ✅ Test Suite 2: Command Testing

### Test 2.1: !ping Command

**Action:** Send `!ping` in Discord

**Expected Response:**
```
🏓 Pong!
📊 Discord Ping: XXms | API Ping: XXms
```

**Status:** ✅ Pass / ❌ Fail

**Notes:** Ping should be < 200ms

---

### Test 2.2: !help Command

**Action:** Send `!help` in Discord

**Expected Response:**
- Embed message with blue color
- Title: "📖 Panduan Menggunakan Bot"
- Contains format, examples, and instructions

**Status:** ✅ Pass / ❌ Fail

---

### Test 2.3: !balance Command

**Action:** Send `!balance` in Discord

**Expected Response:**
- Embed message with cyan color
- Shows saldo from Digiflazz
- Format: "💰 Cek Saldo"
- Shows correct balance amount

**Status:** ✅ Pass / ❌ Fail

**Notes:** If balance shows 0 or error, check Digiflazz credentials

---

### Test 2.4: !status Command

**Action:** Send `!status` in Discord

**Expected Response:**
- Embed message with green color
- Shows: Bot Name, Uptime, Guild Count, User Count, Ping
- Shows "Digiflazz API: Connected ✅"

**Status:** ✅ Pass / ❌ Fail

---

### Test 2.5: Invalid Command

**Action:** Send `!invalid_command` in Discord

**Expected Response:**
- Show help embed or error message
- Should not crash

**Status:** ✅ Pass / ❌ Fail

---

## ✅ Test Suite 3: Format Validation

### Test 3.1: Valid Format

**Action:** Send `AXIS100.081234567890/testuser` in Discord

**Expected Behavior:**
- Bot processes the message
- Shows "processing" response
- Sends transaction to Digiflazz API

**Status:** ✅ Pass / ❌ Fail

---

### Test 3.2: Invalid Format - Missing Component

**Action:** Send `AXIS100.081234567890` (missing /idtujuan)

**Expected Response:**
- Yellow embed with title "⚠️ Format Tidak Valid"
- Show error message
- Show correct format example

**Status:** ✅ Pass / ❌ Fail

---

### Test 3.3: Invalid Format - Wrong Separator

**Action:** Send `AXIS100-081234567890/testuser` (dash instead of dot)

**Expected Response:**
- Yellow embed with format error
- Suggest correct format

**Status:** ✅ Pass / ❌ Fail

---

### Test 3.4: Invalid Format - Wrong Order

**Action:** Send `081234567890.AXIS100/testuser` (nomor sebelum SKU)

**Expected Response:**
- Yellow embed with format error

**Status:** ✅ Pass / ❌ Fail

---

### Test 3.5: Invalid Nomor (Too Short)

**Action:** Send `AXIS100.123/testuser` (nomor hanya 3 digit)

**Expected Response:**
- Yellow embed with error "nomor tidak valid"

**Status:** ✅ Pass / ❌ Fail

---

### Test 3.6: Invalid SKU (Too Short)

**Action:** Send `AX.081234567890/testuser` (SKU hanya 2 char)

**Expected Response:**
- Yellow embed with format error

**Status:** ✅ Pass / ❌ Fail

---

## ✅ Test Suite 4: Transaction Testing

### Test 4.1: Successful Transaction

**Prerequisites:**
- Valid SKU
- Valid nomor
- Sufficient balance
- Nomor belum digunakan hari ini (jika ada limit)

**Action:** Send valid transaction format

**Expected Response:**
- Green embed with "✅ Transaksi Berhasil"
- Shows: SKU, Nomor, ID Tujuan, Ref ID
- Shows status "SUKSES ✅"
- Ref ID format: `BOT[timestamp][random]`

**Status:** ✅ Pass / ❌ Fail

**Verification:**
- Check Digiflazz dashboard → transaksi tercatat
- Check balance updated

---

### Test 4.2: Failed Transaction (Invalid Nomor)

**Action:** Send transaction dengan nomor tidak valid

**Expected Response:**
- Red embed with "❌ Transaksi Gagal"
- Shows error message from Digiflazz
- Shows Ref ID

**Status:** ✅ Pass / ❌ Fail

---

### Test 4.3: Failed Transaction (Insufficient Balance)

**Prerequisites:**
- Balance kurang untuk transaksi

**Action:** Send transaction

**Expected Response:**
- Red embed with "❌ Transaksi Gagal"
- Error message: "Saldo kurang" atau similar

**Status:** ✅ Pass / ❌ Fail

---

### Test 4.4: Pending Transaction

**Action:** Send transaction dan tunggu

**Expected Response (jika pending):**
- Orange embed with "⏳ Transaksi Pending"
- Message: "Transaksi sedang diproses"
- Warning: Jangan kirim ulang

**Status:** ✅ Pass / ❌ Fail

---

### Test 4.5: Network Error Handling

**Prerequisites:**
- Temporarily disconnect internet

**Action:** Send transaction

**Expected Response:**
- Red embed with network error
- Message: "Gagal terhubung ke API Digiflazz"
- Suggestion to try again

**Status:** ✅ Pass / ❌ Fail

---

## ✅ Test Suite 5: Error Handling

### Test 5.1: Invalid Credentials

**Prerequisites:**
- Update .env with wrong Digiflazz credentials
- Restart bot

**Expected Behavior:**
- Bot starts normally (credentials not validated on start)
- Transaction attempt should fail with auth error

**Action:** Try transaction

**Expected Response:**
- Red embed with "API_ERROR"
- Message indicates auth/credential issue

**Status:** ✅ Pass / ❌ Fail

---

### Test 5.2: Missing .env

**Prerequisites:**
- Rename or remove .env file
- Restart bot

**Expected Behavior:**
- Bot should NOT start
- Error message: "DISCORD_TOKEN tidak ditemukan di .env"

**Status:** ✅ Pass / ❌ Fail

---

### Test 5.3: Invalid Discord Token

**Prerequisites:**
- Update DISCORD_TOKEN with invalid token
- Restart bot

**Expected Behavior:**
- Bot should NOT start
- Error: "Gagal login bot"

**Status:** ✅ Pass / ❌ Fail

---

### Test 5.4: Timeout Handling

**Prerequisites:**
- Temporarily block Digiflazz API (or wait for timeout)

**Action:** Send transaction

**Expected Response:**
- Red embed after ~10 seconds
- Message: "Koneksi timeout"

**Status:** ✅ Pass / ❌ Fail

---

## ✅ Test Suite 6: Concurrency & Performance

### Test 6.1: Multiple Transactions

**Action:** Send 3 transactions quickly

**Expected Behavior:**
- Bot processes each independently
- Each gets unique Ref ID
- No crashes or errors

**Status:** ✅ Pass / ❌ Fail

---

### Test 6.2: Bot Responsiveness

**Action:** Send command while processing transaction

**Expected Behavior:**
- Command still works
- Transaction continues in background

**Status:** ✅ Pass / ❌ Fail

---

## ✅ Test Suite 7: Logging

### Test 7.1: Console Logging

**Expected Behavior:**
- Console shows transaction details
- Timestamps for each event
- Error messages logged

**Status:** ✅ Pass / ❌ Fail

---

### Test 7.2: Channel Logging

**Prerequisites:**
- LOG_CHANNEL_ID configured in .env
- Log channel exists

**Action:** Process successful transaction

**Expected Response in Log Channel:**
- Embed with transaction details
- User info, SKU, nomor, Ref ID
- Status and timestamp

**Status:** ✅ Pass / ❌ Fail

---

## 📊 Test Results Summary

### Test Execution Template

```
TEST SUITE 1: Bot Startup
├── Test 1.1 (Bot Runs): ✅ Pass
├── Test 1.2 (Bot Online): ✅ Pass
└── Status: ✅ All Passed

TEST SUITE 2: Commands
├── Test 2.1 (!ping): ✅ Pass
├── Test 2.2 (!help): ✅ Pass
├── Test 2.3 (!balance): ✅ Pass
├── Test 2.4 (!status): ✅ Pass
├── Test 2.5 (!invalid): ✅ Pass
└── Status: ✅ All Passed

TEST SUITE 3: Format Validation
├── Test 3.1 (Valid): ✅ Pass
├── Test 3.2 (Missing Component): ✅ Pass
├── Test 3.3 (Wrong Separator): ✅ Pass
├── Test 3.4 (Wrong Order): ✅ Pass
├── Test 3.5 (Invalid Nomor): ✅ Pass
├── Test 3.6 (Invalid SKU): ✅ Pass
└── Status: ✅ All Passed

TEST SUITE 4: Transactions
├── Test 4.1 (Success): ✅ Pass
├── Test 4.2 (Invalid Nomor): ✅ Pass
├── Test 4.3 (No Balance): ✅ Pass
├── Test 4.4 (Pending): ✅ Pass
├── Test 4.5 (Network Error): ✅ Pass
└── Status: ✅ All Passed

TEST SUITE 5: Error Handling
├── Test 5.1 (Invalid Cred): ✅ Pass
├── Test 5.2 (Missing .env): ✅ Pass
├── Test 5.3 (Invalid Token): ✅ Pass
├── Test 5.4 (Timeout): ✅ Pass
└── Status: ✅ All Passed

TEST SUITE 6: Performance
├── Test 6.1 (Multiple): ✅ Pass
├── Test 6.2 (Responsive): ✅ Pass
└── Status: ✅ All Passed

TEST SUITE 7: Logging
├── Test 7.1 (Console): ✅ Pass
├── Test 7.2 (Channel): ✅ Pass
└── Status: ✅ All Passed

═══════════════════════════════════════════════════════════════════
OVERALL STATUS: ✅ ALL TESTS PASSED - READY FOR PRODUCTION
═══════════════════════════════════════════════════════════════════
```

---

## 🚀 Automated Testing (Optional)

### Unit Test Example (Jest)

```javascript
// tests/parser.test.js
const TransactionParser = require('../src/utils/parser');

describe('TransactionParser', () => {
  test('parse valid transaction', () => {
    const result = TransactionParser.parse('AXIS100.081234567890/user');
    expect(result.success).toBe(true);
    expect(result.sku).toBe('axis100');
    expect(result.nomor).toBe('081234567890');
    expect(result.idTujuan).toBe('user');
  });

  test('reject invalid format', () => {
    const result = TransactionParser.parse('INVALID FORMAT');
    expect(result.success).toBe(false);
  });
});
```

### Integration Test Example

```javascript
// tests/integration.test.js
const DigiflazzAPI = require('../src/utils/digiflazz-api');

describe('Digiflazz Integration', () => {
  test('generate valid signature', () => {
    const sig = DigiflazzAPI.generateSignature('test_ref');
    expect(sig).toMatch(/^[a-f0-9]{32}$/); // MD5 hash format
  });

  test('handle API error', async () => {
    const result = await DigiflazzAPI.doTransaction(
      'INVALID',
      '000',
      'test'
    );
    expect(result.success).toBe(false);
  });
});
```

---

## 📝 Issues & Fixes

### Common Issues During Testing

| Issue | Cause | Fix |
|-------|-------|-----|
| Bot offline | Token invalid | Generate new token |
| Can't read messages | Intents missing | Enable MESSAGE CONTENT INTENT |
| API errors | Wrong credentials | Verify .env values |
| Transactions timeout | Network slow | Check internet connection |
| Embed colors wrong | CSS issue | Check embed hex colors |

---

## 🎯 Success Criteria

Bot is ready for production when:

✅ All test suites pass
✅ No console errors
✅ Transactions process in < 5 seconds
✅ Error messages are helpful
✅ Logging works properly
✅ No memory leaks
✅ Security credentials safe

---

## 📞 Debugging Tips

### Enable Debug Logging

Add to `src/index.js`:

```javascript
client.on('debug', (info) => {
  console.log(`[Debug] ${info}`);
});
```

### Check Bot Permissions

In Discord server:
1. Right-click bot
2. Check role permissions
3. Verify: Send Messages, Embed Links

### Monitor Resource Usage

```bash
# Check memory usage
node --max-old-space-size=256 src/index.js

# Use profiler
node --prof src/index.js
```

---

**Happy Testing! 🎉**

Next: Deploy to production server (Heroku, VPS, Railway, etc)
