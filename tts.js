const https = require('follow-redirects').https;
const fs = require('fs');
const path = require('path');

const apiKey = '73cf23470ca34f87a5878bec3f2c8100';
const endpoint = 'westus.tts.speech.microsoft.com';
const pathUrl = '/cognitiveservices/v1/';
const outputFormat = 'riff-16khz-16bit-mono-pcm';


async function generateSpeech(inputText, voiceName = 'en-US-AriaNeural') {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      hostname: endpoint,
      path: pathUrl,
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': outputFormat,
      },
      maxRedirects: 20,
    };

    const req = https.request(options, (res) => {
      const chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const audioBuffer = Buffer.concat(chunks);

        // Save the audio to a file
        const audioFilePath = path.join(__dirname, 'uploads', 'output.wav');
        fs.writeFileSync(audioFilePath, audioBuffer);

        resolve(audioFilePath);
      });

      res.on('error', (error) => {
        console.error(error);
        reject(error);
      });
    });

    const postData = `<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female' name='${voiceName}'>${inputText}</voice></speak>`;

    req.write(postData);
    req.end();
  });
}

module.exports = {
  generateSpeech,
};