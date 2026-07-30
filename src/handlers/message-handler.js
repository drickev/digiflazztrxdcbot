const TransactionParser = require('../utils/parser');
const DigiflazzAPI = require('../utils/digiflazz-api');
const EmbedMessageBuilder = require('../utils/embed-builder');
const { ChannelType } = require('discord.js');

/**
 * Message Handler - Proses semua pesan dari user
 */
class MessageHandler {
  /**
   * Handle message event
   */
  static async handle(message) {
    try {
      // Abaikan message dari bot
      if (message.author.bot) {
        return;
      }

      // Cek apakah message adalah format transaksi
      const isTransaction = this.isTransactionFormat(message.content);

      if (!isTransaction) {
        // Abaikan message biasa
        return;
      }

      console.log(
        `[Message] Transaksi dari ${message.author.tag}: ${message.content}`
      );

      // Kirim "typing" indicator
      await message.channel.sendTyping();

      // Parse input
      const parsed = TransactionParser.parse(message.content);

      if (!parsed.success) {
        const errorEmbed = EmbedMessageBuilder.formatError(parsed.error);
        await message.reply({
          embeds: [errorEmbed],
        });
        return;
      }

      // Validasi data yang di-parse
      const validation = TransactionParser.validate(parsed);
      if (!validation.valid) {
        const errorMsg = validation.errors.join('\n');
        const errorEmbed = EmbedMessageBuilder.formatError(errorMsg);
        await message.reply({
          embeds: [errorEmbed],
        });
        return;
      }

      // Lakukan transaksi
      await this.doTransaction(message, parsed);
    } catch (error) {
      console.error('[Error] Message handler:', error);

      const errorEmbed = EmbedMessageBuilder.apiErrorEmbed(
        'Terjadi kesalahan internal saat memproses pesan',
        'UNKNOWN'
      );

      try {
        await message.reply({
          embeds: [errorEmbed],
        });
      } catch (replyError) {
        console.error('[Error] Gagal reply message:', replyError);
      }
    }
  }

  /**
   * Lakukan transaksi ke Digiflazz
   */
  static async doTransaction(message, parsed) {
    try {
      // Kirim initial response dengan embed pending
      const processingEmbed = new (require('discord.js')).EmbedBuilder()
        .setColor('#FFA500')
        .setTitle('⏳ Memproses Transaksi...')
        .setDescription('Menghubungi server Digiflazz...')
        .addFields(
          {
            name: '📦 SKU',
            value: `\`${parsed.sku}\``,
            inline: true,
          },
          {
            name: '📱 Nomor',
            value: `\`${parsed.nomor}\``,
            inline: true,
          },

        )
        .setTimestamp();

      const processingMessage = await message.reply({
        embeds: [processingEmbed],
      });

      // Call API Digiflazz
      console.log('[Transaction] Mengirim ke Digiflazz API...');
      const result = await DigiflazzAPI.doTransaction(
        parsed.sku,
        parsed.nomor
      );

      console.log('[Transaction] Result:', result);

      // Siapkan data response
      const responseData = {
        sku: parsed.sku,
        nomor: parsed.nomor,
        refId: result.data?.refId || 'UNKNOWN',
        details: result.data?.details || {},
      };

      let responseEmbed;

      // Tentukan tipe response berdasarkan status
      if (result.success === true) {
        // Transaksi sukses
        responseEmbed = EmbedMessageBuilder.successTransaction(responseData);

        // Log ke channel jika dikonfigurasi
        await this.logTransaction(message, 'SUCCESS', responseData);
      } else if (result.success === false) {
        // Transaksi gagal
        responseEmbed = EmbedMessageBuilder.failedTransaction(
          responseData,
          result.message || 'Transaksi ditolak oleh Digiflazz'
        );

        // Log ke channel
        await this.logTransaction(message, 'FAILED', responseData);
      } else {
        // Transaksi pending
        responseEmbed = EmbedMessageBuilder.pendingTransaction(responseData);

        // Log ke channel
        await this.logTransaction(message, 'PENDING', responseData);
      }

      // Edit message yang sudah dikirim dengan response final
      await processingMessage.edit({
        embeds: [responseEmbed],
      });
    } catch (error) {
      console.error('[Error] Do transaction:', error);

      const errorEmbed = EmbedMessageBuilder.apiErrorEmbed(
        error.message || 'Terjadi kesalahan saat memproses transaksi',
        'ERROR'
      );

      try {
        await message.reply({
          embeds: [errorEmbed],
        });
      } catch (replyError) {
        console.error('[Error] Gagal reply error:', replyError);
      }
    }
  }

  /**
   * Log transaksi ke log channel
   */
  static async logTransaction(message, status, data) {
    try {
      const config = require('../config');

      if (!config.discord.logChannelId) {
        return;
      }

      const logChannel = await message.client.channels.fetch(
        config.discord.logChannelId
      );

      if (!logChannel || logChannel.type !== ChannelType.GuildText) {
        console.log('[Log] Log channel tidak valid');
        return;
      }

      const logEmbed = new (require('discord.js')).EmbedBuilder()
        .setColor(
          status === 'SUCCESS' ? '#00FF00' : status === 'FAILED' ? '#FF0000' : '#FFA500'
        )
        .setTitle(`📋 Transaksi ${status}`)
        .addFields(
          {
            name: 'User',
            value: `${message.author.tag}`,
            inline: true,
          },
          {
            name: 'User ID',
            value: `${message.author.id}`,
            inline: true,
          },
          {
            name: 'SKU',
            value: `\`${data.sku}\``,
            inline: true,
          },
          {
            name: 'Nomor',
            value: `\`${data.nomor}\``,
            inline: true,
          },

          {
            name: 'Ref ID',
            value: `\`${data.refId}\``,
            inline: true,
          },
          {
            name: 'Channel',
            value: `${message.channel.name}`,
            inline: true,
          }
        )
        .setTimestamp();

      await logChannel.send({
        embeds: [logEmbed],
      });

      console.log('[Log] Transaksi tercatat di log channel');
    } catch (error) {
      console.error('[Error] Logging transaction:', error.message);
      // Jangan throw error, hanya log
    }
  }

  /**
   * Cek apakah message adalah format transaksi
   * Format: SKU.nomor (contoh: mlcek5.47852212078)
   */
  static isTransactionFormat(content) {
    // Regex untuk deteksi format: SKU.nomor
    const pattern = /^[a-zA-Z0-9_]+\.\d+$/;
    return pattern.test(content.trim());
  }
}

module.exports = MessageHandler;
