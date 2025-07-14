import styled, { css, keyframes } from 'styled-components';

// Color palette
export const colors = {
  primary: '#00C5CD',
  primaryHover: '#0891b2',
  secondary: '#f3f4f6',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  text: '#1f2937',
  textLight: '#6b7280',
  border: '#e5e7eb',
  background: '#ffffff',
  backgroundLight: '#f9fafb',
  chatBubbleUser: '#06b6d4',
  chatBubbleBot: '#f3f4f6',
  gradient: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
};

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// Container Components
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${colors.backgroundLight};
`;

export const ContentContainer = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
`;

// Card Components
export const Card = styled.div<{ $elevated?: boolean }>`
  background: ${colors.background};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: ${props => props.$elevated 
    ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };
  border: 1px solid ${colors.border};
  animation: ${fadeIn} 0.3s ease-out;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const ChatCard = styled(Card)`
  max-width: 800px;
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 80vh;
    max-height: 600px;
  }
`;

// Button Components
export const Button = styled.button<{ 
  $variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  $size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  text-decoration: none;
  
  ${props => {
    switch (props.$size) {
      case 'sm':
        return css`
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        `;
      case 'lg':
        return css`
          padding: 0.75rem 2rem;
          font-size: 1.125rem;
        `;
      default:
        return css`
          padding: 0.625rem 1.5rem;
          font-size: 1rem;
        `;
    }
  }}
  
  ${props => {
    switch (props.$variant) {
      case 'secondary':
        return css`
          background: ${colors.secondary};
          color: ${colors.text};
          &:hover:not(:disabled) {
            background: ${colors.border};
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${colors.primary};
          border: 2px solid ${colors.primary};
          &:hover:not(:disabled) {
            background: ${colors.primary};
            color: white;
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${colors.textLight};
          &:hover:not(:disabled) {
            background: ${colors.secondary};
            color: ${colors.text};
          }
        `;
      default:
        return css`
          background: ${colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background: ${colors.primaryHover};
          }
        `;
    }
  }}
  
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
  `}
`;

// Input Components
export const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.9rem 1.5rem;
  border: 2px solid ${props => props.$hasError ? colors.error : "#00000033"};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background: ${colors.background};
  color: #717171;
  font-weight: 600;
  box-shadow: 0px 2px 4px 0px #0000001A, 0px 7px 7px 0px #0000000D;

  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
  
  &::placeholder {
    color: ${colors.textLight};
  }
`;

export const Select = styled.select<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$hasError ? colors.error : colors.border};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background: ${colors.background};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

// Text Components
export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.text};
  margin: 0 0 1rem 0;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.text};
  margin: 0 0 1rem 0;
`;

export const Text = styled.p<{ 
  $size?: 'sm' | 'md' | 'lg';
  $color?: 'primary' | 'secondary' | 'light';
  $center?: boolean;
}>`
  margin: 0 0 1rem 0;
  line-height: 1.6;
  
  ${props => {
    switch (props.$size) {
      case 'sm':
        return css`font-size: 0.875rem;`;
      case 'lg':
        return css`font-size: 1.125rem;`;
      default:
        return css`font-size: 1rem;`;
    }
  }}
  
  ${props => {
    switch (props.$color) {
      case 'secondary':
        return css`color: ${colors.textLight};`;
      case 'light':
        return css`color: ${colors.textLight};`;
      default:
        return css`color: ${colors.text};`;
    }
  }}
  
  ${props => props.$center && css`text-align: center;`}
`;

// Form Components
export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  font-weight: 500;
  color: ${colors.text};
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

export const ErrorMessage = styled.div`
  color: ${colors.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

// Chat Components
export const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ChatHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${colors.border};
  background: ${colors.background};
`;

export const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ChatInput = styled.div`
  padding: 1rem 2rem;
  border-top: 1px solid ${colors.border};
  background: ${colors.background};
`;

export const MessageBubble = styled.div<{ $isUser?: boolean }>`
  max-width: 80%;
  padding: 1rem 1.5rem;
  border-radius: 18px;
  animation: ${slideIn} 0.3s ease-out;
  
  ${props => props.$isUser 
    ? css`
        background: ${colors.chatBubbleUser};
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 6px;
      `
    : css`
        background: ${colors.chatBubbleBot};
        color: ${colors.text};
        align-self: flex-start;
        border-bottom-left-radius: 6px;
      `
  }
`;

export const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
  max-width: 400px;
  margin: 1.6px auto;

`;

export const OptionButton = styled.button<{ $selected?: boolean }>`
  padding: 1.5rem 3rem;
  border: solid ${props => props.$selected ? colors.primary : colors.border};
  border-radius: 1rem;
  background: ${colors.background};
  color: ${props => props.$selected ? colors.primary : colors.text};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  border-width: 2px 2px 5px 2px;
  
  &:hover {
    background: ${props => props.$selected ? colors.primaryHover + "03" : colors.secondary};
  }
`;

// Progress Components
export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${colors.border};
  border-radius: 2px;
  overflow: hidden;
  margin: 1rem 0;
`;

export const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: ${colors.primary};
  transition: width 0.3s ease;
  width: ${props => props.$progress}%;
`;

// Loading Components
export const LoadingDots = styled.div`
  display: inline-flex;
  gap: 0.25rem;
  
  span {
    width: 6px;
    height: 6px;
    background: ${colors.textLight};
    border-radius: 50%;
    animation: ${pulse} 1.4s ease-in-out infinite both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
`;

// Layout Components
export const Flex = styled.div<{
  $direction?: 'row' | 'column';
  $justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  $align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  $gap?: string;
  $wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${props => props.$direction || 'row'};
  justify-content: ${props => props.$justify || 'flex-start'};
  align-items: ${props => props.$align || 'stretch'};
  gap: ${props => props.$gap || '0'};
  flex-wrap: ${props => props.$wrap ? 'wrap' : 'nowrap'};
`;

export const Grid = styled.div<{ $columns?: number; $gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 2}, 1fr);
  gap: ${props => props.$gap || '1rem'};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
