/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { PhoneFrame } from './components/phone/PhoneFrame';
import { BottomTabBar } from './components/common/BottomTabBar';
import { HomeScreen } from './screens/HomeScreen';
import { PlayScreen } from './screens/PlayScreen';
import { ResultScreen } from './screens/ResultScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AdminOverviewScreen } from './screens/admin/AdminOverviewScreen';
import { AdminUsersScreen } from './screens/admin/AdminUsersScreen';
import { AdminScoresScreen } from './screens/admin/AdminScoresScreen';
import { AdminFlagsScreen } from './screens/admin/AdminFlagsScreen';
import { AdminPrizesScreen } from './screens/admin/AdminPrizesScreen';
import { ShareScoreModal } from './components/common/ShareScoreModal';
import { UserProfileSheet } from './components/common/UserProfileSheet';

export default function App() {
  const {
    hasCompletedOnboarding,
    activeTab,
    role,
    settings,
    setLanguage,
    setTheme,
    shareModalAttempt,
    setShareModalAttempt,
    selectedUserPreview,
    setSelectedUserPreview
  } = useAppStore();

  // Initialize language & theme on mount
  useEffect(() => {
    setLanguage(settings.language);
    setTheme(settings.theme);
  }, []);

  // Determine if BottomTabBar should be hidden (during active gameplay or result card)
  const isPlaying = activeTab === 'play' || activeTab === 'result';

  const renderActiveScreen = () => {
    if (!hasCompletedOnboarding) {
      return <OnboardingScreen />;
    }

    if (role === 'admin') {
      switch (activeTab) {
        case 'admin_users':
          return <AdminUsersScreen />;
        case 'admin_scores':
          return <AdminScoresScreen />;
        case 'admin_flags':
          return <AdminFlagsScreen />;
        case 'admin_prizes':
          return <AdminPrizesScreen />;
        case 'admin_overview':
        default:
          return <AdminOverviewScreen />;
      }
    }

    switch (activeTab) {
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'play':
        return <PlayScreen />;
      case 'result':
        return <ResultScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'home':
      default:
        return <HomeScreen />;
    }
  };

  return (
    <PhoneFrame>
      <div className="w-full h-full relative overflow-hidden flex flex-col">
        {renderActiveScreen()}

        {/* Floating bottom tab bar (only on main screens) */}
        {hasCompletedOnboarding && !isPlaying && <BottomTabBar />}

        {/* Global Modal: Scorecard Share */}
        {shareModalAttempt && (
          <ShareScoreModal
            attempt={shareModalAttempt}
            onClose={() => setShareModalAttempt(null)}
          />
        )}

        {/* Global Sheet: Opponent Profile Preview */}
        {selectedUserPreview && (
          <UserProfileSheet
            user={selectedUserPreview}
            onClose={() => setSelectedUserPreview(null)}
          />
        )}
      </div>
    </PhoneFrame>
  );
}
