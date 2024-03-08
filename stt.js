var https = require('follow-redirects').https;
var fs = require('fs');

var options = {
  'method': 'POST',
  'hostname': 'westus.tts.speech.microsoft.com',
  'path': '/cognitiveservices/v1/',
  'headers': {
    'Ocp-Apim-Subscription-Key': '73cf23470ca34f87a5878bec3f2c8100',
    'Content-Type': 'application/ssml+xml',
    'X-Microsoft-OutputFormat': 'riff-16khz-16bit-mono-pcm'
  },
  'maxRedirects': 20
};

var req = https.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function (chunk) {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on("error", function (error) {
    console.error(error);
  });
});

var postData =  "<speak version='1.0' xml:lang='en-US'><voice xml:lang='en-US' xml:gender='Female'\r\n    name='en-US-AriaNeural'>\r\n        Microsoft Speech Service Text-To-Speech API\r\n</voice></speak>";

req.write(postData);

req.end();

//Just to get me started
//think abt play widget for response at the end (file that gets played like postman file)
//broken into steps, so you can show that in presentation
//maybe say you can translate it into any format as well
//wiring up different services to create an application
