# 🔧 Technical Documentation - Digiflazz Discord Bot

Dokumentasi teknis untuk developer yang ingin memahami atau memodifikasi bot.

## 📚 Table of Contents

1. [Architecture](#architecture)
2. [Flow Diagram](#flow-diagram)
3. [Module Breakdown](#module-breakdown)
4. [API Integration](#api-integration)
5. [Data Flow](#data-flow)
6. [Error Handling](#error-handling)
7. [Code Examples](#code-examples)

---

## 🏗️ Architecture

Bot ini menggunakan **modular architecture** dengan pemisahan concern yang jelas:

```
┌─────────────────────────────────────────────┐
│         DISCORD BOT (index.js)              │
│  - Event listeners (ready, messageCreate)   │
│  - Bot initialization & config validation   │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴────────┐
        │               │
        ▼               ▼
  ┌──────────────┐  ┌──────────────────┐
  │   Command    │  │    Message       │
  │   Handler    │  │    Handler       │
  │  (!help,etc) │  │  (transaction)   │
  └──────┬───────┘  └────────┬─────────┘
         │                   │
         └────────┬──────────┘
                  │
         ┌────────▼────────┐
         │    Utilities    │
         │  - Parser       │
         │  - API Client   │
         │  - Embed Builder│
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │  Digiflazz API  │
         │  (digiflazz.com)│
         └─────────────────┘
```

### Design Patterns

1. **MVC-like Pattern**
   - Model: Config, data structures
   - View: Embed builder, response formatting
   - Controller: Handlers, API client

2. **Singleton Pattern**
   - DigiflazzAPI instance (single connection)
   - Config object (single configuration)

3. **Strategy Pattern**
   - Different response strategies (success, failed, pending)
   - Different service type detection

4. **Factory Pattern**
   - EmbedBuilder creates different embed types

---

## 📊 Flow Diagram

### Transaction Flow

```
User Input: AXIS100.081234567890/user
         │
         ▼
   ┌─────────────────┐
   │  Parse Input    │
   │  - Extract SKU  │
   │  - Extract No   │
   │  - Extract ID   │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────────┐
   │  Validate Format    │
   │  - Check pattern    │
   │  - Check lengths    │
   │  - Check chars      │
   └────────┬────────────┘
            │
     ┌──────┴──────┐
     │             │
  ✅ │          ❌ │
     │             │
     ▼             ▼
 Continue      Reply Error
     │
     ▼
 ┌──────────────────────┐
 │ Generate Signature   │
 │ MD5(user+key+refId)  │
 └────────┬─────────────┘
          │
          ▼
 ┌──────────────────────┐
 │ Send to Digiflazz    │
 │ POST /api/transaksi  │
 └────────┬─────────────┘
          │
     ┌────┴────┬─────────┐
     │          │         │
     ▼          ▼         ▼
  SUCCESS    FAILED    PENDING
     │          │         │
     ▼          ▼         ▼
  Green      Red       Orange
  Embed      Embed     Embed
     │          │         │
     └────┬─────┴────┬────┘
          │
          ▼
   Reply to Discord
```

### Command Flow

```
Message from user with prefix (e.g., !help)
         │
         ▼
   ┌─────────────────┐
   │ Command Handler │
   │ - Parse args    │
   │ - Find handler  │
   └────────┬────────┘
            │
       ┌────┴──────┬──────────┬────────┐
       │            │          │        │
       ▼            ▼          ▼        ▼
    !help        !balance    !status   !ping
       │            │          │        │
       ▼            ▼          ▼        ▼
  Help Embed   Check API  Bot Status  Response
       │            │          │        │
       └────────┬───┴──────┬───┴───┬────┘
                │
                ▼
         Reply to Discord
```

---

## 📦 Module Breakdown

### 1. **src/index.js** - Main Bot File

**Tanggung Jawab:**
- Initialize Discord client
- Setup event listeners
- Validate configuration
- Handle global errors

**Key Functions:**
- `client.once('ready')` - Bot startup
- `client.on('messageCreate')` - Message event
- `client.on('error')` - Error handling
- `client.login()` - Bot login

**Intents:**
```javascript
Guilds              // Read guild data
GuildMessages       // Receive messages in guilds
MessageContent      // Read message content (REQUIRED!)
DirectMessages      // Receive DMs
```

### 2. **src/config.js** - Configuration Manager

**Tanggung Jawab:**
- Load environment variables
- Validate required configs
- Export configuration object
- Prevent bot startup if invalid

**Configuration Structure:**
```javascript
{
  discord: { token, prefix, logChannelId },
  digiflazz: { username, apiKey, apiUrl },
  api: { timeout }
}
```

**Validation Checks:**
- DISCORD_TOKEN exists
- DIGIFLAZZ_USERNAME exists
- DIGIFLAZZ_API_KEY exists

### 3. **src/utils/parser.js** - Format Parser

**Tanggung Jawab:**
- Parse user input format
- Validate data format
- Detect service type
- Generate unique ref ID

**Format Regex:**
```
^([A-Z0-9_]+)\.([0-9\-\(\)]+)\/(.+)$
 └─── SKU ────┘ └─ Nomor ────┘ └─ ID ┘
```

**Validation Rules:**
- SKU: 3+ characters, alphanumeric + underscore
- Nomor: 5-15 digits only
- ID Tujuan: 2-50 chars, alphanumeric + underscore/dash

**Service Detection:**
```
AXIS/TRI/INDOSAT/etc  → PULSA/DATA
PLN                    → PLN_TOKEN
ML/PUBG/FF/GAME/ID    → GAME_VOUCHER
Other                  → UNKNOWN
```

### 4. **src/utils/digiflazz-api.js** - API Client

**Tanggung Jawab:**
- Communicate with Digiflazz API
- Handle authentication (MD5 signature)
- Make API requests
- Process responses
- Handle errors

**Authentication Method:**
```
Signature = MD5(username + api_key + ref_id)

Request Payload:
{
  "username": "merchant_username",
  "buyer_sku_code": "AXIS100",
  "customer_no": "081234567890",
  "ref_id": "BOT169345678abc",
  "sign": "md5_hash_signature"
}
```

**Response Handling:**
```
Status Code → Parse Response → Determine Result
200         → Check status   → Success/Failed/Pending
401         → Auth Error     → Invalid credentials
500         → Server Error   → Try again
Timeout     → Connection     → Network error
```

**Methods:**
- `doTransaction()` - Process transaction
- `generateSignature()` - Create MD5 signature
- `processResponse()` - Handle response
- `handleError()` - Error processing
- `checkBalance()` - Get balance
- `getProductDetail()` - Get product info

### 5. **src/utils/embed-builder.js** - Response Formatter

**Tanggung Jawab:**
- Create Discord embed messages
- Format responses based on status
- Add metadata and timestamps

**Embed Types:**
- `successTransaction()` - Green embed for success
- `failedTransaction()` - Red embed for failure
- `pendingTransaction()` - Orange embed for pending
- `formatError()` - Yellow embed for format errors
- `apiErrorEmbed()` - Red embed for API errors
- `helpEmbed()` - Blue embed for help
- `balanceEmbed()` - Cyan embed for balance

**Embed Structure:**
```javascript
{
  color: 0x00FF00,              // Hex color
  title: '✅ Transaksi Berhasil',
  description: '...',
  fields: [
    { name: '📦 SKU', value: 'AXIS100', inline: true },
    { name: '📱 Nomor', value: '081234567890', inline: true },
    // ...
  ],
  footer: { text: 'Bot name' },
  timestamp: new Date()
}
```

### 6. **src/handlers/message-handler.js** - Transaction Handler

**Tanggung Jawab:**
- Detect transaction format
- Parse and validate input
- Initiate transaction
- Log transactions
- Send responses

**Main Methods:**
- `handle()` - Process message
- `isTransactionFormat()` - Check if message is transaction
- `doTransaction()` - Execute transaction
- `logTransaction()` - Log to channel

**Process:**
1. Check if message is transaction format
2. Parse input
3. Validate parsed data
4. Send "processing" message
5. Call API
6. Update message with result
7. Log to log channel

### 7. **src/handlers/command-handler.js** - Command Handler

**Tanggung Jawab:**
- Handle prefixed commands
- Route to appropriate handler
- Execute commands

**Commands:**
- `!help` - Show help
- `!balance` - Check balance
- `!status` - Bot status
- `!ping` - Response time

**Command Structure:**
```javascript
static commands = {
  help: this.help,
  balance: this.balance,
  status: this.status,
  ping: this.ping
}
```

---

## 🔌 API Integration

### Digiflazz API Endpoints

**Base URL:** `https://api.digiflazz.com/v1`

#### Endpoint 1: Create Transaction

**Request:**
```
POST /transaksi

{
  "username": "merchant_username",
  "buyer_sku_code": "AXIS100",
  "customer_no": "081234567890",
  "ref_id": "BOT123456789abc",
  "sign": "md5_signature"
}
```

**Response (Success):**
```json
{
  "status": "00",
  "message": "Transaksi berhasil",
  "data": {
    "ref_id": "BOT123456789abc",
    "no_ref": "REF123456",
    "id": "123456",
    "balance": 1500000
  }
}
```

**Response (Pending):**
```json
{
  "status": "01",
  "message": "Transaksi sedang diproses"
}
```

**Response (Error):**
```json
{
  "status": "02",
  "message": "Nomor tidak valid / Saldo kurang"
}
```

#### Endpoint 2: Check Balance

**Request:**
```
POST /saldo

{
  "username": "merchant_username",
  "sign": "md5_signature",
  "ref_id": "ref_id_unik"
}
```

**Response:**
```json
{
  "status": "00",
  "message": "OK",
  "saldo": 1500000
}
```

#### Endpoint 3: Price List

**Request:**
```
GET /price-list

?username=merchant_username&buyer_sku_code=AXIS100
```

**Response:**
```json
[
  {
    "sku": "AXIS100",
    "harga": "100000",
    "nominal": "100000",
    "operator": "AXIS"
  }
]
```

---

## 🔄 Data Flow

### Transaction Data Journey

```
Discord User Input
    │
    ├─ Format Check ───→ Invalid? → Error Reply
    │
    ├─ Parse
    │   ├─ Extract SKU
    │   ├─ Extract Nomor
    │   └─ Extract ID Tujuan
    │
    ├─ Validation
    │   ├─ SKU format
    │   ├─ Nomor length
    │   └─ ID format
    │
    ├─ Generate
    │   ├─ Ref ID
    │   └─ MD5 Signature
    │
    ├─ API Call
    │   ├─ Build payload
    │   ├─ Send POST
    │   └─ Receive response
    │
    ├─ Process Response
    │   ├─ Check status
    │   ├─ Format result
    │   └─ Log transaction
    │
    └─ Send to Discord
        ├─ Embed message
        ├─ Reply to user
        └─ Log to channel
```

### Configuration Flow

```
Environment (.env)
    │
    ├─ DISCORD_TOKEN
    ├─ DIGIFLAZZ_USERNAME
    ├─ DIGIFLAZZ_API_KEY
    ├─ COMMAND_PREFIX
    └─ LOG_CHANNEL_ID
    │
    ▼
Config Module (config.js)
    │
    ├─ Load values
    ├─ Validate required
    └─ Export config
    │
    ▼
Used by:
├─ index.js (Discord token)
├─ DigiflazzAPI (username, key, URL)
├─ MessageHandler (handlers)
└─ CommandHandler (prefix, logging)
```

---

## ⚠️ Error Handling

### Error Types & Handling

**1. Configuration Error**
```
Error: "DISCORD_TOKEN tidak ditemukan di .env"
→ Bot tidak start
→ Fix: Update .env file
```

**2. Authentication Error**
```
Error: "Invalid token"
→ Bot tidak bisa login
→ Fix: Generate ulang token, update .env
```

**3. Message Content Error**
```
Error: "Cannot read messages"
→ Bot tidak bisa parse message
→ Fix: Enable MESSAGE CONTENT INTENT
```

**4. API Error**
```
Error: "Invalid credentials"
→ Transaction gagal
→ Fix: Verify Digiflazz credentials
→ Response: Red embed dengan error message
```

**5. Network Error**
```
Error: "Koneksi timeout"
→ Transaction gagal
→ Fix: Check internet connection
→ Response: Red embed dengan retry suggestion
```

**6. Format Error**
```
Error: "Format tidak valid"
→ Transaction tidak dijalankan
→ Fix: Correct format, try again
→ Response: Yellow embed dengan format example
```

### Error Handling Code Pattern

```javascript
try {
  // Do operation
} catch (error) {
  // Determine error type
  if (error.response) {
    // API error
    return handleAPIError(error.response);
  } else if (error.code === 'ECONNABORTED') {
    // Timeout
    return handleTimeoutError();
  } else if (error.code === 'ENOTFOUND') {
    // Network
    return handleNetworkError();
  } else {
    // Generic error
    return handleGenericError(error);
  }
}
```

---

## 💻 Code Examples

### Example 1: Transaction Processing

```javascript
// User sends: AXIS100.081234567890/user

// Step 1: Parse
const parsed = TransactionParser.parse('AXIS100.081234567890/user');
// Returns:
// {
//   success: true,
//   sku: 'axis100',
//   nomor: '081234567890',
//   idTujuan: 'user'
// }

// Step 2: Validate
const validation = TransactionParser.validate(parsed);
// Returns: { valid: true, errors: [] }

// Step 3: Call API
const result = await DigiflazzAPI.doTransaction(
  'axis100',
  '081234567890',
  'user'
);

// Step 4: Build response
const embed = EmbedMessageBuilder.successTransaction({
  sku: 'axis100',
  nomor: '081234567890',
  idTujuan: 'user',
  refId: 'BOT123456789abc'
});

// Step 5: Send to Discord
await message.reply({ embeds: [embed] });
```

### Example 2: Custom Command

```javascript
// Add new command: !status-detail

// In command-handler.js, add:
static commands = {
  // ... existing commands
  'status-detail': this.statusDetail
}

// Add method:
static async statusDetail(message, args) {
  // Your custom logic
  const embed = new EmbedBuilder()
    .setTitle('📊 Detailed Status')
    .addFields(...)
  
  await message.reply({ embeds: [embed] });
}
```

### Example 3: Modify Embed Color

```javascript
// In embed-builder.js, successTransaction method:

static successTransaction(data) {
  const embed = new EmbedBuilder()
    .setColor('#00FF00')  // Change this value
    // ... rest of embed
}

// Color options:
// '#FF0000' = Red
// '#00FF00' = Green
// '#0000FF' = Blue
// '#FFFF00' = Yellow
// '#FFA500' = Orange
// '#00FFFF' = Cyan
```

### Example 4: Add Logging

```javascript
// Add detailed logging in message-handler.js:

console.log(`[Transaction] User: ${message.author.tag}`);
console.log(`[Transaction] SKU: ${parsed.sku}`);
console.log(`[Transaction] Nomor: ${parsed.nomor}`);
console.log(`[Transaction] ID: ${parsed.idTujuan}`);
console.log(`[Transaction] Response Status: ${result.status}`);

// Output akan muncul di terminal
// Berguna untuk debugging dan monitoring
```

---

## 🔍 Monitoring & Debugging

### Enable Debug Mode

Add this in `index.js`:

```javascript
// After creating client
client.on('debug', (info) => {
  console.log(`[Debug] ${info}`);
});
```

### Check Logs

```bash
# View last 50 lines
tail -50 bot.log

# Follow logs in real-time
tail -f bot.log

# Search for errors
grep ERROR bot.log
```

### Monitor API Calls

In `digiflazz-api.js`:

```javascript
console.log('[Digiflazz] Sending payload:', payload);
console.log('[Digiflazz] Response:', response.data);
```

---

## 🚀 Performance Optimization

### Current Bottlenecks

1. **API Call Latency**: 1-5 seconds per transaction
   - Solution: Async/await, parallel processing

2. **Message Processing**: Parse time
   - Solution: Regex caching, pre-compiled patterns

3. **Embed Building**: Embed creation time
   - Solution: Template caching

### Optimization Tips

```javascript
// Use batch operations
const results = await Promise.all([
  transaction1,
  transaction2,
  transaction3
]);

// Cache embed templates
const successTemplate = EmbedBuilder.successTransaction({});

// Use pagination for large data
const paginated = paginate(data, pageSize);
```

---

## 📚 References

- Discord.js Docs: https://discord.js.org/docs
- Node.js Docs: https://nodejs.org/docs/
- Digiflazz API: https://digiflazz.com/api
- MD5 Hashing: https://nodejs.org/api/crypto.html

---

**Last Updated:** 2024
**Version:** 1.0.0
