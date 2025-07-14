import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatBot from '../components/onboarding/ChatBot';

const OnboardingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('user_type') as 'student' | 'teacher' || 'student';

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Instructions for users without URL parameters */}
      {/* {!searchParams.get('user_id') && !searchParams.get('user_type') && (
        <div style={{
          maxWidth: '600px',
          textAlign: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Welcome to YoLearn Onboarding!</h2>
          <p>
            To start your onboarding experience, you can either:
          </p>
          <ul style={{ textAlign: 'left', marginTop: '1rem' }}>
            <li>Visit with URL parameters: <code>?user_id=YOUR_ID&user_type=student</code> or <code>?user_id=YOUR_ID&user_type=teacher</code></li>
            <li>Or use the chatbot below to enter your details manually</li>
          </ul>
        </div>
      )} */}
      
      {/* Remove userType prop, just render <ChatBot /> */}
      <ChatBot />
    </div>
  );
};

export default OnboardingPage;
