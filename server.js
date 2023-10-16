const https = require('https');
const subscriptionKey = 'YOUR_AZURE_SUBSCRIPTION_KEY';
const serviceRegion = 'YOUR_AZURE_SERVICE_REGION';

const requestHeaders = {
  'Content-Type': 'audio/wav', // Adjust content type if your audio is in a different format
  'Ocp-Apim-Subscription-Key': subscriptionKey,
};

const options = {
  hostname: `${serviceRegion}.stt.speech.microsoft.com`,
  port: 443,
  path: '/speech/recognition/conversation/cognitiveservices/v1',
  method: 'POST', // Use POST for sending audio data
  headers: requestHeaders,
};

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

// Here you would need to send your audio data as the request body.
// You can stream or send the audio data as needed.
// For example, if you have a buffer containing the audio data:
// req.write(yourAudioBuffer);
// req.end();