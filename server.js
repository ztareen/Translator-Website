const http = require('http');
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
const apiKey = '73cf23470ca34f87a5878bec3f2c8100';
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
    const audioFile = req.files.audio;
    const audioFilePath = path.join(__dirname, 'uploads', audioFile.name);

    const language = req.body.language;

    const responseText = await make_stt_api_call(audioFilePath,language);
    
    const response = JSON.parse(responseText);
    
    if (!response || !response.DisplayText) {
      return res.status(500).send('Speech-to-text conversion failed');
    }
    res.render('index', { name: 'Zarak', project: 'Speech-to-Text', translationText: response.DisplayText });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
async function make_stt_api_call(path, language) {
  return new Promise((resolve, reject) => {
    const https = require('follow-redirects').https;
    const fs = require('fs');
    const options = {
      'method': 'POST',
      'hostname': 'westus.stt.speech.microsoft.com',
      'path': `/speech/recognition/conversation/cognitiveservices/v1?language=${language}`,
      //'path': '/speech/recognition/conversation/cognitiveservices/v1?language=' + language,
      //doesnt work
      'headers': {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-type': 'audio/wav',
        'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImtleTEiLCJ0eXAiOiJKV1QifQ.eyJyZWdpb24iOiJ3ZXN0dXMiLCJzdWJzY3JpcHRpb24taWQiOiJkNjIwYWZmZTRjZmE0YzI0OGUxNmY5N2QwNmQzYzVlOSIsInByb2R1Y3QtaWQiOiJTcGVlY2hTZXJ2aWNlcy5GMCIsImNvZ25pdGl2ZS1zZXJ2aWNlcy1lbmRwb2ludCI6Imh0dHBzOi8vYXBpLmNvZ25pdGl2ZS5taWNyb3NvZnQuY29tL2ludGVybmFsL3YxLjAvIiwiYXp1cmUtcmVzb3VyY2UtaWQiOiIvc3Vic2NyaXB0aW9ucy82MDdlNTJhNy01ZjIzLTRjMGItOTFiOS1kNWIyOGNkYjhhM2QvcmVzb3VyY2VHcm91cHMvemFyYWt0cmFuc2xhdG9yL3Byb3ZpZGVycy9NaWNyb3NvZnQuQ29nbml0aXZlU2VydmljZXMvYWNjb3VudHMvU3BlZWNoVGVzdFphcmFrIiwic2NvcGUiOiJzcGVlY2hzZXJ2aWNlcyIsImF1ZCI6InVybjptcy5zcGVlY2hzZXJ2aWNlcy53ZXN0dXMiLCJleHAiOjE2OTk4NTgzOTAsImlzcyI6InVybjptcy5jb2duaXRpdmVzZXJ2aWNlcyJ9.Y_axnmrD0Tq98ERnY9tt-Yna9wsVsHqGvEfD3n17x6JyYiLSmwfjc7IMhXja0sQptfjy2whbKd_DH-qIqr14dw'
      },
      'maxRedirects': 20
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        const responseText = body.toString();
        resolve(responseText);
      });
      res.on('error', (error) => {
        console.error(error);
        reject(error);
      });
    });
    const postData = fs.readFileSync(path);
    req.write(postData);
    req.end();
  });
}





  //   audioFile.mv(audioFilePath, async (err) => {
  //     if (err) {
  //       return res.status(500).send(err);
  //     }
  //     try {
  //       const axiosConfig = {
  //         headers: {
  //           'Ocp-Apim-Subscription-Key': apiKey,
  //           'Content-type': 'audio/wav',
  //           'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6ImtleTEiLCJ0eXAiOiJKV1QifQ.eyJyZWdpb24iOiJ3ZXN0dXMiLCJzdWJzY3JpcHRpb24taWQiOiJkNjIwYWZmZTRjZmE0YzI0OGUxNmY5N2QwNmQzYzVlOSIsInByb2R1Y3QtaWQiOiJTcGVlY2hTZXJ2aWNlcy5GMCIsImNvZ25pdGl2ZS1zZXJ2aWNlcy1lbmRwb2ludCI6Imh0dHBzOi8vYXBpLmNvZ25pdGl2ZS5taWNyb3NvZnQuY29tL2ludGVybmFsL3YxLjAvIiwiYXp1cmUtcmVzb3VyY2UtaWQiOiIvc3Vic2NyaXB0aW9ucy82MDdlNTJhNy01ZjIzLTRjMGItOTFiOS1kNWIyOGNkYjhhM2QvcmVzb3VyY2VHcm91cHMvemFyYWt0cmFuc2xhdG9yL3Byb3ZpZGVycy9NaWNyb3NvZnQuQ29nbml0aXZlU2VydmljZXMvYWNjb3VudHMvU3BlZWNoVGVzdFphcmFrIiwic2NvcGUiOiJzcGVlY2hzZXJ2aWNlcyIsImF1ZCI6InVybjptcy5zcGVlY2hzZXJ2aWNlcy53ZXN0dXMiLCJleHAiOjE2OTk4NTgzOTAsImlzcyI6InVybjptcy5jb2duaXRpdmVzZXJ2aWNlcyJ9.Y_axnmrD0Tq98ERnY9tt-Yna9wsVsHqGvEfD3n17x6JyYiLSmwfjc7IMhXja0sQptfjy2whbKd_DH-qIqr14dw'
  //         },
  //       };
  //       const response = await axios.post('https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=hi-IN', null, axiosConfig);
  //       console.log(JSON.stringify(response.data));
  //       res.render('index', { name: 'Zarak', project: 'Speech-to-Text', translationText: response.data });
  //       fs.unlinkSync(audioFilePath);
  //     } catch (error) {
  //       console.error(error);
  //       res.status(500).send('Speech-to-text conversion failed');
  //     }
  //   });