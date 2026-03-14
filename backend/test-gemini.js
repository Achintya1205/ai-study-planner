const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyAtf8-SvmqZRws-byphwLME-O_O6DqghTo';

const genAI = new GoogleGenerativeAI(API_KEY);

async function test() {
  try {
    console.log('Testing with latest package...\n');
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash'
    });
    
    const result = await model.generateContent('Say hello in one sentence');
    console.log('✅ SUCCESS!');
    console.log('Response:', result.response.text());
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

test();