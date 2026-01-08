import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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

  // Achievement system
  const { pendingAchievements } = useAchievements();
  const clearPendingAchievements = useStore(state => state.clearPendingAchievements);

  return (
    <div className="min-h-screen bg-off-white font-sans text-gray-900">
      {!isLessonPage && !isProfilePage && <TopBar />}

      <Routes>
        <Route path="/" element={<LearnPage />} />
        <Route path="/simulator" element={<SimulatorPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/lesson/:levelId" element={<LessonPage />} />
      </Routes>

      {!isLessonPage && !isProfilePage && <BottomNav />}

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
      <AppContent />
    </BrowserRouter>
  );
}
