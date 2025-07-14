import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StudentProfileResponse, TeacherProfileResponse } from '../../types';
import {
  Card,
  Title,
  Text,
  Flex,
  Button,
  colors
} from '../styled/StyledComponents';
import styled from 'styled-components';

const ProfileCard = styled(Card)`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const SectionTitle = styled.h3`
  color: ${colors.primary};
  margin: 1.5rem 0 0.75rem 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-weight: 500;
  color: ${colors.text};
`;

const Value = styled.span`
  color: ${colors.textLight};
  text-align: right;
  max-width: 60%;
  word-wrap: break-word;
`;

const ArrayValue = styled.div`
  text-align: right;
  max-width: 60%;
`;

const Tag = styled.span`
  display: inline-block;
  background: ${colors.primary}20;
  color: ${colors.primary};
  padding: 0.25rem 0.5rem;
  margin: 0.125rem;
  border-radius: 12px;
  font-size: 0.875rem;
`;

interface ProfileDisplayProps {
  onClose?: () => void;
  userName?: string;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ onClose, userName }) => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<StudentProfileResponse | TeacherProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      try {
        const { onboardingAPI } = await import('../../services/api');
        
        // Use getOnboardingStatus which will return profile data if completed
        const result = await onboardingAPI.getOnboardingStatus();
        
        if (result.success && result.data && result.data.data) {
          const statusData = result.data.data;
          
          // Check if onboarding is completed and has profile data
          if (statusData.completed && statusData.profile) {
            setProfileData(statusData.profile);
          } else {
            setError('Onboarding not completed or no profile data available');
          }
        } else {
          setError(result.error || 'Failed to fetch profile data');
        }
      } catch (err) {
        setError('Failed to fetch profile data');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const renderArrayValue = (value: string | string[]) => {
    if (Array.isArray(value)) {
      return (
        <ArrayValue>
          {value.map((item, index) => (
            <Tag key={index}>{item}</Tag>
          ))}
        </ArrayValue>
      );
    }
    return <Value>{value}</Value>;
  };
  const renderUserProfile = () => {
    if (loading) {
      return <Text>Loading profile...</Text>;
    }    if (error) {
      return <Text style={{ color: colors.error }}>Error: {error}</Text>;
    }

    if (!profileData) {
      return <Text>No profile data available</Text>;
    }

    return (
      <div>
        <SectionTitle>👤 Personal Information</SectionTitle>
        <InfoItem>
          <Label>Name:</Label>
          <Value>{profileData.name || userName || user?.name}</Value>
        </InfoItem>
        <InfoItem>
          <Label>User Type:</Label>
          <Value>{user?.user_type === 'student' ? '🎓 Student' : '👨‍🏫 Teacher'}</Value>
        </InfoItem>

        {user?.user_type === 'student' && (
          <>
            <SectionTitle>📚 Academic Information</SectionTitle>
            {profileData.country && (
              <InfoItem>
                <Label>Country:</Label>
                <Value>{profileData.country}</Value>
              </InfoItem>
            )}
            {(profileData as StudentProfileResponse).grade && (
              <InfoItem>
                <Label>Grade:</Label>
                <Value>{(profileData as StudentProfileResponse).grade}</Value>
              </InfoItem>
            )}
            {profileData.selected_curriculum && (
              <InfoItem>
                <Label>Curriculum:</Label>
                <Value>{profileData.selected_curriculum}</Value>
              </InfoItem>
            )}
            {profileData.selected_subjects && profileData.selected_subjects.length > 0 && (
              <InfoItem>
                <Label>Subjects:</Label>
                {renderArrayValue(profileData.selected_subjects)}
              </InfoItem>
            )}

            <SectionTitle>🎯 Learning Preferences</SectionTitle>
            {(profileData as StudentProfileResponse).selected_learning_interests && 
             (profileData as StudentProfileResponse).selected_learning_interests!.length > 0 && (
              <InfoItem>
                <Label>Learning Interests:</Label>
                {renderArrayValue((profileData as StudentProfileResponse).selected_learning_interests!)}
              </InfoItem>
            )}
            {(profileData as StudentProfileResponse).selected_learning_styles && 
             (profileData as StudentProfileResponse).selected_learning_styles!.length > 0 && (
              <InfoItem>
                <Label>Learning Styles:</Label>
                {renderArrayValue((profileData as StudentProfileResponse).selected_learning_styles!)}
              </InfoItem>
            )}
            {(profileData as StudentProfileResponse).selected_help_preferences && 
             (profileData as StudentProfileResponse).selected_help_preferences!.length > 0 && (
              <InfoItem>
                <Label>Help Preferences:</Label>
                {renderArrayValue((profileData as StudentProfileResponse).selected_help_preferences!)}
              </InfoItem>
            )}
            {(profileData as StudentProfileResponse).selected_learning_goals && 
             (profileData as StudentProfileResponse).selected_learning_goals!.length > 0 && (
              <InfoItem>
                <Label>Learning Goals:</Label>
                {renderArrayValue((profileData as StudentProfileResponse).selected_learning_goals!)}
              </InfoItem>
            )}
          </>
        )}

        {user?.user_type === 'teacher' && (
          <>
            <SectionTitle>🏫 Teaching Information</SectionTitle>
            {profileData.country && (
              <InfoItem>
                <Label>Country:</Label>
                <Value>{profileData.country}</Value>
              </InfoItem>
            )}
            {(profileData as TeacherProfileResponse).selected_grade_levels && (
              <InfoItem>
                <Label>Grade Levels:</Label>
                <Value>{(profileData as TeacherProfileResponse).selected_grade_levels}</Value>
              </InfoItem>
            )}
            {profileData.selected_curriculum && (
              <InfoItem>
                <Label>Curriculum:</Label>
                <Value>{profileData.selected_curriculum}</Value>
              </InfoItem>
            )}
            {profileData.selected_subjects && profileData.selected_subjects.length > 0 && (
              <InfoItem>
                <Label>Subjects:</Label>
                {renderArrayValue(profileData.selected_subjects)}
              </InfoItem>
            )}

            <SectionTitle>🎯 Teaching Preferences</SectionTitle>
            {(profileData as TeacherProfileResponse).selected_teaching_goals && 
             (profileData as TeacherProfileResponse).selected_teaching_goals!.length > 0 && (
              <InfoItem>
                <Label>Teaching Goals:</Label>
                {renderArrayValue((profileData as TeacherProfileResponse).selected_teaching_goals!)}
              </InfoItem>
            )}
            {(profileData as TeacherProfileResponse).selected_tech_comfort && (
              <InfoItem>
                <Label>Tech Comfort Level:</Label>
                <Value>{(profileData as TeacherProfileResponse).selected_tech_comfort}</Value>
              </InfoItem>
            )}
            {(profileData as TeacherProfileResponse).selected_lesson_plan && (
              <InfoItem>
                <Label>Lesson Plan Preference:</Label>
                <Value>{(profileData as TeacherProfileResponse).selected_lesson_plan}</Value>
              </InfoItem>
            )}
            {(profileData as TeacherProfileResponse).selected_device_access && (
              <InfoItem>
                <Label>Student Device Access:</Label>
                <Value>{(profileData as TeacherProfileResponse).selected_device_access}</Value>
              </InfoItem>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <ProfileCard $elevated>
      <Flex $justify="space-between" $align="center" style={{ marginBottom: '1.5rem' }}>
        <Title>Your Profile</Title>
        {onClose && (
          <Button $variant="secondary" onClick={onClose}>
            ✕ Close
          </Button>
        )}
      </Flex>
      
      <Text $color="light" style={{ marginBottom: '2rem' }}>
        Here's a summary of your onboarding responses and preferences.
      </Text>

      {renderUserProfile()}
    </ProfileCard>
  );
};

export default ProfileDisplay;
