import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  CountryRequest,
  CurriculumSubjectsRequest,
  DeviceAccessRequest,
  HelpPreferencesRequest,
  LearningGoalsRequest,
  LearningInterestsRequest,
  LearningStylesRequest,
  LessonPlanPreferencesRequest,
  OnboardingStatusResponse,
  OptionsResponse,
  TeacherCountryRequest,
  TeacherGradeLevelsRequest,
  TeacherSubjectsRequest,
  TeachingGoalsRequest,
  TechComfortRequest
} from '../types';

// API base URL - direct connection to backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.yolearn.ai';

console.log('🔗 API Base URL:', API_BASE_URL, '| Environment:', process.env.NODE_ENV);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout and other configurations for better error handling
  timeout: 10000,
  withCredentials: false, // Don't send cookies for CORS
});

// Authentication API
export const authAPI = {
  startOnboarding: async (userId: string, userType: 'student' | 'teacher'): Promise<ApiResponse<{ 
    user_id: string; 
    user_type: string; 
    onboarding_status: string;
  }>> => {
    try {
      console.log('🚀 API: Starting onboarding...', { userId, userType });
      const response: AxiosResponse<any> = await api.get(`/accounts/start-onboarding/?user_id=${userId}&user_type=${userType}`);
      console.log('📥 API: Start onboarding response:', response.data);
      
      // Our backend returns: { success: true, message: "...", data: { user_id, user_type, onboarding_status } }
      if (response.data.success && response.data.data) {
        // Store user data in localStorage for future API calls
        localStorage.setItem('userId', userId);
        localStorage.setItem('userType', userType);
        console.log('💾 API: Stored user info in localStorage:', { userId, userType });
        
        return {
          success: true,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.error || 'Invalid response format');
      }
    } catch (error: any) {
      console.log('❌ API: Start onboarding error:', error);
      const data = error.response?.data;
      let errorMsg = 'Failed to start onboarding';
      if (typeof data === 'object' && data) {
        if (data.error) errorMsg = data.error;
        else if (data.detail) errorMsg = data.detail;
        else if (data.message) errorMsg = data.message;
      }
      return {
        success: false,
        error: errorMsg,
        fieldErrors: data && typeof data === 'object' ? data : undefined
      };
    }
  }
};

// Student Onboarding API
export const studentAPI = {
  getCurricula: async (request: CountryRequest): Promise<OptionsResponse> => {
    try {
      console.log('🔄 API: Calling getCurricula with:', request);
      const response: AxiosResponse<OptionsResponse> = await api.post('/accounts/onboarding/student/curricula/', request);
      console.log('✅ API: getCurricula response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: getCurricula error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch curricula');
    }
  },

  getSubjects: async (request: CurriculumSubjectsRequest): Promise<OptionsResponse> => {
    try {
      console.log('🔄 API: Calling getSubjects with:', request);
      const response: AxiosResponse<OptionsResponse> = await api.post('/accounts/onboarding/student/subjects/', request);
      console.log('✅ API: getSubjects response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: getSubjects error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch subjects');
    }
  },

  getLearningInterests: async (request: LearningInterestsRequest): Promise<OptionsResponse> => {
    try {
      console.log('🔄 API: Calling getLearningInterests with:', request);
      const response: AxiosResponse<OptionsResponse> = await api.post('/accounts/onboarding/student/learning-interests/', request);
      console.log('✅ API: getLearningInterests response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: getLearningInterests error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch learning interests');
    }
  },

  getLearningStyles: async (request: LearningStylesRequest): Promise<OptionsResponse> => {
    try {
      console.log('🔄 API: Calling getLearningStyles with:', request);
      const response: AxiosResponse<OptionsResponse> = await api.post('/accounts/onboarding/student/learning-styles/', request);
      console.log('✅ API: getLearningStyles response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: getLearningStyles error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch learning styles');
    }
  },

  getHelpPreferences: async (request: HelpPreferencesRequest): Promise<OptionsResponse> => {
    try {
      console.log('🔄 API: Calling getHelpPreferences with:', request);
      const response: AxiosResponse<OptionsResponse> = await api.post('/accounts/onboarding/student/help-preferences/', request);
      console.log('✅ API: getHelpPreferences response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: getHelpPreferences error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch help preferences');
    }
  },

  getLearningGoals: async (request: LearningGoalsRequest): Promise<OptionsResponse> => {
    try {
      console.log('🔄 API: Calling getLearningGoals with:', request);
      const response: AxiosResponse<OptionsResponse> = await api.post('/accounts/onboarding/student/learning-goals/', request);
      console.log('✅ API: getLearningGoals response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: getLearningGoals error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch learning goals');
    }
  },

  getGradesByCurriculum: async (request: { curriculum: string }): Promise<OptionsResponse> => {
    try {
      console.log('🔄 API: Calling getGradesByCurriculum with:', request);
      const response: AxiosResponse<OptionsResponse> = await api.post('/accounts/onboarding/student/grades/', request);
      console.log('✅ API: getGradesByCurriculum response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: getGradesByCurriculum error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch grades');
    }
  }
};

