const { EmbedBuilder } = require('discord.js');

/**
 * Builder untuk membuat embed message yang cantik
 */
class EmbedMessageBuilder {
  /**
   * Buat embed untuk transaksi SUKSES
   */
  static successTransaction(data) {
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('✅ Transaksi Berhasil')
      .setDescription('Transaksi Anda berhasil diproses oleh Digiflazz')
      .addFields(
        { name: '📦 SKU', value: `\`${data.sku}\``, inline: true },
        { name: '📱 Nomor Tujuan', value: `\`${data.nomor}\``, inline: true },
        { name: '👤 ID Tujuan', value: `\`${data.idTujuan}\``, inline: true },
        { name: '🆔 Ref ID', value: `\`${data.refId}\``, inline: true },
        { name: '⏰ Waktu', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
        { name: '🔗 Status', value: 'SUKSES ✅', inline: true }
      )
      .setFooter({ text: 'Digiflazz Discord Bot v1.0' })
      .setTimestamp();

    // Tambah detail tambahan jika ada
    if (data.details) {
      const detailsText = Object.entries(data.details)
        .slice(0, 3)
        .map(([key, value]) => `**${key}**: \`${value}\``)
        .join('\n');

      if (detailsText) {
        embed.addFields({ name: '📝 Detail Lainnya', value: detailsText || 'N/A' });
      }
    }

    return embed;
  }

  /**
   * Buat embed untuk transaksi GAGAL
   */
  static failedTransaction(data, errorMessage) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ Transaksi Gagal')
      .setDescription(`Transaksi Anda gagal diproses\n\n**Alasan:** ${errorMessage}`)
      .addFields(
        { name: '📦 SKU', value: `\`${data.sku || 'N/A'}\``, inline: true },
        { name: '📱 Nomor', value: `\`${data.nomor || 'N/A'}\``, inline: true },
        { name: '🆔 Ref ID', value: `\`${data.refId || 'N/A'}\``, inline: true },
        { name: '⏰ Waktu', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
      )
      .setFooter({ text: 'Hubungi admin jika terus bermasalah' })
      .setTimestamp();

    return embed;
  }

  /**
   * Buat embed untuk transaksi PENDING
   */
  static pendingTransaction(data) {
    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle('⏳ Transaksi Pending')
      .setDescription('Transaksi Anda sedang diproses oleh Digiflazz. Mohon tunggu...')
      .addFields(
        { name: '📦 SKU', value: `\`${data.sku}\``, inline: true },
        { name: '📱 Nomor Tujuan', value: `\`${data.nomor}\``, inline: true },
        { name: '👤 ID Tujuan', value: `\`${data.idTujuan}\``, inline: true },
        { name: '🆔 Ref ID', value: `\`${data.refId}\``, inline: true },
        { name: '⏰ Waktu', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
        { name: '🔗 Status', value: 'PENDING ⏳', inline: true }
      )
      .addFields({
        name: '⚠️ Catatan',
        value: 'Jangan kirim ulang transaksi yang sama. Tunggu hingga selesai diproses.',
      })
      .setFooter({ text: 'Digiflazz Discord Bot v1.0' })
      .setTimestamp();

    return embed;
  }

  /**
   * Buat embed untuk format error
   */
  static formatError(errorMessage) {
    const embed = new EmbedBuilder()
      .setColor('#FFFF00')
      .setTitle('⚠️ Format Tidak Valid')
      .setDescription(`${errorMessage}`)
      .addFields({
        name: '📝 Format Benar:',
        value: '```\nSKU.nomor/idtujuan\n```',
      })
      .addFields({
        name: '📌 Contoh:',
        value: `
\`AXIS100.081234567890/tujuan_user\`
\`TELKOMSEL50.089876543210/nama_game\`
\`PLN50000.123456789012/username\`
        `,
      })
      .setFooter({ text: 'Pastikan format sesuai sebelum mengirim' })
      .setTimestamp();

    return embed;
  }

  /**
   * Buat embed untuk info help
   */
  static helpEmbed() {
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('📖 Panduan Menggunakan Bot')
      .setDescription('Berikut cara menggunakan Digiflazz Discord Bot')
      .addFields(
        {
          name: '🔧 Format Transaksi',
          value: '```\nSKU.nomor/idtujuan\n```',
        },
        {
          name: '📱 Contoh Pulsa/Data',
          value: '`AXIS100.081234567890/user` - Pulsa AXIS 100rb ke 081234567890',
          inline: false,
        },
        {
          name: '⚡ Contoh PLN',
          value: '`PLN100000.123456789012/pembayaran` - Token PLN 100rb',
          inline: false,
        },
        {
          name: '🎮 Contoh Game Voucher',
          value: '`CODM5000.081234567890/nickname` - CODM 5000 CP',
          inline: false,
        },
        {
          name: '✅ Apa yang Terjadi',
          value:
            '1. Bot validasi format\n2. Bot kirim ke Digiflazz\n3. Digiflazz proses\n4. Bot lapor hasilnya',
        },
        {
          name: '⚠️ Penting',
          value:
            '• Pastikan format benar\n• Jangan kirim transaksi duplikat\n• Tunggu response bot sebelum kirim ulang\n• Simpan Ref ID untuk tracking',
        }
      )
      .setFooter({ text: 'Digiflazz Discord Bot' })
      .setTimestamp();

    return embed;
  }

  /**
   * Buat embed untuk balance check
   */
  static balanceEmbed(balanceData) {
    const embed = new EmbedBuilder()
      .setColor('#00DDFF')
      .setTitle('💰 Cek Saldo')
      .addFields({
        name: 'Saldo Anda',
        value: `\`Rp ${Number(balanceData.balance).toLocaleString('id-ID')}\``,
      })
      .setFooter({ text: 'Saldo Digiflazz' })
      .setTimestamp();

    return embed;
  }

  /**
   * Buat embed untuk API error
   */
  static apiErrorEmbed(errorMessage, refId) {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('🚨 Terjadi Kesalahan')
      .setDescription(`${errorMessage}`)
      .addFields({
        name: '🆔 Ref ID',
        value: `\`${refId}\``,
        inline: true,
      })
      .addFields({
        name: '💡 Solusi',
        value:
          'Coba lagi dalam beberapa saat atau hubungi admin jika terus bermasalah',
        inline: false,
      })
      .setFooter({ text: 'Hubungi admin untuk bantuan lebih lanjut' })
      .setTimestamp();

    return embed;
  }
}

module.exports = EmbedMessageBuilder;
