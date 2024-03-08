const axios = require('axios');

const apiKey = '7b4097833a7a45a38bb2760824133f32';
const endpoint = 'https://api.cognitive.microsofttranslator.com';
const path = '/translate?api-version=3.0';
const region = 'westus';

async function translateText(inputText, targetLanguage) {
  try {
    const response = await axios.post(
      `${endpoint}${path}&to=${targetLanguage}`,
      [
        {
          Text: inputText,
        },
      ],
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-type': 'application/json',
          'Ocp-Apim-Subscription-Region': region,
        },
      }
    );

    if (response.data && response.data.length > 0) {
      const translatedText = response.data[0].translations[0].text;
      return translatedText;
    } else {
      throw new Error('Translation failed');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Translation request failed');
  }
}

module.exports = {
  translateText, // Export the translateText function
};