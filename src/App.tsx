import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import OnboardingPage from "./pages/OnboardingPage";

function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <Toaster position="bottom-left" />
        <Router>
          <div className="App">
            <Routes>
              {/* Main onboarding route - supports URL parameters */}
              <Route path="/" element={<OnboardingPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />

              {/* Fallback redirect to onboarding */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </OnboardingProvider>
    </AuthProvider>
  );
}

export default App;
