// Authentication utility functions
export const AuthUtils = {
  // Store authentication data in localStorage
  storeAuthData: (user: any, tokens: any) => {
    localStorage.setItem('authToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    localStorage.setItem('userId', user.id.toString());
    localStorage.setItem('userType', user.user_type);
    localStorage.setItem('userName', user.name || user.email);
  },

  // Get stored authentication data
  getAuthData: () => {
    return {
      authToken: localStorage.getItem('authToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      userId: localStorage.getItem('userId'),
      userType: localStorage.getItem('userType') as 'student' | 'teacher' | null,
      userName: localStorage.getItem('userName'),
    };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const { authToken, userId, userType } = AuthUtils.getAuthData();
    return !!(authToken && userId && userType);
  },

  // Clear authentication data
  clearAuthData: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
  },

  // Build onboarding URL
  buildOnboardingUrl: (userId: string, userType: 'student' | 'teacher', baseUrl: string = '') => {
    return `${baseUrl}/onboarding?user_id=${userId}&user_type=${userType}`;
  }
};

export default AuthUtils;
