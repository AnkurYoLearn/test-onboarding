import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { OnboardingState, StudentOnboardingData, TeacherOnboardingData } from '../types';

interface OnboardingContextType extends OnboardingState {
  setUserType: (userType: 'student' | 'teacher') => void;
  updateStudentData: (data: Partial<StudentOnboardingData>) => void;
  updateTeacherData: (data: Partial<TeacherOnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

type OnboardingAction =
  | { type: 'SET_USER_TYPE'; payload: 'student' | 'teacher' }
  | { type: 'UPDATE_STUDENT_DATA'; payload: Partial<StudentOnboardingData> }
  | { type: 'UPDATE_TEACHER_DATA'; payload: Partial<TeacherOnboardingData> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_ONBOARDING' };

const initialState: OnboardingState = {
  currentStep: 0,
  totalSteps: 0,
  userType: null,
  studentData: {},
  teacherData: {},
  loading: false,
  error: null,
};

const onboardingReducer = (state: OnboardingState, action: OnboardingAction): OnboardingState => {
  switch (action.type) {
    case 'SET_USER_TYPE':
      return {
        ...state,
        userType: action.payload,
        currentStep: 1,
        totalSteps: action.payload === 'student' ? 9 : 10, // 9 steps for student
      };
    case 'UPDATE_STUDENT_DATA':
      return {
        ...state,
        studentData: {
          ...state.studentData,
          ...action.payload,
        },
      };
    case 'UPDATE_TEACHER_DATA':
      return {
        ...state,
        teacherData: {
          ...state.teacherData,
          ...action.payload,
        },
      };
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps),
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
      };
    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: Math.max(1, Math.min(action.payload, state.totalSteps)),
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'RESET_ONBOARDING':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  const setUserType = useCallback((userType: 'student' | 'teacher') => {
    dispatch({ type: 'SET_USER_TYPE', payload: userType });
  }, []);

  const updateStudentData = useCallback((data: Partial<StudentOnboardingData>) => {
    dispatch({ type: 'UPDATE_STUDENT_DATA', payload: data });
  }, []);

  const updateTeacherData = useCallback((data: Partial<TeacherOnboardingData>) => {
    dispatch({ type: 'UPDATE_TEACHER_DATA', payload: data });
  }, []);

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, []);

  const goToStep = useCallback((step: number) => {
    dispatch({ type: 'GO_TO_STEP', payload: step });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const resetOnboarding = () => {
    dispatch({ type: 'RESET_ONBOARDING' });
  };

  const value: OnboardingContextType = {
    ...state,
    setUserType,
    updateStudentData,
    updateTeacherData,
    nextStep,
    prevStep,
    goToStep,
    setLoading,
    setError,
    resetOnboarding,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
