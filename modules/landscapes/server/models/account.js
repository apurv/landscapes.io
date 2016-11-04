'use strict';

const crypto = require('crypto');
const secureRandom = require('secure-random')

const winston = require('winston');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const _algorithm = 'aes-256-ecb';
const _keyLength = 512;
const _ivLength = 64;

var _writeAccountKeyFile = function (filePath) {
    return new Promise(function (resolve, reject) {
        try {
            const pw1 = secureRandom.randomBuffer(10);
            const s1 = secureRandom.randomBuffer(10);
            const pw2 = secureRandom.randomBuffer(10);
            const s2 = secureRandom.randomBuffer(10);

            crypto.pbkdf2(pw1, s1, 100000, _keyLength, 'sha512', (err, key) => {
                if (err) throw err;

                crypto.pbkdf2(pw2, s2, 100000, _ivLength, 'sha512', (err, iv) => {
                    if (err) throw err;

                    var data = `{ "key": "${key.toString('hex')}", "iv": "${iv.toString('hex')}", "createdAt": "${new Date().toISOString()}" }`;
                    fs.writeFileSync(filePath, data);
                    resolve();
                });
            });
        } catch (err) {
            reject(err);
        }
    })
}

var getAccountKeyFile = function () {
    return new Promise(function (resolve, reject) {
        let filePath = path.resolve('./config/accountKeyFile.json');

        if (!fs.existsSync(filePath)) {
            _writeAccountKeyFile(filePath)
                .then(() => {
                    fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
                        if (err) reject(err);
                        else resolve(JSON.parse(data));
                    });
                })
                .catch((err) => winston.log('error', err));
        } else {
            fs.readFile(filePath, {
                encoding: 'utf-8'
            }, (err, data) => {
                if (err) reject(err);
                else resolve(JSON.parse(data));
            });
        }
    })
}


let _iv;
let _key;
getAccountKeyFile()
    .then((json) => { _key = json.key; _iv = json.iv; })
    .catch((err) => winston.log('error', err));

var encrypt = function (text) {
    if (text === null || typeof text === 'undefined') return text;

    try {
        var cipher = crypto.createCipheriv(_algorithm, _key, _iv);
        var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
        console.log('encrypted', encrypted)
        return encrypted;
    } catch (err) {
        winston.log('error', 'account.encrypt: ' + err);
    }
};

var decrypt = function (encryptedText) {
    if (encryptedText === null || typeof encryptedText === 'undefined') return encryptedText;

    try {
        var decipher = crypto.createDecipheriv(algorithm, _key, _iv)
        var decrypted = decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8');
        console.log('decrypted', decrypted)
        return decrypted;
    } catch (err) {
        winston.log('error', 'account.decrypt: ' + err);
    }
};

var AccountSchema = new Schema({
        createdAt: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: Schema.ObjectId,
            ref: 'User'
        },

        name: {
            type: String,
            required: true
        },
        region: {
            type: String,
            required: true
        },
        accessKeyId: {
            type: String,
            required: true
        },
        secretAccessKey: {
            type: String,
            required: true,
            set: encrypt,
            get: decrypt
        }
    }

);

//UserSchema.methods.hashPassword

AccountSchema.set('toObject', {
    getters: true
});
AccountSchema.set('toJSON', {
    getters: true
});

mongoose.model('Account', AccountSchema);