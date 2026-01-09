import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LearnPage from './pages/LearnPage';
import LessonPage from './pages/LessonPage';
import SimulatorPage from './pages/SimulatorPage';
import ProfilePage from './pages/ProfilePage';
import BottomNav from './components/layout/BottomNav';
import TopBar from './components/layout/TopBar';
import AchievementModal from './components/modals/AchievementModal';
import useAchievements from './hooks/useAchievements';
import useStore from './store/useStore';

// Placeholder Page
const LeaderboardPage = () => <div className="pt-20 px-4"><h1>Leaderboard Coming Soon</h1></div>;

function AppContent() {
  const location = useLocation();
  const isLessonPage = location.pathname.startsWith('/lesson/');
  const isProfilePage = location.pathname === '/profile';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // Achievement system
  const { pendingAchievements } = useAchievements();
  const clearPendingAchievements = useStore(state => state.clearPendingAchievements);

  return (
    <div className="min-h-screen bg-off-white font-sans text-gray-900">
      {!isLessonPage && !isProfilePage && !isAuthPage && <TopBar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
        <Route path="/simulator" element={<ProtectedRoute><SimulatorPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/lesson/:levelId" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
      </Routes>

      {!isLessonPage && !isProfilePage && !isAuthPage && <BottomNav />}

      {/* Achievement Modal */}
      {pendingAchievements.length > 0 && (
        <AchievementModal
          achievement={pendingAchievements[0]}
          onClose={() => clearPendingAchievements()}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
