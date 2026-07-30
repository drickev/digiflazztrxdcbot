/**
 * Digiflazz Discord Bot
 * 
 * Bot untuk melakukan transaksi Digiflazz melalui Discord
 * Format: SKU.nomor/idtujuan
 * 
 * Contoh:
 * - AXIS100.081234567890/tujuan_user
 * - TELKOMSEL50.089876543210/nama_game
 * - PLN50000.123456789012/username
 */

const { Client, GatewayIntentBits, ActivityType, ChannelType } = require('discord.js');
const config = require('./config');
const MessageHandler = require('./handlers/message-handler');
const CommandHandler = require('./handlers/command-handler');

// Validasi config sebelum start
config.validate();

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

/**
 * Event: Bot siap (ready)
 */
client.once('ready', () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║          🤖 DIGIFLAZZ DISCORD BOT READY ✅             ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║  Bot Name     : ${client.user.username.padEnd(33)}║
║  Bot Tag      : ${client.user.tag.padEnd(32)}║
║  Guild Count  : ${client.guilds.cache.size.toString().padEnd(33)}║
║  Prefix       : ${config.discord.prefix.padEnd(42)}║
║  API URL      : ${config.digiflazz.apiUrl.padEnd(33)}║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);

  // Set presence/status
  client.user.setActivity('Digiflazz Transaksi 💸', {
    type: ActivityType.Playing,
  });

  console.log('✅ Bot presence updated');
  console.log('');
  console.log('📝 Format Transaksi: SKU.nomor/idtujuan');
  console.log('📌 Contoh: AXIS100.081234567890/user');
  console.log('');
  console.log(`⚙️  Command dengan prefix "${config.discord.prefix}"`);
  console.log(`   ${config.discord.prefix}help   - Tampilkan panduan`);
  console.log(`   ${config.discord.prefix}balance - Cek saldo`);
  console.log(`   ${config.discord.prefix}status  - Status bot`);
  console.log(`   ${config.discord.prefix}ping    - Check ping`);
  console.log('');
});

/**
 * Event: Message received
 */
client.on('messageCreate', async (message) => {
  try {
    // Abaikan message dari bot
    if (message.author.bot) {
      return;
    }

    // Handle command (dengan prefix)
    if (message.content.startsWith(config.discord.prefix)) {
      await CommandHandler.handle(message);
      return;
    }

    // Handle transaction (format SKU.nomor/idtujuan)
    await MessageHandler.handle(message);
  } catch (error) {
    console.error('[Error] Message handler error:', error);
  }
});

/**
 * Event: Guild joined
 */
client.on('guildCreate', (guild) => {
  console.log(`\n✅ Bot ditambahkan ke guild: ${guild.name} (ID: ${guild.id})`);
  console.log(`   Guild owner: ${guild.ownerId}`);
  console.log(`   Member count: ${guild.memberCount}\n`);
});

/**
 * Event: Guild left
 */
client.on('guildDelete', (guild) => {
  console.log(`\n❌ Bot dihapus dari guild: ${guild.name}`);
});

/**
 * Event: Error
 */
client.on('error', (error) => {
  console.error('[Discord Error]', error);
});

/**
 * Event: Warning
 */
client.on('warn', (warning) => {
  console.warn('[Discord Warning]', warning);
});

/**
 * Event: Unhandled Rejection
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Unhandled Rejection] at:', promise, 'reason:', reason);
});

/**
 * Login bot dengan token
 */
client.login(config.discord.token).catch((error) => {
  console.error('❌ Gagal login bot:');
  console.error(`   ${error.message}`);
  console.error('');
  console.error('Kemungkinan penyebab:');
  console.error('   1. Token tidak valid atau expired');
  console.error('   2. Token belum di-setup di .env');
  console.error('   3. Bot tidak memiliki permission di Discord Developer Portal');
  console.error('');
  console.error('Solusi:');
  console.error('   1. Pastikan DISCORD_TOKEN benar di file .env');
  console.error('   2. Generate ulang token di Discord Developer Portal');
  console.error('   3. Verify bot memiliki permission MESSAGE_CONTENT intent');
  process.exit(1);
});

/**
 * Graceful shutdown
 */
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down bot...');
  await client.destroy();
  process.exit(0);
});

console.log('🚀 Starting Digiflazz Discord Bot...\n');
