// Import necessary libraries
const express = require('express');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.set('view engine', 'ejs');

// Replace these values with your Azure Speech service subscription key and region
const sttSubscriptionKey = '73cf23470ca34f87a5878bec3f2c8100';
const region = 'westus';
const hostname = '127.0.0.1';
const port = 3000;
const uploadDirectory = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

app.get('/', (req, res) => {
  res.render('index', { name: 'Zarak', project: 'Speech-to-Text' });
});

app.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.audio) {
      return res.status(400).send('No audio file uploaded.');
    }

    // Speech-to-Text
    const audioFile = req.files.audio;
    const audioFilePath = path.join(uploadDirectory, audioFile.name);
    
    const sttResponse = await make_stt_api_call(audioFilePath, 'en'); // Change 'en' to the desired language code
    const sttResult = sttResponse.data;
    const transcribedText = sttResult.DisplayText;

    // Display transcribed text
    res.render('index', {
      name: 'Zarak',
      project: 'Speech-to-Text',
      originalText: transcribedText,
      translatedText: transcribedText, // Placeholder for translation (same as transcribed text)
      audioUrl: '' // No need for Text-to-Speech in this case
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function make_stt_api_call(filePath, language) {
  const url = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${language}`;
  const audioData = fs.readFileSync(filePath);

  const response = await axios.post(url, audioData, {
    headers: {
      'Content-Type': 'audio/wav',
      'Ocp-Apim-Subscription-Key': sttSubscriptionKey
    }
  });

  return response;
}