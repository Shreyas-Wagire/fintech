import { useEffect } from 'react';
import useStore from '../store/useStore';
import { ACHIEVEMENTS, checkAchievements } from '../data/achievements';

// React hook to check and unlock achievements
export default function useAchievements() {
    const { user, wallet, progress, achievements, unlockAchievement } = useStore();

    useEffect(() => {
        // Check for new achievements
        const newAchievements = checkAchievements(user, wallet, progress, achievements.unlocked);

        // Unlock each new achievement
        newAchievements.forEach(achievement => {
            unlockAchievement(achievement.id, achievement.reward);
        });
    }, [user.level, user.streak, wallet.balance, wallet.portfolio, wallet.loans.length, progress.completedLessons.length, wallet.transactions.length]);

    return {
        unlockedAchievements: achievements.unlocked,
        pendingAchievements: achievements.pending.map(id =>
            ACHIEVEMENTS.find(a => a.id === id)
        ).filter(Boolean),
        allAchievements: ACHIEVEMENTS
    };
}
