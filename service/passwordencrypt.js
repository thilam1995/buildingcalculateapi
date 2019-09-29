const cryptoJS = require('crypto-js');

//import crypto from 'crypto-js';

var PasswordEncrypt = {
    set: (keys, value) => {
        var encryptoutput = cryptoJS.AES.encrypt(keys.trim(), value.trim()).toString();
        return encryptoutput;
    },
    get: (keys, value) => {
        var decryptoutput = cryptoJS.AES.decrypt(keys.trim(), value.trim()).toString(cryptoJS.enc.Utf8);
        return decryptoutput;
    }
};
module.exports = PasswordEncrypt;