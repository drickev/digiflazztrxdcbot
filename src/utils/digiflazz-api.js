const axios = require('axios');
const crypto = require('crypto');
const config = require('../config');

/**
 * DigiflazzAPI - Handler untuk komunikasi dengan API Digiflazz
 * 
 * Cara Kerja:
 * 1. Generate signature (MD5 hash dari username + apiKey + ref_id)
 * 2. Kirim request POST ke API Digiflazz
 * 3. Digiflazz validasi dan proses transaksi
 * 4. Return response dengan status
 */
class DigiflazzAPI {
  constructor() {
    this.username = config.digiflazz.username;
    this.apiKey = config.digiflazz.apiKey;
    this.apiUrl = config.digiflazz.apiUrl;
    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Generate signature untuk autentikasi Digiflazz
   * @param {string} refId - Reference ID transaksi
   * @returns {string} - MD5 hash signature
   */
  generateSignature(refId) {
    const data = this.username + this.apiKey + refId;
    return crypto.createHash('md5').update(data).digest('hex');
  }

  /**
   * Lakukan transaksi
   * @param {string} sku - SKU produk (buyer_sku_code)
   * @param {string} nomor - Nomor tujuan (customer_no)
   * @returns {Promise<Object>} - Response dari Digiflazz
   */
  async doTransaction(sku, nomor) {
    try {
      console.log(`[Digiflazz] Memulai transaksi: ${sku} ke ${nomor}`);

      // Generate reference ID unik
      const refId = this.generateRefId();
      const signature = this.generateSignature(refId);

      // Prepare payload sesuai dokumentasi Digiflazz API v1
      // https://developer.digiflazz.com/api/buyer/topup
      const payload = {
        username: this.username,
        buyer_sku_code: sku,
        customer_no: nomor,
        ref_id: refId,
        sign: signature,
      };

      // Send request ke Digiflazz
      console.log(`[Digiflazz] Mengirim request dengan ref_id: ${refId}`);
      const response = await this.client.post('/transaction', payload);

      // Log response
      console.log('[Digiflazz] Response:', response.data);

      // Proses response
      return this.processResponse(response.data, refId);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Proses response dari Digiflazz
   */
  processResponse(data, refId) {
    // Jika response adalah object dengan status
    if (typeof data === 'object') {
      const status = data.status || data.kode;
      const message = data.message || data.pesan || 'Transaksi diproses';

      // Status sukses dari Digiflazz: 00 (success)
      if (status === '00' || status === 'success') {
        return {
          success: true,
          status: 'SUKSES',
          message: message,
          data: {
            refId: refId,
            transactionId: data.id || data.sn || refId,
            details: data,
          },
        };
      }

      // Status pending dari Digiflazz: 01
      if (status === '01' || status === 'pending') {
        return {
          success: null,
          status: 'PENDING',
          message: message || 'Transaksi sedang diproses',
          data: {
            refId: refId,
            transactionId: data.id || data.sn || refId,
            details: data,
          },
        };
      }

      // Status gagal
      if (status === '02' || status === 'error' || status === 'failed') {
        return {
          success: false,
          status: 'GAGAL',
          message: message || 'Transaksi gagal',
          data: {
            refId: refId,
            details: data,
          },
        };
      }

      // Status pending/unknown
      return {
        success: null,
        status: 'PENDING',
        message: message || 'Transaksi sedang diproses',
        data: {
          refId: refId,
          transactionId: data.sn || data.id || refId,
          details: data,
        },
      };
    }

    // Jika response string
    return {
      success: false,
      status: 'ERROR',
      message: data,
      data: { refId },
    };
  }

  /**
   * Handle error dari API call
   */
  handleError(error) {
    console.error('[Digiflazz] Error:', error.message);

    if (error.response) {
      // API mengembalikan error response
      const status = error.response.status;
      const data = error.response.data;

      return {
        success: false,
        status: 'API_ERROR',
        message: `HTTP ${status}: ${data.message || data.pesan || error.message}`,
        data: { details: data },
      };
    }

    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        status: 'TIMEOUT',
        message: 'Koneksi timeout - coba lagi nanti',
        data: {},
      };
    }

    if (error.code === 'ENOTFOUND') {
      return {
        success: false,
        status: 'NETWORK_ERROR',
        message: 'Gagal terhubung ke API Digiflazz - cek koneksi internet',
        data: {},
      };
    }

    return {
      success: false,
      status: 'ERROR',
      message: error.message || 'Terjadi kesalahan',
      data: {},
    };
  }

  /**
   * Generate reference ID unik
   */
  generateRefId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `BOT${timestamp}${random}`.substring(0, 20);
  }

  /**
   * Check balance/status akun Digiflazz
   * @returns {Promise<Object>} - Status akun
   */
  async checkBalance() {
    try {
      console.log('[Digiflazz] Mengecek balance...');

      const refId = this.generateRefId();
      const signature = this.generateSignature(refId);

      const payload = {
        username: this.username,
        sign: signature,
        ref_id: refId,
      };

      const response = await this.client.post('/balance', payload);

      console.log('[Digiflazz] Balance response:', response.data);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get detail produk dari SKU
   * @param {string} sku - SKU produk
   * @returns {Promise<Object>} - Detail produk
   */
  async getProductDetail(sku) {
    try {
      console.log(`[Digiflazz] Mengambil detail produk: ${sku}`);

      const refId = this.generateRefId();
      const signature = this.generateSignature(refId);

      const payload = {
        username: this.username,
        buyer_sku_code: sku,
        ref_id: refId,
        sign: signature,
      };

      const response = await this.client.post(`/pricelist`, payload);

      console.log('[Digiflazz] Product detail:', response.data);

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

module.exports = new DigiflazzAPI();
