import React from "react";
import styled from "styled-components";

const ProgressBarWrapper = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 600px;
  padding: 0;
`;

const ProgressSegment = styled.div<{ isActive: boolean }>`
  height: 8px;
  flex: 1;
  background: ${({ isActive }) =>
    isActive
      ? "linear-gradient(90deg, #41CED3 0%, #419CDA 71.92%, #4177DF 100%)"
      : "#E0E0E0"};
  border-radius: 4px;
  transition: background-color 0.3s ease;
`;

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <ProgressBarWrapper>
      {Array.from({ length: totalSteps }, (_, i) => (
        <ProgressSegment key={i} isActive={i < currentStep} />
      ))}
    </ProgressBarWrapper>
  );
};

export default ProgressBar;
