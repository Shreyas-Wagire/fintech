// Achievement definitions for gamification
export const ACHIEVEMENTS = [
    // Learning Milestones
    {
        id: 'first_lesson',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎓',
        condition: (user, wallet, progress) => progress.completedLessons.length >= 1,
        reward: { xp: 100, gems: 50 }
    },
    {
        id: 'lesson_master',
        title: 'Learning Champion',
        description: 'Complete 10 lessons',
        icon: '📚',
        condition: (user, wallet, progress) => progress.completedLessons.length >= 10,
        reward: { xp: 500, gems: 200, money: 1000 }
    },
    {
        id: 'perfect_score',
        title: 'Perfect Scholar',
        description: 'Get 100% accuracy in any lesson',
        icon: '🎯',
        condition: (user, wallet, progress) => progress.perfectLessons?.length >= 1,
        reward: { xp: 300, gems: 150 }
    },

    // Wallet Milestones
    {
        id: 'first_earning',
        title: 'Money Maker',
        description: 'Earn your first ₹200',
        icon: '💰',
        condition: (user, wallet, progress) => wallet.balance >= 200,
        reward: { xp: 50, gems: 25 }
    },
    {
        id: 'save_10k',
        title: 'Smart Saver',
        description: 'Save ₹10,000 in wallet',
        icon: '🏦',
        condition: (user, wallet, progress) => wallet.balance >= 10000,
        reward: { xp: 500, gems: 250 }
    },
    {
        id: 'millionaire',
        title: 'Millionaire',
        description: 'Reach ₹1,00,000 in wallet',
        icon: '💎',
        condition: (user, wallet, progress) => wallet.balance >= 100000,
        reward: { xp: 2000, gems: 1000, money: 5000 }
    },

    // Loan Management
    {
        id: 'first_loan',
        title: 'Borrower',
        description: 'Take your first loan',
        icon: '🏦',
        condition: (user, wallet, progress) => wallet.transactions.some(t => t.reason.includes('Loan')),
        reward: { xp: 100, gems: 50 }
    },
    {
        id: 'debt_free',
        title: 'Debt-Free Hero',
        description: 'Pay off all loans',
        icon: '✨',
        condition: (user, wallet, progress) => wallet.loans.length === 0 && wallet.transactions.some(t => t.reason.includes('Loan')),
        reward: { xp: 1000, gems: 500, money: 2000 }
    },

    // Trading Achievements
    {
        id: 'first_stock',
        title: 'Stock Trader',
        description: 'Buy your first stock',
        icon: '📈',
        condition: (user, wallet, progress) => Object.keys(wallet.portfolio).length >= 1,
        reward: { xp: 200, gems: 100 }
    },
    {
        id: 'portfolio_diversified',
        title: 'Portfolio Master',
        description: 'Own 5 different stocks',
        icon: '📊',
        condition: (user, wallet, progress) => Object.keys(wallet.portfolio).length >= 5,
        reward: { xp: 800, gems: 400, money: 1500 }
    },

    // Streak Achievements
    {
        id: 'streak_3',
        title: 'Consistency',
        description: 'Maintain a 3-day streak',
        icon: '🔥',
        condition: (user, wallet, progress) => user.streak >= 3,
        reward: { xp: 150, gems: 75, money: 300 }
    },
    {
        id: 'streak_7',
        title: 'Dedicated Learner',
        description: 'Maintain a 7-day streak',
        icon: '⚡',
        condition: (user, wallet, progress) => user.streak >= 7,
        reward: { xp: 500, gems: 250, money: 1000 }
    },
    {
        id: 'streak_30',
        title: 'Streak Legend',
        description: 'Maintain a 30-day streak',
        icon: '🏆',
        condition: (user, wallet, progress) => user.streak >= 30,
        reward: { xp: 3000, gems: 1500, money: 5000 }
    },

    // Level Achievements
    {
        id: 'level_5',
        title: 'Rising Star',
        description: 'Reach Level 5',
        icon: '⭐',
        condition: (user, wallet, progress) => user.level >= 5,
        reward: { xp: 300, gems: 150 }
    },
    {
        id: 'level_10',
        title: 'Expert',
        description: 'Reach Level 10',
        icon: '🌟',
        condition: (user, wallet, progress) => user.level >= 10,
        reward: { xp: 1000, gems: 500, money: 2000 }
    },

    // Simulation Achievements
    {
        id: 'budget_master',
        title: 'Budget Guru',
        description: 'Complete Budget Challenge with positive balance',
        icon: '💵',
        condition: (user, wallet, progress) => progress.simulationsCompleted?.includes('budget'),
        reward: { xp: 600, gems: 300, money: 1000 }
    },
    {
        id: 'tax_expert',
        title: 'Tax Master',
        description: 'Complete Tax Calculator',
        icon: '🧮',
        condition: (user, wallet, progress) => progress.simulationsCompleted?.includes('tax'),
        reward: { xp: 400, gems: 200 }
    },

    // Transaction Achievements
    {
        id: 'active_trader',
        title: 'Active Investor',
        description: 'Make 20 transactions',
        icon: '💸',
        condition: (user, wallet, progress) => wallet.transactions.length >= 20,
        reward: { xp: 400, gems: 200 }
    },

    // Special Achievements
    {
        id: 'all_units',
        title: 'Course Complete',
        description: 'Complete all units',
        icon: '🎖️',
        condition: (user, wallet, progress) => progress.completedLessons.length >= 14, // Adjust based on total lessons
        reward: { xp: 5000, gems: 2500, money: 10000 }
    },
    {
        id: 'gem_collector',
        title: 'Gem Collector',
        description: 'Collect 1000 gems',
        icon: '💎',
        condition: (user, wallet, progress) => user.gems >= 1000,
        reward: { xp: 800, money: 3000 }
    }
];

// Check which achievements user has unlocked
export function checkAchievements(user, wallet, progress, unlockedAchievements = []) {
    const newlyUnlocked = [];

    ACHIEVEMENTS.forEach(achievement => {
        // Skip if already unlocked
        if (unlockedAchievements.includes(achievement.id)) return;

        // Check condition
        if (achievement.condition(user, wallet, progress)) {
            newlyUnlocked.push(achievement);
        }
    });

    return newlyUnlocked;
}
