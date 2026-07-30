/**
 * Parser untuk format transaksi: SKU.nomortujuan
 * Contoh: mlcek5.47852212078 atau AXIS100.081234567890
 * Format sesuai Digiflazz API Dokumentasi
 */

class TransactionParser {
  /**
   * Parse format: SKU.nomortujuan
   * @param {string} input - Format dari user
   * @returns {Object} - Hasil parse atau error
   */
  static parse(input) {
    try {
      // Trim input
      const text = input.trim();

      // Regex pattern: SKU.NOMOR (case-insensitive)
      // SKU bisa lowercase atau uppercase, nomor hanya angka
      const pattern = /^([a-zA-Z0-9_]+)\.([0-9]+)$/;
      const match = text.match(pattern);

      if (!match) {
        return {
          success: false,
          error: 'Format tidak valid. Gunakan: `SKU.nomortujuan`\nContoh: `mlcek5.47852212078` atau `AXIS100.081234567890`',
        };
      }

      const [, sku, nomor] = match;

      // Validasi panjang
      if (!sku || sku.length < 2) {
        return {
          success: false,
          error: 'SKU tidak valid. Harus minimal 2 karakter.',
        };
      }

      if (!nomor || nomor.length < 5) {
        return {
          success: false,
          error: 'Nomor tujuan tidak valid. Harus minimal 5 digit.',
        };
      }

      if (nomor.length > 20) {
        return {
          success: false,
          error: 'Nomor tujuan terlalu panjang. Maksimal 20 digit.',
        };
      }

      return {
        success: true,
        sku: sku.toLowerCase(),
        nomor: nomor,
        originalInput: text,
      };
    } catch (error) {
      return {
        success: false,
        error: `Error parsing: ${error.message}`,
      };
    }
  }

  /**
   * Validasi format dengan lebih detail
   */
  static validate(parsed) {
    const errors = [];

    // Validasi SKU (minimal 2 karakter, alphanumeric + underscore)
    if (!parsed.sku || !/^[a-z0-9_]+$/.test(parsed.sku)) {
      errors.push('SKU harus mengandung huruf/angka/underscore');
    }

    if (parsed.sku && parsed.sku.length < 2) {
      errors.push('SKU harus minimal 2 karakter');
    }

    // Validasi nomor (hanya angka, 5-20 digit)
    if (!/^\d{5,20}$/.test(parsed.nomor)) {
      errors.push('Nomor harus 5-20 digit angka');
    }

    if (errors.length > 0) {
      return {
        valid: false,
        errors,
      };
    }

    return {
      valid: true,
      errors: [],
    };
  }

  /**
   * Deteksi jenis layanan dari SKU
   */
  static detectServiceType(sku) {
    const skuLower = sku.toLowerCase();

    // Pulsa / Data
    if (
      skuLower.includes('axis') ||
      skuLower.includes('tri') ||
      skuLower.includes('indosat') ||
      skuLower.includes('telkomsel') ||
      skuLower.includes('smartfren') ||
      skuLower.includes('esia')
    ) {
      return 'PULSA/DATA';
    }

    // PLN
    if (skuLower.includes('pln')) {
      return 'PLN_TOKEN';
    }

    // Game Voucher
    if (
      skuLower.includes('ml') ||
      skuLower.includes('pubg') ||
      skuLower.includes('ff') ||
      skuLower.includes('game') ||
      skuLower.includes('id')
    ) {
      return 'GAME_VOUCHER';
    }

    // Default
    return 'UNKNOWN';
  }

  /**
   * Generate reference ID unik untuk transaksi
   */
  static generateRefId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `TRX${timestamp}${random}`.substring(0, 20);
  }
}

module.exports = TransactionParser;
