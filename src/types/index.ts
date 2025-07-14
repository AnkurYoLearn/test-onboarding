// User Types (simplified for onboarding only)
export interface User {
  id: string;
  email: string;
  name?: string;
  user_type?: 'student' | 'teacher';
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_confirmed?: boolean;
  created_at?: string;
  profile_photo?: string;
}

// API Request/Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  fieldErrors?: { [key: string]: string | string[] };
}

export interface OptionsResponse {
  options: string[];
}

// Student Request Types
export interface CountryRequest {
  country: string;
}

export interface CurriculumSubjectsRequest {
  country: string;
  curriculum: string;
  grade: string;
}

export interface LearningInterestsRequest {
  grade: string;
  country: string;
  curriculum: string;
  subjects: string[];
}

export interface LearningStylesRequest {
  grade: string;
  curriculum: string;
  country: string;
  subjects: string[];
}

export interface HelpPreferencesRequest {
  grade: string;
  curriculum: string;
  country: string;
  subjects: string[];
}

export interface LearningGoalsRequest {
  grade: string;
  curriculum: string;
  country: string;
  subjects: string[];
}

// Teacher Request Types
export interface TeacherCountryRequest {
  country: string;
}

export interface TeacherGradeLevelsRequest {
  country: string;
  grade_levels: string;
}

export interface TeacherSubjectsRequest {
  country: string;
  curriculum: string;
  grade_levels: string;
}

export interface TeachingGoalsRequest {
  country: string;
  curriculum: string;
  grade_levels: string;
  subjects: string[];
}

export interface TechComfortRequest {
  country: string;
  grade_levels: string;
}

export interface LessonPlanPreferencesRequest {
  country: string;
  curriculum: string;
  subjects: string[];
  tech_comfort: string;
}

export interface DeviceAccessRequest {
  country: string;
  grade_levels: string;
}

// Onboarding Data Save/Load Types
export interface SaveOnboardingRequest {
  data: Record<string, any>;
  completed?: boolean;
}

export interface OnboardingDataResponse {
  id: string;
  user_id: string;
  data: Record<string, any>;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

// New response types for separate student/teacher profiles
export interface StudentProfileResponse {
  id: string;
  user_id: string;
  name?: string;
  country?: string;
  selected_curriculum?: string;
  grade?: string;
  selected_subjects?: string[];
  selected_learning_interests?: string[];
  selected_learning_styles?: string[];
  selected_help_preferences?: string[];
  selected_learning_goals?: string[];
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeacherProfileResponse {
  id: string;
  user_id: string;
  name?: string;
  country?: string;
  selected_grade_levels?: string;
  selected_curriculum?: string;
  selected_subjects?: string[];
  selected_teaching_goals?: string[];
  selected_tech_comfort?: string;
  selected_lesson_plan?: string;
  selected_device_access?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingStatusResponse {
  success: boolean;
  data: {
    user_id: string;
    user_type: 'student' | 'teacher';
    completed: boolean;
    has_data: boolean;
    profile?: StudentProfileResponse | TeacherProfileResponse;
  };
}

// Onboarding State Types
export interface StudentOnboardingData {
  name?: string;
  country?: string;
  grade?: string;
  selected_curriculum?: string;
  selected_subjects?: string[];
  selected_learning_interests?: string[];
  selected_learning_styles?: string[];
  selected_help_preferences?: string[];
  selected_learning_goals?: string[];
}

export interface TeacherOnboardingData {
  name?: string;
  country?: string;
  selected_grade_levels?: string;
  selected_curriculum?: string;
  selected_subjects?: string[];
  selected_teaching_goals?: string[];
  selected_tech_comfort?: string;
  selected_lesson_plan?: string;
  selected_device_access?: string;
}

export interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  userType: 'student' | 'teacher' | null;
  studentData: StudentOnboardingData;
  teacherData: TeacherOnboardingData;
  loading: boolean;
  error: string | null;
}

// Chat/UI Types
export interface ChatMessage {
  id: string;
  type: 'question' | 'answer' | 'options' | 'loading';
  content: string;
  options?: string[];
  timestamp: Date;
}

export interface ChatStep {
  id: string;
  type: 'input' | 'select' | 'multiselect';
  question: string;
  placeholder?: string;
  apiEndpoint?: string;
  requestBuilder?: (data: any) => any;
  validation?: (value: any) => boolean;
  nextStep?: string;
}
