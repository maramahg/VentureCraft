const QRCode = require('qrcode');
const fs = require('fs');

async function generate() {
    const urlWithSlash = "https://kfupm-venturecraft.org/";
    const urlWithoutSlash = "https://kfupm-venturecraft.org";

    await QRCode.toFile('qr_with_slash.png', urlWithSlash, {
        errorCorrectionLevel: 'H',
        scale: 10,
        margin: 0
    });

    await QRCode.toFile('qr_without_slash.png', urlWithoutSlash, {
        errorCorrectionLevel: 'H',
        scale: 10,
        margin: 0
    });

    console.log('Generated both.');
}

generate().catch(console.error);
