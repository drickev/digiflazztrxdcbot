require('dotenv').config();

module.exports = {
  // Discord Configuration
  discord: {
    token: process.env.DISCORD_TOKEN,
    prefix: process.env.COMMAND_PREFIX || '!',
    logChannelId: process.env.LOG_CHANNEL_ID || null,
  },

  // Digiflazz Configuration
  digiflazz: {
    username: process.env.DIGIFLAZZ_USERNAME,
    apiKey: process.env.DIGIFLAZZ_API_KEY,
    apiUrl: process.env.DIGIFLAZZ_API_URL || 'https://api.digiflazz.com/v1',
  },

  // API Configuration
  api: {
    timeout: parseInt(process.env.REQUEST_TIMEOUT) || 10000,
  },

  // Validasi konfigurasi
  validate: function () {
    const errors = [];

    if (!this.discord.token) {
      errors.push('DISCORD_TOKEN tidak ditemukan di .env');
    }

    if (!this.digiflazz.username) {
      errors.push('DIGIFLAZZ_USERNAME tidak ditemukan di .env');
    }

    if (!this.digiflazz.apiKey) {
      errors.push('DIGIFLAZZ_API_KEY tidak ditemukan di .env');
    }

    if (errors.length > 0) {
      console.error('❌ Konfigurasi Error:');
      errors.forEach((error) => console.error(`   - ${error}`));
      process.exit(1);
    }

    console.log('✅ Konfigurasi valid');
  },
};
