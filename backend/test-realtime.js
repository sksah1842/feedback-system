const axios = require('axios');

async function testRealtimeFeedback() {
  try {
    console.log('🧪 Testing real-time feedback system...');
    
    // Submit test feedback
    const testFeedback = {
      productId: 'Test Product',
      name: 'Test User',
      email: 'test@example.com',
      rating: 5,
      text: 'This is a test feedback for real-time updates!'
    };
    
    console.log('📤 Submitting feedback:', testFeedback);
    
    const response = await axios.post('http://localhost:5000/api/feedback', testFeedback);
    
    console.log('✅ Feedback submitted successfully!');
    console.log('📊 Response:', response.data);
    
    // Wait a moment for socket emission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🎉 Test completed! Check the admin dashboard for real-time updates.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testRealtimeFeedback(); 