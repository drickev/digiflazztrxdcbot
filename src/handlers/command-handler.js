const DigiflazzAPI = require('../utils/digiflazz-api');
const EmbedMessageBuilder = require('../utils/embed-builder');
const config = require('../config');
const { EmbedBuilder } = require('discord.js');

/**
 * Command Handler - Proses command dengan prefix
 * Contoh: !balance, !help, !status
 */
class CommandHandler {
  static commands = {
    help: this.help,
    balance: this.balance,
    status: this.status,
    ping: this.ping,
  };

  /**
   * Handle command
   */
  static async handle(message) {
    try {
      // Abaikan message dari bot
      if (message.author.bot) {
        return;
      }

      // Cek apakah dimulai dengan prefix
      if (!message.content.startsWith(config.discord.prefix)) {
        return;
      }

      // Parse command
      const args = message.content.slice(config.discord.prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();

      console.log(`[Command] ${message.author.tag} menggunakan command: ${command}`);

      // Cari command handler
      const handler = this.commands[command];

      if (!handler) {
        const helpEmbed = EmbedMessageBuilder.helpEmbed();
        await message.reply({
          embeds: [helpEmbed],
        });
        return;
      }

      // Jalankan command
      await handler.call(this, message, args);
    } catch (error) {
      console.error('[Error] Command handler:', error);

      const errorEmbed = EmbedMessageBuilder.apiErrorEmbed(
        'Terjadi kesalahan saat memproses command',
        'UNKNOWN'
      );

      try {
        await message.reply({
          embeds: [errorEmbed],
        });
      } catch (replyError) {
        console.error('[Error] Gagal reply command error:', replyError);
      }
    }
  }

  /**
   * Command: !help
   * Tampilkan panduan penggunaan bot
   */
  static async help(message, args) {
    try {
      const helpEmbed = EmbedMessageBuilder.helpEmbed();
      await message.reply({
        embeds: [helpEmbed],
      });
    } catch (error) {
      console.error('[Error] Help command:', error);
      await message.reply('❌ Terjadi kesalahan saat menampilkan help');
    }
  }

  /**
   * Command: !balance
   * Cek saldo akun Digiflazz
   */
  static async balance(message, args) {
    try {
      await message.channel.sendTyping();

      const result = await DigiflazzAPI.checkBalance();

      if (!result.success) {
        const errorEmbed = EmbedMessageBuilder.apiErrorEmbed(
          result.message || 'Gagal mengecek balance',
          'CHECK_BALANCE'
        );
        await message.reply({
          embeds: [errorEmbed],
        });
        return;
      }

      // Parse balance dari response
      const balanceData = result.data;

      // Response Digiflazz bisa dalam format berbeda
      // Coba akses field saldo
      const balance =
        balanceData.saldo ||
        balanceData.balance ||
        balanceData.data?.saldo ||
        balanceData.data?.balance ||
        'N/A';

      const balanceEmbed = EmbedMessageBuilder.balanceEmbed({
        balance: balance,
      });

      await message.reply({
        embeds: [balanceEmbed],
      });
    } catch (error) {
      console.error('[Error] Balance command:', error);

      const errorEmbed = EmbedMessageBuilder.apiErrorEmbed(
        'Gagal mengecek balance: ' + error.message,
        'CHECK_BALANCE'
      );

      await message.reply({
        embeds: [errorEmbed],
      });
    }
  }

  /**
   * Command: !status
   * Tampilkan status bot dan koneksi
   */
  static async status(message, args) {
    try {
      const client = message.client;

      const statusEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🟢 Bot Status')
        .addFields(
          {
            name: '🤖 Bot Name',
            value: client.user.username,
            inline: true,
          },
          {
            name: '⏰ Uptime',
            value: this.formatUptime(client.uptime),
            inline: true,
          },
          {
            name: '📊 Guild Count',
            value: client.guilds.cache.size.toString(),
            inline: true,
          },
          {
            name: '👥 User Count',
            value: client.users.cache.size.toString(),
            inline: true,
          },
          {
            name: '📡 Ping',
            value: `${client.ws.ping}ms`,
            inline: true,
          },
          {
            name: '🔗 Digiflazz API',
            value: 'Connected ✅',
            inline: true,
          }
        )
        .setFooter({ text: 'Digiflazz Discord Bot' })
        .setTimestamp();

      await message.reply({
        embeds: [statusEmbed],
      });
    } catch (error) {
      console.error('[Error] Status command:', error);
      await message.reply('❌ Terjadi kesalahan saat mengecek status');
    }
  }

  /**
   * Command: !ping
   * Check bot ping
   */
  static async ping(message, args) {
    try {
      const sent = await message.reply({
        content: '🏓 Pong!',
        fetchReply: true,
      });

      const ping = sent.createdTimestamp - message.createdTimestamp;
      const apiPing = message.client.ws.ping;

      await sent.edit(
        `🏓 Pong!\n📊 Discord Ping: ${ping}ms | API Ping: ${apiPing}ms`
      );
    } catch (error) {
      console.error('[Error] Ping command:', error);
      await message.reply('❌ Terjadi kesalahan saat check ping');
    }
  }

  /**
   * Format uptime menjadi readable format
   */
  static formatUptime(uptime) {
    if (!uptime) return 'N/A';

    const days = Math.floor(uptime / 86400000);
    const hours = Math.floor((uptime % 86400000) / 3600000);
    const minutes = Math.floor((uptime % 3600000) / 60000);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  }
}

module.exports = CommandHandler;
