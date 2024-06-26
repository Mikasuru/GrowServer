"use strict";

import CryptoJS from "crypto-js";
import { config } from "dotenv";
config();

/**
 * @param {string} data
 * @returns {string}
 */
function encrypt(data) {
  return CryptoJS.AES.encrypt(data, process.env.ENCRYPT_SECRET).toString();
}

/**
 * @param {string} data
 * @returns {string}
 */
function decrypt(data) {
  return CryptoJS.AES.decrypt(data, process.env.ENCRYPT_SECRET).toString(CryptoJS.enc.Utf8);
}

export { encrypt, decrypt };
