import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Get current user's storage key
const getStorageKey = () => {
    const currentUser = localStorage.getItem('fintech-current-user');
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            return `fintech-storage-${user.id}`;
        } catch (e) {
            console.error('Failed to parse current user:', e);
        }
    }
    return 'fintech-storage-guest';
};

// Get current user's name
const getCurrentUserName = () => {
    const currentUser = localStorage.getItem('fintech-current-user');
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            return user.name || 'Student';
        } catch (e) {
            console.error('Failed to parse current user:', e);
        }
    }
    return 'Student';
};

const useStore = create(
    persist(
        (set, get) => ({
            // User Stats
            user: {
                name: getCurrentUserName(),
                xp: 0,
                level: 1,
                streak: 1,
                hearts: 5,
                maxHearts: 5,
                gems: 100,
                lastLoginDate: new Date().toDateString(),
            },

            // Unified Wallet - ONE balance for everything!
            wallet: {
                balance: 10000, // Start with ₹10,000 (scarcity creates value)
                portfolio: {}, // { "APPL": 10, "Gold": 5 }
                loans: [], // Active loans: [{ amount, emi, remainingMonths, reason }]
                transactions: [], // All money movements
            },

            // Learning Progress
            progress: {
                currentUnit: 1,
                completedLessons: [], // ['l1', 'l2', ...]
                perfectLessons: [], // Lessons with 100% accuracy
                simulationsCompleted: [], // ['loan', 'budget', 'tax']
            },

            // Achievements for gamification
            achievements: {
                unlocked: [],
                pending: [],
            },

            // Money Actions - The core of financial learning!
            addMoney: (amount, reason = 'General') => set((state) => {
                const transaction = {
                    type: 'CREDIT',
                    amount,
                    reason,
                    balanceBefore: state.wallet.balance,
                    balanceAfter: state.wallet.balance + amount,
                    date: new Date().toISOString(),
                };

                return {
                    wallet: {
                        ...state.wallet,
                        balance: state.wallet.balance + amount,
                        transactions: [transaction, ...state.wallet.transactions].slice(0, 50), // Keep last 50
                    }
                };
            }),

            deductMoney: (amount, reason = 'General') => set((state) => {
                const transaction = {
                    type: 'DEBIT',
                    amount,
                    reason,
                    balanceBefore: state.wallet.balance,
                    balanceAfter: state.wallet.balance - amount,
                    date: new Date().toISOString(),
                };

                return {
                    wallet: {
                        ...state.wallet,
                        balance: state.wallet.balance - amount,
                        transactions: [transaction, ...state.wallet.transactions].slice(0, 50),
                    }
                };
            }),

            // Loan Management
            takeLoan: (amount, months, interestRate, reason = 'Personal Loan') => set((state) => {
                const monthlyRate = interestRate / 12 / 100;
                const emi = Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                    (Math.pow(1 + monthlyRate, months) - 1));

                const newLoan = {
                    id: Date.now(),
                    principal: amount,
                    emi,
                    remainingMonths: months,
                    interestRate,
                    reason,
                    takenDate: new Date().toISOString(),
                };

                const transaction = {
                    type: 'CREDIT',
                    amount,
                    reason: `Loan: ${reason}`,
                    balanceBefore: state.wallet.balance,
                    balanceAfter: state.wallet.balance + amount,
                    date: new Date().toISOString(),
                };

                return {
                    wallet: {
                        ...state.wallet,
                        balance: state.wallet.balance + amount,
                        loans: [...state.wallet.loans, newLoan],
                        transactions: [transaction, ...state.wallet.transactions].slice(0, 50),
                    }
                };
            }),

            payEMI: (loanId) => set((state) => {
                const loanIndex = state.wallet.loans.findIndex(l => l.id === loanId);
                if (loanIndex === -1) return state;

                const loan = state.wallet.loans[loanIndex];
                const newBalance = state.wallet.balance - loan.emi;

                const transaction = {
                    type: 'DEBIT',
                    amount: loan.emi,
                    reason: `EMI Payment: ${loan.reason}`,
                    balanceBefore: state.wallet.balance,
                    balanceAfter: newBalance,
                    date: new Date().toISOString(),
                };

                const updatedLoans = [...state.wallet.loans];
                if (loan.remainingMonths <= 1) {
                    // Loan paid off
                    updatedLoans.splice(loanIndex, 1);
                } else {
                    updatedLoans[loanIndex] = {
                        ...loan,
                        remainingMonths: loan.remainingMonths - 1,
                    };
                }

                return {
                    wallet: {
                        ...state.wallet,
                        balance: newBalance,
                        loans: updatedLoans,
                        transactions: [transaction, ...state.wallet.transactions].slice(0, 50),
                    }
                };
            }),

            // XP Actions
            addXp: (amount) => set((state) => {
                const newXp = state.user.xp + amount;
                const newLevel = Math.floor(newXp / 100) + 1;

                return {
                    user: {
                        ...state.user,
                        xp: newXp,
                        level: newLevel
                    }
                };
            }),

            loseHeart: () => set((state) => ({
                user: { ...state.user, hearts: Math.max(0, state.user.hearts - 1) }
            })),

            refillHearts: () => set((state) => ({
                user: { ...state.user, hearts: state.user.maxHearts }
            })),

            // Lesson unlock logic
            isLessonUnlocked: (lessonId) => {
                // TESTING: All lessons unlocked
                return true;

                // Original logic (commented for testing):
                // const state = get();
                // if (lessonId === 'l1') return true;
                // const lessonNum = parseInt(lessonId.substring(1));
                // const prevLessonId = `l${lessonNum - 1}`;
                // return state.progress.completedLessons.includes(prevLessonId);
            },

            isLessonCompleted: (lessonId) => {
                const state = get();
                return state.progress.completedLessons.includes(lessonId);
            },

            // Stock trading - now uses unified balance!
            buyAsset: (assetSymbol, quantity, price) => set((state) => {
                const totalCost = quantity * price;
                if (state.wallet.balance < totalCost) return state;

                const currentQty = state.wallet.portfolio[assetSymbol] || 0;

                return {
                    wallet: {
                        ...state.wallet,
                        balance: state.wallet.balance - totalCost,
                        portfolio: { ...state.wallet.portfolio, [assetSymbol]: currentQty + quantity },
                        transactions: [{
                            type: 'DEBIT',
                            amount: totalCost,
                            reason: `Buy ${quantity} ${assetSymbol}`,
                            balanceBefore: state.wallet.balance,
                            balanceAfter: state.wallet.balance - totalCost,
                            date: new Date().toISOString(),
                        }, ...state.wallet.transactions].slice(0, 50),
                    }
                };
            }),

            sellAsset: (assetSymbol, quantity, price) => set((state) => {
                const currentQty = state.wallet.portfolio[assetSymbol] || 0;
                if (currentQty < quantity) return state;

                const totalValue = quantity * price;
                const newQty = currentQty - quantity;

                const newPortfolio = { ...state.wallet.portfolio };
                if (newQty === 0) delete newPortfolio[assetSymbol];
                else newPortfolio[assetSymbol] = newQty;

                return {
                    wallet: {
                        ...state.wallet,
                        balance: state.wallet.balance + totalValue,
                        portfolio: newPortfolio,
                        transactions: [{
                            type: 'CREDIT',
                            amount: totalValue,
                            reason: `Sell ${quantity} ${assetSymbol}`,
                            balanceBefore: state.wallet.balance,
                            balanceAfter: state.wallet.balance + totalValue,
                            date: new Date().toISOString(),
                        }, ...state.wallet.transactions].slice(0, 50),
                    }
                };
            }),

            // Complete lesson - earns money!
            completeLesson: (lessonId, earnedXp = 50, earnedMoney = 200, isPerfect = false) => set((state) => {
                if (state.progress.completedLessons.includes(lessonId)) {
                    return state;
                }

                const newXp = state.user.xp + earnedXp;
                const newLevel = Math.floor(newXp / 100) + 1;
                const leveledUp = newLevel > state.user.level;

                const transaction = {
                    type: 'CREDIT',
                    amount: earnedMoney,
                    reason: `Lesson ${lessonId} Reward`,
                    balanceBefore: state.wallet.balance,
                    balanceAfter: state.wallet.balance + earnedMoney,
                    date: new Date().toISOString(),
                };

                const newPerfectLessons = isPerfect ? [...(state.progress.perfectLessons || []), lessonId] : state.progress.perfectLessons;

                return {
                    user: {
                        ...state.user,
                        xp: newXp,
                        level: newLevel,
                    },
                    wallet: {
                        ...state.wallet,
                        balance: state.wallet.balance + earnedMoney,
                        transactions: [transaction, ...state.wallet.transactions].slice(0, 50),
                    },
                    progress: {
                        ...state.progress,
                        completedLessons: [...state.progress.completedLessons, lessonId],
                        perfectLessons: newPerfectLessons
                    },
                    leveledUp: leveledUp ? newLevel : null,
                };
            }),

            // Track simulation completion
            completeSimulation: (simulationType) => set((state) => ({
                progress: {
                    ...state.progress,
                    simulationsCompleted: [...(state.progress.simulationsCompleted || []), simulationType]
                }
            })),

            // Achievement methods
            unlockAchievement: (achievementId, rewards) => set((state) => {
                if (state.achievements.unlocked.includes(achievementId)) return state;

                const newGems = state.user.gems + (rewards.gems || 0);
                const newXp = state.user.xp + (rewards.xp || 0);
                const newBalance = state.wallet.balance + (rewards.money || 0);

                return {
                    user: {
                        ...state.user,
                        gems: newGems,
                        xp: newXp,
                    },
                    wallet: {
                        ...state.wallet,
                        balance: newBalance,
                    },
                    achievements: {
                        ...state.achievements,
                        unlocked: [...state.achievements.unlocked, achievementId],
                        pending: [...state.achievements.pending, achievementId]
                    }
                };
            }),

            clearPendingAchievements: () => set((state) => ({
                achievements: {
                    ...state.achievements,
                    pending: []
                }
            })),

            clearLevelUp: () => set({ leveledUp: null }),

            updateStreak: () => set((state) => {
                const today = new Date().toDateString();
                const lastLogin = state.user.lastLoginDate;

                if (today === lastLogin) return state;

                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const wasYesterday = yesterday.toDateString() === lastLogin;

                return {
                    user: {
                        ...state.user,
                        streak: wasYesterday ? state.user.streak + 1 : 1,
                        lastLoginDate: today,
                    }
                };
            }),
        }),
        {
            name: getStorageKey(),
        }
    )
);

export default useStore;
