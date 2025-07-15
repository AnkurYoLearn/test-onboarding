import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styled from "styled-components";
import { useOnboarding } from "../../context/OnboardingContext";
import { ChatMessage } from "../../types";
import { generateId } from "../../utils/helpers";
import {
  Input,
  OptionButton,
  OptionsContainer,
} from "../styled/StyledComponents";
import ProgressBar from "./ProgressBar";

// Full-screen carousel styled components
const FullScreenWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  width: 100%;
`;

const HeaderBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  padding-top: 0;
  text-align: center;
  gap: 1rem;
`;

const FooterBar = styled.footer`
  position: fixed;
  bottom: 0px;
  right: 0px;
  padding: 1rem 2rem;
  display: flex;
  justify-content: flex-end;
`;

const ChatBot: React.FC = () => {
  const {
    currentStep,
    studentData,
    teacherData,
    updateStudentData,
    updateTeacherData,
    nextStep,
    setLoading,
    setUserType,
    prevStep,
  } = useOnboarding();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [inputType, setInputType] = useState<"text" | "select" | "multiselect">(
    "text"
  );
  const [showOthersInput, setShowOthersInput] = useState(false);
  const [othersText, setOthersText] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [currentUserType, setCurrentUserType] = useState<
    "student" | "teacher" | null
  >(null);
  const navigate = useNavigate();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  useEffect(
    () => {
      // Always set currentUserType from URL params if present
      const urlParams = new URLSearchParams(window.location.search);
      const userTypeParam = urlParams.get("user_type");
      if (userTypeParam === "student" || userTypeParam === "teacher") {
        setCurrentUserType(userTypeParam);
      } else {
        const storedType = localStorage.getItem("userType");
        if (storedType === "student" || storedType === "teacher") {
          setCurrentUserType(storedType);
        }
      }
      if (!isInitializedRef.current && messages.length === 0) {
        initializeOnboarding();
        isInitializedRef.current = true;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      /* no dependency on currentUserType here */
    ]
  );

  // NEW: When currentUserType changes, set onboarding context userType (which sets currentStep=1)
  useEffect(() => {
    if (currentUserType) {
      setUserType(currentUserType);
    }
  }, [currentUserType, setUserType]);

  const initializeOnboarding = async () => {
    // Check for URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("user_id");
    const userTypeParam = urlParams.get("user_type");

    if (
      userId &&
      userTypeParam &&
      (userTypeParam === "student" || userTypeParam === "teacher")
    ) {
      // Start onboarding with URL parameters
      await startOnboardingFromParams(userId, userTypeParam);
    } else {
      // No URL parameters, prompt for manual entry
      addMessage(
        "Welcome to YoLearn! Please provide your user ID and select your type to continue with onboarding.",
        "question"
      );
      setInputType("text");
    }
  };

  const startOnboardingFromParams = async (
    userId: string,
    userTypeParam: "student" | "teacher"
  ) => {
    try {
      setLoading(true);
      const { authAPI } = await import("../../services/api");

      const result = await authAPI.startOnboarding(userId, userTypeParam);

      if (result.success && result.data) {
        const { user_id, user_type } = result.data;

        // Store basic user info in localStorage (no tokens needed for onboarding)
        localStorage.setItem("userId", user_id);
        localStorage.setItem("userType", user_type);

        setCurrentUserType(userTypeParam);

        // Check if user has completed onboarding by calling status API
        await checkOnboardingStatusAndInitialize(user_id, user_type);
      } else {
        addMessage(`Failed to start onboarding: ${result.error}`, "question");
      }
    } catch (error) {
      console.error("Error starting onboarding:", error);
      addMessage(
        "Sorry, there was an error starting your onboarding. Please try again.",
        "question"
      );
    } finally {
      setLoading(false);
    }
  };

  const checkOnboardingStatusAndInitialize = async (
    userId: string,
    userType: string
  ) => {
    try {
      console.log("🔍 Checking onboarding status for:", { userId, userType });
      const { onboardingAPI } = await import("../../services/api");
      const statusResult = await onboardingAPI.getOnboardingStatus();

      console.log("📊 Status result:", statusResult);

      if (statusResult.success && statusResult.data?.data) {
        const { completed, has_data, profile } = statusResult.data.data;
        console.log("📋 Status data:", { completed, has_data, profile });

        if (completed && profile) {
          // User has completed onboarding
          setShowProfile(true);
          addMessage(
            `Welcome back! Your ${userType} profile is complete.`,
            "question"
          );
        } else if (has_data) {
          // User has partial data
          addMessage(
            `Welcome back! Let's continue your ${userType} onboarding.`,
            "question"
          );
          await initializeChat();
        } else {
          // Fresh start
          console.log("🆕 Starting fresh onboarding flow");
          addMessage(`My name is...`, "question");
          setInputType("text");
        }
      } else {
        // Fresh start - no existing data
        console.log("🆕 No existing data, starting fresh onboarding flow");
        addMessage(`My name is...`, "question");
        setInputType("text");
      }
    } catch (error) {
      console.error("❌ Error checking onboarding status:", error);
      // Fallback to fresh start
      console.log("🆕 Fallback: starting fresh onboarding flow");
      addMessage(
        `Hello! Welcome to YoLearn ${userType} onboarding. What should I call you?`,
        "question"
      );
      setInputType("text");
    }
  };

  // Ensure currentUserType is set from props or localStorage on mount
  useEffect(() => {
    if (!currentUserType) {
      // Try to get from localStorage if not set
      const storedType = localStorage.getItem("userType");
      if (storedType === "student" || storedType === "teacher") {
        setCurrentUserType(storedType);
      }
    }
  }, [currentUserType]);

  useEffect(() => {
    scrollToMessagesBottom();
  }, [messages]);

  const scrollToMessagesBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (
      inputType === "select" &&
      selectedOptions.length === 1 &&
      !selectedOptions.includes("Others (please specify)")
    ) {
      setWaitingForResponse(true);
      const timer = setTimeout(() => {
        handleNext();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [selectedOptions, inputType, setWaitingForResponse]);

  const checkExistingOnboarding = async () => {
    try {
      const { onboardingAPI } = await import("../../services/api");
      const statusResult = await onboardingAPI.getOnboardingStatus();

      if (statusResult.success && statusResult.data?.data) {
        const { completed, profile } = statusResult.data.data;

        if (completed && profile) {
          // User has completed onboarding, show profile
          setShowProfile(true);
          addMessage(`Welcome back! Here's your profile:`, "question");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking existing onboarding:", error);
      return false;
    }
  };

  const saveCompleteOnboarding = async (data: any) => {
    try {
      const { onboardingAPI } = await import("../../services/api");
      const result = await onboardingAPI.saveComplete({
        ...data,
        completed: true,
      });

      if (result.success) {
        console.log("Complete onboarding data saved successfully");
        window.location.href = `https://app.yolearn.ai/${currentUserType}`;
        return result;
      } else {
        console.error("Error saving complete onboarding:", result.error);
        return result;
      }
    } catch (error) {
      console.error("Error saving complete onboarding:", error);
      return { success: false, error: "Failed to save onboarding data" };
    }
  };

  const addMessage = (
    content: string,
    type: ChatMessage["type"] = "question",
    options?: string[]
  ) => {
    const message: ChatMessage = {
      id: generateId(),
      type,
      content,
      options: options ? [...options, "Others (please specify)"] : undefined,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
  };
  const initializeChat = async () => {
    // First check if user has already completed onboarding
    const hasCompletedOnboarding = await checkExistingOnboarding();

    if (!hasCompletedOnboarding) {
      // Start new onboarding process
      addMessage(
        "Hello! Welcome to YoLearn. What should I call you?",
        "question"
      );
      setInputType("text");
    }
  };

  const handleNext = async () => {
    if (waitingForResponse) return;
    let response = "";

    // Add user's response to chat
    if (inputType === "text" && currentInput.trim()) {
      addMessage(currentInput, "answer");
      response = currentInput.trim();
    } else if (
      (inputType === "select" || inputType === "multiselect") &&
      selectedOptions.length > 0
    ) {
      let finalOptions = [...selectedOptions];
      if (
        selectedOptions.includes("Others (please specify)") &&
        othersText.trim()
      ) {
        finalOptions = finalOptions.filter(
          (o) => o !== "Others (please specify)"
        );
        finalOptions.push(othersText.trim());
      }
      const responseText = finalOptions.join(", ");
      addMessage(responseText, "answer");
      response = responseText;
    }

    if (!response) return;
    setWaitingForResponse(true);
    setLoading(true);
    try {
      if (!currentUserType) {
        addMessage(
          "Please start onboarding with valid user credentials first.",
          "question"
        );
        setWaitingForResponse(false);
        setLoading(false);
        return;
      }
      // Fix: After name, go to country as step 1
      if (!userName) {
        setUserName(response);
        // Do NOT call nextStep() here, let country be handled as step 1
        setWaitingForResponse(false);
        setLoading(false);
        // Instead, prompt for country and wait for input
        addMessage(
          `Nice to meet you, ${response}! Which country are you ${
            currentUserType === "student" ? "studying" : "teaching"
          } in?`,
          "question"
        );
        setInputType("text");
        setCurrentInput("");
        return;
      }
      if (currentUserType === "student") {
        await handleStudentStep(response);
      } else {
        await handleTeacherStep(response);
      }
    } catch (error) {
      console.error("Error processing step:", error);
      addMessage("I encountered an error. Please try again.", "question");
    } finally {
      setWaitingForResponse(false);
      setLoading(false);
      setCurrentInput("");
      setSelectedOptions([]);
      setShowOthersInput(false);
      setOthersText("");
    }
  };

  // In handleStudentStep, treat step 1 as country, step 2 as curriculum, etc.
  const handleStudentStep = async (response: string) => {
    // If userName is set, but currentStep is 1, this is the country step
    console.log("🎓 Student step:", currentStep, "Response:", response);
    const { studentAPI } = await import("../../services/api");
    toast.loading("Saving your response...", { id: "status" });
    console.log("toast fired");
    switch (currentStep) {
      case 1: // Country
        updateStudentData({ country: response });
        addMessage("Loading curriculum options...", "loading");
        try {
          const curricula = await studentAPI.getCurricula({
            country: response,
          });
          toast.success("Saved.", { id: "status" });
          addMessage(
            "Which curriculum are you following?",
            "question",
            curricula.options
          );
          setInputType("select");
        } catch (error) {
          addMessage(
            "I couldn't fetch curriculum options. Please try again.",
            "question"
          );
        }
        nextStep();
        break;
      case 2: // Curriculum
        updateStudentData({ selected_curriculum: response });
        addMessage("Loading grade options...", "loading");
        try {
          const grades = await studentAPI.getGradesByCurriculum({
            curriculum: response,
          });
          toast.success("Saved.", { id: "status" });
          addMessage("What grade are you in?", "question", grades.options);
          setInputType("select");
        } catch (error) {
          addMessage(
            "I couldn't fetch grade options. Please try again.",
            "question"
          );
        }
        nextStep();
        break;
      case 3: // Grade
        updateStudentData({ grade: response });
        addMessage("Loading subjects for your curriculum...", "loading");
        try {
          const subjects = await studentAPI.getSubjects({
            country: studentData.country || "",
            curriculum: studentData.selected_curriculum || "",
            grade: response,
          });
          toast.success("Saved.", { id: "status" });
          addMessage(
            "Which subjects are you studying? (You can select multiple)",
            "question",
            subjects.options
          );
          setInputType("multiselect");
        } catch (error) {
          addMessage(
            "I couldn't fetch subjects. Please try again.",
            "question"
          );
        }
        nextStep();
        break;
      case 4: // Subjects
        const subjects = response.includes(",")
          ? response.split(", ")
          : [response];
        updateStudentData({ selected_subjects: subjects });
        addMessage("Getting learning interests for you...", "loading");
        try {
          const interests = await studentAPI.getLearningInterests({
            grade: studentData.grade || "",
            country: studentData.country || "",
            curriculum: studentData.selected_curriculum || "",
            subjects: subjects,
          });
          toast.success("Saved.", { id: "status" });
          addMessage(
            "What are your learning interests? (Select multiple if you like)",
            "question",
            interests.options
          );
          setInputType("multiselect");
        } catch (error) {
          addMessage(
            "I couldn't fetch learning interests. Please try again.",
            "question"
          );
        }
        nextStep();
        break;
      case 5: // Learning Interests
        const interests = response.includes(",")
          ? response.split(", ")
          : [response];
        updateStudentData({ selected_learning_interests: interests });
        addMessage("Finding learning styles that suit you...", "loading");
        try {
          const styles = await studentAPI.getLearningStyles({
            grade: studentData.grade || "",
            curriculum: studentData.selected_curriculum || "",
            country: studentData.country || "",
            subjects: studentData.selected_subjects || [],
          });
          toast.success("Saved.", { id: "status" });
          addMessage(
            "What's your preferred learning style?",
            "question",
            styles.options
          );
          setInputType("select");
        } catch (error) {
          addMessage(
            "I couldn't fetch learning styles. Please try again.",
            "question"
          );
        }
        nextStep();
        break;
      case 6: // Learning Styles
        updateStudentData({ selected_learning_styles: [response] });
        addMessage("Getting help preference options...", "loading");
        try {
          const helpPrefs = await studentAPI.getHelpPreferences({
            grade: studentData.grade || "",
            curriculum: studentData.selected_curriculum || "",
            country: studentData.country || "",
            subjects: studentData.selected_subjects || [],
          });
          toast.success("Saved.", { id: "status" });
          addMessage(
            "How do you prefer to get help when you're stuck?",
            "question",
            helpPrefs.options
          );
          setInputType("select");
        } catch (error) {
          addMessage(
            "I couldn't fetch help preferences. Please try again.",
            "question"
          );
        }
        nextStep();
        break;
      case 7: // Help Preferences
        updateStudentData({ selected_help_preferences: [response] });
        addMessage("Almost done! Getting learning goals...", "loading");
        try {
          const goals = await studentAPI.getLearningGoals({
            grade: studentData.grade || "",
            curriculum: studentData.selected_curriculum || "",
            country: studentData.country || "",
            subjects: studentData.selected_subjects || [],
          });
          toast.success("Saved.", { id: "status" });
          addMessage(
            "What are your main learning goals? (Select multiple)",
            "question",
            goals.options
          );
          setInputType("multiselect");
        } catch (error) {
          addMessage(
            "I couldn't fetch learning goals. Please try again.",
            "question"
          );
        }
        nextStep();
        break;
      case 8: // Learning Goals
        const goals = response.includes(",")
          ? response.split(", ")
          : [response];
        updateStudentData({ selected_learning_goals: goals });
        try {
          const completeData = {
            name: userName,
            ...studentData,
            selected_learning_goals: goals,
            completed: true,
          };
          const saveResult = await saveCompleteOnboarding(completeData);
          if (saveResult.success) {
            toast.success("Saved.", { id: "status" });
            addMessage(
              "🎉 Fantastic! Your student profile is complete and saved. Here's your personalized learning profile:",
              "question"
            );
          } else {
            toast.error("Cannot save.", { id: "status" });
            addMessage(
              "🎉 Fantastic! Your student profile is complete. Here's your personalized learning profile:",
              "question"
            );
            console.error(
              "Failed to save complete onboarding:",
              saveResult.error
            );
          }
        } catch (error) {
          console.error("Error completing onboarding:", error);
          addMessage(
            "🎉 Fantastic! Your student profile is complete. Here's your personalized learning profile:",
            "question"
          );
        }
        toast.dismiss();
        setShowProfile(true);
        setInputType("text");
        nextStep();
        break;
      default:
        break;
    }
  };

  const handleTeacherStep = async (response: string) => {
    console.log("👩‍🏫 Teacher step:", currentStep, "Response:", response);
    toast.loading("Saving your response...", { id: "status" });
    const { teacherAPI } = await import("../../services/api");
    switch (currentStep) {
      case 1: // Country (start with country, not name)
        console.log("📍 Processing teacher country step:", response);
        updateTeacherData({ country: response });
        addMessage("Loading curriculum options...", "loading");
        try {
          console.log("🔄 Calling teacherAPI.getCurricula with:", {
            country: response,
            grade_levels: "",
          });
          const curricula = await teacherAPI.getCurricula({
            country: response,
            grade_levels: "",
          });
          toast.success("Saved.", { id: "status" });
          console.log("📚 Received teacher curricula:", curricula);
          addMessage(
            "Which curriculum do you follow?",
            "question",
            curricula.options
          );
          setInputType("select");
        } catch (error) {
          toast.error("Cannot save.", { id: "status" });
          console.error("❌ Error fetching teacher curricula:", error);
          addMessage(
            "I couldn't fetch curricula. Please try again.",
            "question"
          );
        }
        nextStep();
        break;
      case 2: // Curriculum
        updateTeacherData({ selected_curriculum: response });
        addMessage("Loading grade level options...", "loading");
        try {
          const gradeLevels = await teacherAPI.getGradeLevels({
            country: teacherData.country || "",
          });
          toast.success("Saved.", { id: "status" });
          addMessage(
            "Which grade levels do you teach?",
            "question",
            gradeLevels.options
          );
          setInputType("select");
        } catch (error) {
          addMessage(
            "I couldn't fetch grade levels. Please try again.",
            "question"
          );
        }
        nextStep();
        break;
      case 3: // Grade Levels
        updateTeacherData({ selected_grade_levels: response });
        addMessage("Getting subject options...", "loading");
        try {
          const subjects = await teacherAPI.getSubjects({
            country: teacherData.country || "",
            curriculum: teacherData.selected_curriculum || "",
            grade_levels: response,
          });
          toast.success("Saved.", { id: "status" });
          addMessage(
            "Which subjects do you teach? (Select multiple)",
            "question",
            subjects.options
          );
          setInputType("multiselect");
        } catch (error) {
          addMessage(
            "I couldn't fetch subjects. Please try again.",
            "question"
          );
        }
        nextStep();
        break;
      case 4: // Subjects
        const teacherSubjects = response.includes(",")
          ? response.split(", ")
          : [response];
        updateTeacherData({ selected_subjects: teacherSubjects });
        addMessage("Loading teaching goals...", "loading");
        try {
          const goals = await teacherAPI.getTeachingGoals({
            country: teacherData.country || "",
            curriculum: teacherData.selected_curriculum || "",
            grade_levels: teacherData.selected_grade_levels || "",
            subjects: teacherSubjects,
          });
          toast.success("Saved.", { id: "status" });
          addMessage(
            "What are your main teaching goals? (Select multiple)",
            "question",
            goals.options
          );
          setInputType("multiselect");
        } catch (error) {
          addMessage(
            "I couldn't fetch teaching goals. Please try again.",
            "question"
          );
        }
        nextStep();
        break;
      case 5: // Teaching Goals
        const teachingGoals = response.includes(",")
          ? response.split(", ")
          : [response];
        updateTeacherData({ selected_teaching_goals: teachingGoals });
        toast.success("Saved.", { id: "status" });
        addMessage("Getting tech comfort options...", "loading");
        try {
          const techComfort = await teacherAPI.getTechComfort({
            country: teacherData.country || "",
            grade_levels: teacherData.selected_grade_levels || "",
          });
          toast.success("Saved.", { id: "status" });
          addMessage(
            "How comfortable are you with technology?",
            "question",
            techComfort.options
          );
          setInputType("select");
        } catch (error) {
          addMessage(
            "I couldn't fetch tech comfort options. Please try again.",
            "question"
          );
        }
        nextStep();
        break;
      case 6: // Tech Comfort
        updateTeacherData({ selected_tech_comfort: response });
        addMessage("Loading lesson plan preferences...", "loading");
        try {
          const lessonPlans = await teacherAPI.getLessonPlanPreferences({
            country: teacherData.country || "",
            curriculum: teacherData.selected_curriculum || "",
            subjects: teacherData.selected_subjects || [],
            tech_comfort: response,
          });
          toast.success("Saved.", { id: "status" });
          addMessage(
            "What are your lesson plan preferences?",
            "question",
            lessonPlans.options
          );
          setInputType("select");
        } catch (error) {
          addMessage(
            "I couldn't fetch lesson plan preferences. Please try again.",
            "question"
          );
        }
        nextStep();
        break;
      case 7: // Lesson Plan Preferences
        updateTeacherData({ selected_lesson_plan: response });
        addMessage("Getting device access options...", "loading");
        try {
          const deviceAccess = await teacherAPI.getDeviceAccess({
            country: teacherData.country || "",
            grade_levels: teacherData.selected_grade_levels || "",
          });
          toast.success("Saved.", { id: "status" });
          addMessage(
            "What kind of device access do your students have?",
            "question",
            deviceAccess.options
          );
          setInputType("select");
        } catch (error) {
          addMessage(
            "I couldn't fetch device access options. Please try again.",
            "question"
          );
        }
        nextStep();
        break;
      case 8: // Device Access
        updateTeacherData({ selected_device_access: response });
        // Prepare teacher data for saving (match backend test script)
        try {
          // Ensure correct types for backend
          const selected_subjects = Array.isArray(teacherData.selected_subjects)
            ? teacherData.selected_subjects
            : typeof teacherData.selected_subjects === "string" &&
              teacherData.selected_subjects
            ? (teacherData.selected_subjects as string)
                .split(",")
                .map((s: string) => s.trim())
            : [];
          const selected_teaching_goals = Array.isArray(
            teacherData.selected_teaching_goals
          )
            ? teacherData.selected_teaching_goals
            : typeof teacherData.selected_teaching_goals === "string" &&
              teacherData.selected_teaching_goals
            ? (teacherData.selected_teaching_goals as string)
                .split(",")
                .map((s: string) => s.trim())
            : [];
          // Use comma (no space) for backend compatibility
          const selected_grade_levels = Array.isArray(
            teacherData.selected_grade_levels
          )
            ? teacherData.selected_grade_levels.join(",")
            : typeof teacherData.selected_grade_levels === "string"
            ? teacherData.selected_grade_levels
            : "";
          const selected_device_access = Array.isArray(
            teacherData.selected_device_access
          )
            ? teacherData.selected_device_access.join(",")
            : teacherData.selected_device_access || response || "";

          const completeData = {
            user_id: localStorage.getItem("userId"),
            user_type: "teacher",
            name: userName,
            country: teacherData.country,
            selected_grade_levels,
            selected_curriculum: teacherData.selected_curriculum,
            selected_subjects,
            selected_teaching_goals,
            selected_tech_comfort: teacherData.selected_tech_comfort,
            selected_lesson_plan: teacherData.selected_lesson_plan,
            selected_device_access,
            completed: true,
          };
          toast.success("Saved.", { id: "status" });
          console.log("Teacher save payload:", completeData);
          const saveResult = await saveCompleteOnboarding(completeData);
          if (saveResult.success) {
            addMessage(
              "🎉 Perfect! Your teacher profile is complete and saved. Here's your personalized teaching profile:",
              "question"
            );
          } else {
            addMessage(
              "🎉 Perfect! Your teacher profile is complete. Here's your personalized teaching profile:",
              "question"
            );
            console.error(
              "Failed to save complete onboarding:",
              saveResult.error
            );
          }
        } catch (error) {
          console.error("Error saving complete onboarding:", error);
          addMessage(
            "🎉 Perfect! Your teacher profile is complete. Here's your personalized teaching profile:",
            "question"
          );
        }

        toast.dismiss();
        setShowProfile(true);
        setInputType("text");
        nextStep();
        break;
    }
  };
  const handleOptionSelect = (option: string) => {
    if (option === "Others (please specify)") {
      setShowOthersInput(true);
      if (inputType === "multiselect") {
        setSelectedOptions((prev) =>
          prev.includes(option)
            ? prev.filter((o) => o !== option)
            : [...prev.filter((o) => o !== option), option]
        );
      } else {
        setSelectedOptions([option]);
      }
    } else {
      setShowOthersInput(false);
      setOthersText("");
      if (inputType === "multiselect") {
        setSelectedOptions((prev) => {
          const filtered = prev.filter((o) => o !== "Others (please specify)");
          if (filtered.includes(option)) {
            return filtered.filter((o) => o !== option);
          } else {
            return [...filtered, option];
          }
        });
      } else {
        if (selectedOptions.includes(option)) return;
        if (selectedOptions[0] === option) return;
        setSelectedOptions([option]);
      }
    }
  };

  const handleCountryInputChange = (value: string) => {
    setCurrentInput(value);
    if (value.length > 0) {
      const filtered = countries.filter((c) =>
        c.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCountries(filtered);
      setShowCountryDropdown(true);
    } else {
      setFilteredCountries([]);
      setShowCountryDropdown(false);
    }
  };

  const handleCountrySelect = (country: string) => {
    setCurrentInput(country);
    setShowCountryDropdown(false);
  };

  const canProceed = () => {
    if (inputType === "text") {
      return currentInput.trim().length > 0;
    } else {
      const hasSelection = selectedOptions.length > 0;
      const needsOthersText =
        selectedOptions.includes("Others (please specify)") &&
        !othersText.trim();
      return hasSelection && !needsOthersText;
    }
  };

  // Show 9 steps for students, 9 for teachers
  const totalStepsForUser = 9;
  const stepOffset = userName ? 0 : 0;
  const progress = ((currentStep + stepOffset) / totalStepsForUser) * 100;

  // ---------------- Full-Screen Carousel UI ----------------
  const currentQuestionMessage = messages
    .filter((m) => m.type === "question")
    .slice(-1)[0];

  if (!showProfile && currentQuestionMessage) {
    return (
      <FullScreenWrapper>
        <HeaderBar>
          <div style={{ fontWeight: 700, fontSize: "1.25rem" }}>
            <img
              src={"/logo.png"}
              style={{
                width: "150px",
              }}
            />
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#717171",
              padding: "0.5rem",
            }}
          >
            Site language: English ▾
          </div>
        </HeaderBar>

        {currentStep >= 2 && currentStep <= 8 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 2rem",
              gap: "8px",
              marginBlock: "1rem",
            }}
          >
            <button
              onClick={prevStep}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <ArrowLeft size={22} color="rgba(128, 128, 128, 0.55)" />
            </button>
            <ProgressBar currentStep={currentStep - 1} totalSteps={7} />
          </div>
        )}

        <MainContent style={{ paddingTop: "2rem" }}>
          {/* <Title style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600, color: "#000" }} className='font-inter'>{currentQuestionMessage.content}</Title> */}

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              transform: "translate(-17%, 0%)",
            }}
          >
            <div
              style={{
                display: "flex",
              }}
            >
              <img
                src={"/yo.png"}
                style={{
                  width: "120px",
                  transform: "scaleX(-100%)",
                }}
              />
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 500,
                }}
              >
                {currentQuestionMessage.content}
              </p>
            </div>
          </div>

          {inputType === "text" ? (
            <div
              style={{ width: "100%", maxWidth: "420px", position: "relative" }}
            >
              <Input
                value={currentInput}
                onChange={(e) => {
                  if (currentStep === 1 && userName) {
                    handleCountryInputChange(e.target.value);
                  } else {
                    setCurrentInput(e.target.value);
                  }
                }}
                placeholder={
                  currentStep === 1 && userName
                    ? "Type or select your country..."
                    : "Enter answer"
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter" && canProceed()) {
                    handleNext();
                  }
                }}
                disabled={waitingForResponse}
              />
              {currentStep === 1 &&
                userName &&
                showCountryDropdown &&
                filteredCountries.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "white",
                      border: "1px solid #e1e5e9",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      maxHeight: "160px",
                      overflowY: "auto",
                      zIndex: 1000,
                      marginTop: "4px",
                    }}
                  >
                    {filteredCountries.slice(0, 4).map((country, index) => (
                      <div
                        key={index}
                        style={{ padding: "12px 16px", cursor: "pointer" }}
                        onMouseDown={() => handleCountrySelect(country)}
                      >
                        {country}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ) : (
            <OptionsContainer style={{ width: "100%", maxWidth: "600px" }}>
              {currentQuestionMessage.options?.map((option, index) => (
                <OptionButton
                  key={index}
                  $selected={selectedOptions.includes(option)}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </OptionButton>
              ))}

              {showOthersInput && (
                <Input
                  value={othersText}
                  onChange={(e) => setOthersText(e.target.value)}
                  placeholder="Please specify..."
                  style={{ marginTop: "0.5rem" }}
                />
              )}
            </OptionsContainer>
          )}
        </MainContent>

        <FooterBar>
          <div
            style={{
              display: "flex",
            }}
          >
            <button
              style={{
                backgroundColor: "#fff",
                border: "1px solid #00000033",
                borderTopLeftRadius: "0.6rem",
                borderBottomLeftRadius: "0.6rem",
                padding: "0.1rem 0.3rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ChevronUp strokeWidth={2} size={18} />
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed() || waitingForResponse}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #00000033",
                borderTopRightRadius: "0.6rem",
                borderBottomRightRadius: "0.6rem",
                padding: "0.1rem 0.3rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ChevronDown strokeWidth={2} size={18} />
            </button>
          </div>
        </FooterBar>
      </FullScreenWrapper>
    );
  }

  return <div>Your data is saved successfully.</div>;
};

