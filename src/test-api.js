// Simple test to check if API endpoints are working
// Run this in browser console to test API connectivity

const testAPI = async () => {
  const baseURL = 'http://127.0.0.1:8000';
  
  console.log('🔄 Testing API connectivity...');
  
  // Test 1: Start onboarding
  try {
    console.log('🔄 Testing start onboarding...');
    const response1 = await fetch(`${baseURL}/accounts/start-onboarding/?user_id=test123&user_type=student`);
    const data1 = await response1.json();
    console.log('✅ Start onboarding:', data1);
  } catch (error) {
    console.error('❌ Start onboarding error:', error);
  }
  
  // Test 2: Get curricula
  try {
    console.log('🔄 Testing get curricula...');
    const response2 = await fetch(`${baseURL}/accounts/onboarding/student/curricula/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ country: 'India' })
    });
    const data2 = await response2.json();
    console.log('✅ Get curricula:', data2);
  } catch (error) {
    console.error('❌ Get curricula error:', error);
  }
  
  // Test 3: Get onboarding status
  try {
    console.log('🔄 Testing get onboarding status...');
    const response3 = await fetch(`${baseURL}/accounts/onboarding/status/?user_id=123&user_type=student`);
    const data3 = await response3.json();
    console.log('✅ Get onboarding status:', data3);
  } catch (error) {
    console.error('❌ Get onboarding status error:', error);
  }
};

// Run the test
testAPI();