// Teacher Onboarding API
export const teacherAPI = {
  getGradeLevels: async (request: TeacherCountryRequest): Promise<OptionsResponse> => {
    try {
      console.log('🔄 API: Calling teacher getGradeLevels with:', request);
      const response: AxiosResponse<OptionsResponse> = await api.post('/accounts/onboarding/teacher/grade-levels/', request);
      console.log('✅ API: teacher getGradeLevels response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: teacher getGradeLevels error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch grade levels');
    }
  },

  getCurricula: async (request: TeacherGradeLevelsRequest): Promise<OptionsResponse> => {
    try {
      console.log('🔄 API: Calling teacher getCurricula with:', request);
      const response: AxiosResponse<OptionsResponse> = await api.post('/accounts/onboarding/teacher/curricula/', request);
      console.log('✅ API: teacher getCurricula response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: teacher getCurricula error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch curricula');
    }
  },

  getSubjects: async (request: TeacherSubjectsRequest): Promise<OptionsResponse> => {
    try {
      console.log('🔄 API: Calling teacher getSubjects with:', request);
      const response: AxiosResponse<OptionsResponse> = await api.post('/accounts/onboarding/teacher/subjects/', request);
      console.log('✅ API: teacher getSubjects response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: teacher getSubjects error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch subjects');
    }
  },

  getTeachingGoals: async (request: TeachingGoalsRequest): Promise<OptionsResponse> => {
    try {
      console.log('🔄 API: Calling teacher getTeachingGoals with:', request);
      const response: AxiosResponse<OptionsResponse> = await api.post('/accounts/onboarding/teacher/teaching-goals/', request);
      console.log('✅ API: teacher getTeachingGoals response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: teacher getTeachingGoals error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch teaching goals');
    }
  },

  getTechComfort: async (request: TechComfortRequest): Promise<OptionsResponse> => {
    try {
      console.log('🔄 API: Calling teacher getTechComfort with:', request);
      const response: AxiosResponse<OptionsResponse> = await api.post('/accounts/onboarding/teacher/tech-comfort/', request);
      console.log('✅ API: teacher getTechComfort response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: teacher getTechComfort error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch tech comfort options');
    }
  },

  getLessonPlanPreferences: async (request: LessonPlanPreferencesRequest): Promise<OptionsResponse> => {
    try {
      console.log('🔄 API: Calling teacher getLessonPlanPreferences with:', request);
      const response: AxiosResponse<OptionsResponse> = await api.post('/accounts/onboarding/teacher/lesson-plan-preferences/', request);
      console.log('✅ API: teacher getLessonPlanPreferences response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: teacher getLessonPlanPreferences error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch lesson plan preferences');
    }
  },
  
  getDeviceAccess: async (request: DeviceAccessRequest): Promise<OptionsResponse> => {
    try {
      console.log('🔄 API: Calling teacher getDeviceAccess with:', request);
      const response: AxiosResponse<OptionsResponse> = await api.post('/accounts/onboarding/teacher/device-access/', request);
      console.log('✅ API: teacher getDeviceAccess response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API: teacher getDeviceAccess error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch device access options');
    }
  }
};

// Unified Onboarding API
export const onboardingAPI = {
  saveComplete: async (data: Record<string, any>): Promise<ApiResponse<{ success: boolean; message: string; user_type: string }>> => {
    try {
      // Get user_id and user_type from localStorage for the save request
      const authData = {
        userId: localStorage.getItem('userId'),
        userType: localStorage.getItem('userType')
      };
      
      if (!authData.userId || !authData.userType) {
        return {
          success: false,
          error: 'User ID and user type are required. Please start onboarding properly.'
        };
      }
      
      // Include user_id and user_type in the request data
      const requestData = {
        ...data,
        user_id: authData.userId,
        user_type: authData.userType
      };
      
      console.log('🔄 API: Saving onboarding data:', requestData);
      const response = await api.post('/accounts/onboarding/save/', requestData);
      console.log('✅ API: Save response:', response.data);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      console.error('❌ API: Save error:', error);
      console.error('❌ API: Save error response:', error.response?.data);
      
      const errorData = error.response?.data;
      let errorMessage = 'Failed to save onboarding data';
      
      if (errorData) {
        if (errorData.error) {
          errorMessage = errorData.error;
        }
        if (errorData.validation_errors) {
          console.error('❌ API: Validation errors:', errorData.validation_errors);
          errorMessage += ` - Validation errors: ${JSON.stringify(errorData.validation_errors)}`;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
        fieldErrors: errorData?.validation_errors
      };
    }
  },

  getOnboardingStatus: async (): Promise<ApiResponse<OnboardingStatusResponse>> => {
    try {
      // Get user_id and user_type from localStorage for the status request
      const authData = {
        userId: localStorage.getItem('userId'),
        userType: localStorage.getItem('userType')
      };
      
      if (!authData.userId || !authData.userType) {
        return {
          success: false,
          error: 'User ID and user type are required. Please start onboarding properly.'
        };
      }
      
      const response: AxiosResponse<OnboardingStatusResponse> = await api.get(
        `/accounts/onboarding/status/?user_id=${authData.userId}&user_type=${authData.userType}`
      );
      
      // The backend returns the data directly in the format we expect
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to get onboarding status'
      };
    }
  }
};

export default api;