// Country list for autocomplete
const countries: string[] = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Kenya",
  "Nigeria",
  "South Africa",
  "Singapore",
  "Germany",
  "France",
  "Brazil",
  "China",
  "Japan",
  "Russia",
  "Mexico",
  "Italy",
  "Spain",
  "Turkey",
  "Indonesia",
  "Pakistan",
  "Bangladesh",
  "Philippines",
  "Vietnam",
  "Egypt",
  "Argentina",
  "Poland",
  "Netherlands",
  "Saudi Arabia",
  "Malaysia",
  "Thailand",
  "Sweden",
  "Switzerland",
  "Belgium",
  "Greece",
  "Portugal",
  "Czech Republic",
  "Hungary",
  "Romania",
  "Ukraine",
  "Chile",
  "Colombia",
  "Peru",
  "Venezuela",
  "Morocco",
  "Algeria",
  "Ethiopia",
  "Ghana",
  "Tanzania",
  "Uganda",
  "Sri Lanka",
  "Nepal",
  "New Zealand",
  "Ireland",
  "Denmark",
  "Finland",
  "Norway",
  "Austria",
  "Israel",
  "South Korea",
  "UAE",
  "Qatar",
  "Kuwait",
  "Oman",
  "Jordan",
  "Lebanon",
  "Iraq",
  "Iran",
  "Afghanistan",
  "Myanmar",
  "Cambodia",
  "Laos",
  "Mongolia",
  "Kazakhstan",
  "Uzbekistan",
  "Turkmenistan",
  "Georgia",
  "Armenia",
  "Azerbaijan",
  "Slovakia",
  "Slovenia",
  "Croatia",
  "Serbia",
  "Bulgaria",
  "Estonia",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Iceland",
  "Malta",
  "Cyprus",
  "Costa Rica",
  "Panama",
  "Uruguay",
  "Paraguay",
  "Bolivia",
  "Ecuador",
  "Guatemala",
  "Honduras",
  "El Salvador",
  "Nicaragua",
  "Jamaica",
  "Trinidad and Tobago",
  "Barbados",
  "Bahamas",
  "Fiji",
  "Papua New Guinea",
  "Zimbabwe",
  "Zambia",
  "Botswana",
  "Namibia",
  "Mozambique",
  "Angola",
  "Senegal",
  "Ivory Coast",
  "Cameroon",
  "Congo",
  "Sudan",
  "Libya",
  "Tunisia",
  "Syria",
  "Yemen",
  "Palestine",
  "North Korea",
];

export default ChatBot;
