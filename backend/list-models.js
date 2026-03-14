const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyAxHyvCkOyMw2P7yggBycroe0M2PD9neXs';

const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    console.log('Fetching available models...\n');
    
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.0-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash'
    ];

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hi');
        console.log(`✅ ${modelName} - WORKS!`);
      } catch (err) {
        console.log(`❌ ${modelName} - ${err.message.split('\n')[0]}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();