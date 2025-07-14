// Utility functions for the onboarding app

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const formatStepNumber = (current: number, total: number): string => {
  return `${current}/${total}`;
};

export const calculateProgress = (current: number, total: number): number => {
  return Math.min((current / total) * 100, 100);
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const scrollToBottom = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
};

export const downloadJSON = (data: any, filename: string) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = filename;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const formatUserType = (userType: 'student' | 'teacher'): string => {
  return userType.charAt(0).toUpperCase() + userType.slice(1);
};

export const getStepTitle = (userType: 'student' | 'teacher', step: number): string => {
  if (userType === 'student') {
    const studentSteps = [
      'Name',
      'Country',
      'Curriculum',
      'Grade',
      'Subjects',
      'Learning Interests',
      'Learning Styles',
      'Help Preferences',
      'Learning Goals',
      'Summary'
    ];
    return studentSteps[step - 1] || 'Unknown Step';
  } else {
    const teacherSteps = [
      'Name',
      'Country',
      'Curriculum',
      'Grade Levels',
      'Subjects',
      'Teaching Goals',
      'Tech Comfort',
      'Lesson Plans',
      'Device Access',
      'Summary'
    ];
    return teacherSteps[step - 1] || 'Unknown Step';
  }
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const isValidSelection = (value: any, required: boolean = true): boolean => {
  if (!required) return true;
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  
  return value !== null && value !== undefined;
};
