var crypto = require('crypto-js');

var secretMessage = {
    name: 'Kyle',
    secretName: 'kylbrew'
};

var secretKey = 'findchips';

var encryptedMessage = crypto.AES.encrypt(JSON.stringify(secretMessage), secretKey);

console.log('Encrypted message: ' + encryptedMessage);

var bytes = crypto.AES.decrypt(encryptedMessage, secretKey);
var decryptedMessage = JSON.parse(bytes.toString(crypto.enc.Utf8));

console.log('Decrypted message: ' + decryptedMessage.name + ' - '+ decryptedMessage.secretName);
