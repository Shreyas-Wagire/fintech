import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Wallet, TrendingUp, TrendingDown, Calendar, Award, Zap, Gem, Heart } from 'lucide-react';
import useStore from '../store/useStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AIAdvisor from '../components/ai/AIAdvisor';
import { cn } from '../lib/utils';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, wallet } = useStore();

    // Format date nicely
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return `Today, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return date.toLocaleString('en-IN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    return (
        <div className="min-h-screen bg-off-white pt-20 pb-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold">My Profile</h1>
                </div>

                {/* AI Financial Advisor */}
                <div className="mb-6">
                    <AIAdvisor />
                </div>

                {/* User Stats Card */}
                <Card className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <Award className="w-8 h-8 mx-auto mb-2 text-brand-gold" />
                            <p className="text-sm text-gray-600">Level</p>
                            <p className="text-2xl font-bold">{user.level}</p>
                        </div>
                        <div className="text-center">
                            <Zap className="w-8 h-8 mx-auto mb-2 text-brand-gold fill-brand-gold" />
                            <p className="text-sm text-gray-600">Streak</p>
                            <p className="text-2xl font-bold">{user.streak} days</p>
                        </div>
                        <div className="text-center">
                            <Gem className="w-8 h-8 mx-auto mb-2 text-brand-blue fill-brand-blue" />
                            <p className="text-sm text-gray-600">Gems</p>
                            <p className="text-2xl font-bold">{user.gems}</p>
                        </div>
                        <div className="text-center">
                            <Heart className="w-8 h-8 mx-auto mb-2 text-brand-red fill-brand-red" />
                            <p className="text-sm text-gray-600">Hearts</p>
                            <p className="text-2xl font-bold">{user.hearts}/{user.maxHearts}</p>
                        </div>
                    </div>
                </Card>

                {/* Wallet Balance Card */}
                <Card className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Wallet className="w-6 h-6" />
                                <span className="text-lg opacity-90">Wallet Balance</span>
                            </div>
                            <p className="text-4xl font-bold">₹{wallet.balance.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm opacity-75">Active Loans</p>
                            <p className="text-2xl font-bold">{wallet.loans.length}</p>
                        </div>
                    </div>
                </Card>

                {/* Achievements Section */}
                {((useStore.getState().achievements?.unlocked?.length || 0) > 0) && (
                    <Card className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Award className="w-6 h-6 text-yellow-600" />
                            <h2 className="text-xl font-bold">Achievements</h2>
                            <span className="ml-auto bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                                {useStore.getState().achievements?.unlocked?.length || 0}
                            </span>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                            {(useStore.getState().achievements?.unlocked || []).slice(0, 8).map((achievementId, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center p-2 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-300"
                                    title={achievementId}
                                >
                                    <div className="text-3xl mb-1">🏆</div>
                                    <div className="text-xs text-center font-semibold text-gray-700 truncate w-full">
                                        Badge
                                    </div>
                                </div>
                            ))}
                        </div>
                        {((useStore.getState().achievements?.unlocked?.length || 0) > 8) && (
                            <p className="text-center text-sm text-gray-500 mt-3">
                                +{(useStore.getState().achievements?.unlocked?.length || 0) - 8} more achievements
                            </p>
                        )}
                    </Card>
                )}

                {/* Active Loans */}
                {wallet.loans.length > 0 && (
                    <Card className="mb-6">
                        <h2 className="text-xl font-bold mb-4">🏦 Active Loans</h2>
                        <div className="space-y-3">
                            {wallet.loans.map((loan, index) => (
                                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-gray-700">{loan.reason}</span>
                                        <span className="text-sm text-gray-500">
                                            {loan.remainingMonths} months left
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-600">Principal:</span>
                                            <span className="font-bold ml-2">₹{loan.principal.toLocaleString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">EMI:</span>
                                            <span className="font-bold ml-2 text-red-600">₹{loan.emi.toLocaleString()}/mo</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Transaction History */}
                <Card>
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-6 h-6 text-gray-700" />
                        <h2 className="text-xl font-bold">Transaction History</h2>
                    </div>

                    {wallet.transactions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">No transactions yet</p>
                            <p className="text-sm text-gray-400">Complete lessons and use simulations to see your money flow!</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {wallet.transactions.map((transaction, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "p-4 rounded-lg border-l-4 transition-all hover:shadow-md",
                                        transaction.type === 'CREDIT'
                                            ? "bg-green-50 border-green-500"
                                            : "bg-red-50 border-red-500"
                                    )}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                {transaction.type === 'CREDIT' ? (
                                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <TrendingDown className="w-5 h-5 text-red-600" />
                                                )}
                                                <span className="font-semibold text-gray-800">
                                                    {transaction.reason}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDate(transaction.date)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={cn(
                                                "text-xl font-bold",
                                                transaction.type === 'CREDIT' ? "text-green-600" : "text-red-600"
                                            )}>
                                                {transaction.type === 'CREDIT' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Balance: ₹{transaction.balanceAfter.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Back Button */}
                <div className="mt-6 text-center">
                    <Button variant="outline" onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
