import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, AlertCircle, CheckCircle, XCircle, Loader, Sparkles, Award, Target, PieChart } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { analyzeDecisions } from '../../services/gemini';

const GRADE_CONFIG = {
    'A': { color: 'green', emoji: '🏆', text: 'Excellent!', bgClass: 'bg-green-50', borderClass: 'border-green-300', textClass: 'text-green-700' },
    'B': { color: 'blue', emoji: '👍', text: 'Good Job!', bgClass: 'bg-blue-50', borderClass: 'border-blue-300', textClass: 'text-blue-700' },
    'C': { color: 'yellow', emoji: '📚', text: 'Room to Improve', bgClass: 'bg-yellow-50', borderClass: 'border-yellow-300', textClass: 'text-yellow-700' },
    'D': { color: 'orange', emoji: '💪', text: 'Keep Learning!', bgClass: 'bg-orange-50', borderClass: 'border-orange-300', textClass: 'text-orange-700' }
};

const VERDICT_CONFIG = {
    'good': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Smart Choice', emoji: '✅' },
    'okay': { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Acceptable', emoji: '⚠️' },
    'bad': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Poor Choice', emoji: '❌' }
};

export default function FinancialAnalysis({ startBalance, finalBalance, decisions, totalDebt, onContinue }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        analyzeUserDecisions();
    }, []);

    const analyzeUserDecisions = async () => {
        setLoading(true);
        try {
            const decisionData = {
                startBalance,
                finalBalance,
                totalDebt: totalDebt || 0,
                decisions: decisions.map((d, i) => ({
                    context: d.expense,
                    userChoice: d.method.toUpperCase(),
                    alternatives: d.availableOptions || ['Cash', 'UPI', 'Credit Card', 'EMI'],
                    balanceAtTime: d.balanceBeforePayment,
                    metadata: {
                        cost: d.cost,
                        category: d.category || 'general',
                        hadCash: d.balanceBeforePayment >= d.cost
                    }
                }))
            };

            const result = await analyzeDecisions('Money Month', decisionData);
            setAnalysis(result);
        } catch (error) {
            console.error('Failed to analyze decisions:', error);
            // Fallback analysis
            setAnalysis({
                overallGrade: 'B',
                overallFeedback: 'You completed the Money Month challenge! Review your decisions to improve your financial skills.',
                decisionAnalysis: decisions.map((d, i) => ({
                    decisionNumber: i + 1,
                    verdict: 'okay',
                    reasoning: `Used ${d.method} for ${d.expense}`,
                    betterAlternative: 'Consider if this was the most cost-effective choice',
                    financialImpact: null
                })),
                topWins: ['Completed all expenses', 'Managed your budget'],
                topMistakes: ['Some decisions could be optimized']
            });
        } finally {
            setLoading(false);
        }
    };

    // Calculate spending breakdown
    const calculateSpendingBreakdown = () => {
        const byCategory = {};
        const byMethod = {};

        decisions.forEach(d => {
            // By category
            const cat = d.category || 'other';
            byCategory[cat] = (byCategory[cat] || 0) + d.cost;

            // By method
            const method = d.method;
            byMethod[method] = (byMethod[method] || 0) + d.cost;
        });

        return { byCategory, byMethod };
    };

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-2 border-purple-300 p-8">
                    <div className="text-center py-8">
                        <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
                        <p className="text-gray-700 font-semibold">AI is analyzing your financial decisions...</p>
                        <p className="text-sm text-gray-500 mt-2">Powered by Gemini</p>
                    </div>
                </Card>
            </div>
        );
    }

    const gradeConfig = GRADE_CONFIG[analysis.overallGrade] || GRADE_CONFIG['C'];
    const { byCategory, byMethod } = calculateSpendingBreakdown();
    const totalSpent = decisions.reduce((sum, d) => sum + d.cost, 0);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="text-8xl mb-4"
                    >
                        {gradeConfig.emoji}
                    </motion.div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                        <h2 className="text-3xl font-bold">Financial Analysis Report</h2>
                    </div>
                    <div className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-bold">
                        Powered by Gemini AI
                    </div>
                </div>

                {/* Overall Grade */}
                <Card className={`${gradeConfig.bgClass} border-2 ${gradeConfig.borderClass} p-6`}>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <Award className={`w-10 h-10 ${gradeConfig.textClass}`} />
                            <div>
                                <p className="text-sm text-gray-600">Overall Grade</p>
                                <p className={`text-5xl font-bold ${gradeConfig.textClass}`}>{analysis.overallGrade}</p>
                            </div>
                        </div>
                        <p className={`text-lg font-semibold ${gradeConfig.textClass}`}>{gradeConfig.text}</p>
                        <p className="text-gray-700 mt-2">{analysis.overallFeedback}</p>
                    </div>
                </Card>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-blue-50 border-blue-200 p-4">
                        <p className="text-xs text-gray-600 mb-1">Starting Balance</p>
                        <p className="text-2xl font-bold text-blue-600">₹{startBalance.toLocaleString()}</p>
                    </Card>
                    <Card className="bg-green-50 border-green-200 p-4">
                        <p className="text-xs text-gray-600 mb-1">Final Balance</p>
                        <p className="text-2xl font-bold text-green-600">₹{finalBalance.toLocaleString()}</p>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200 p-4">
                        <p className="text-xs text-gray-600 mb-1">Total Spent</p>
                        <p className="text-2xl font-bold text-purple-600">₹{totalSpent.toLocaleString()}</p>
                    </Card>
                    <Card className={`${totalDebt > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'} p-4`}>
                        <p className="text-xs text-gray-600 mb-1">Debt Remaining</p>
                        <p className={`text-2xl font-bold ${totalDebt > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                            ₹{totalDebt.toLocaleString()}
                        </p>
                    </Card>
                </div>

                {/* Decision Analysis */}
                <Card className="bg-white border-2 border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Target className="w-6 h-6 text-gray-700" />
                        <h3 className="font-bold text-lg">Decision Breakdown</h3>
                    </div>
                    <div className="space-y-4">
                        {analysis.decisionAnalysis.map((decision, index) => {
                            const verdictConfig = VERDICT_CONFIG[decision.verdict] || VERDICT_CONFIG['okay'];
                            const VerdictIcon = verdictConfig.icon;
                            const originalDecision = decisions[index];

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`${verdictConfig.bg} border-2 border-gray-200 rounded-lg p-4`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-gray-700 border-2 border-gray-300`}>
                                                {decision.decisionNumber}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{originalDecision.expense}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Paid ₹{originalDecision.cost.toLocaleString()} using <span className="font-semibold">{originalDecision.method.toUpperCase()}</span>
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <VerdictIcon className={`w-5 h-5 ${verdictConfig.color}`} />
                                                    <span className={`text-xs font-bold ${verdictConfig.color}`}>{verdictConfig.label}</span>
                                                </div>
                                            </div>
                                            <div className="bg-white bg-opacity-70 rounded p-3 space-y-2">
                                                <div>
                                                    <p className="text-xs text-gray-500 font-semibold">Why?</p>
                                                    <p className="text-sm text-gray-700">{decision.reasoning}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-semibold">Better Approach</p>
                                                    <p className="text-sm text-gray-700">{decision.betterAlternative}</p>
                                                </div>
                                                {decision.financialImpact && (
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="w-4 h-4 text-purple-600" />
                                                        <p className="text-sm font-semibold text-purple-700">{decision.financialImpact}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </Card>

                {/* Top Wins and Mistakes */}
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Top Wins */}
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-3xl">🌟</div>
                            <h3 className="font-bold text-lg text-green-900">Smart Decisions</h3>
                        </div>
                        <ul className="space-y-2">
                            {analysis.topWins.map((win, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-800 text-sm">{win}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Top Mistakes */}
                    <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-300 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-3xl">💡</div>
                            <h3 className="font-bold text-lg text-orange-900">Learn From</h3>
                        </div>
                        <ul className="space-y-2">
                            {analysis.topMistakes.map((mistake, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-800 text-sm">{mistake}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>

                {/* Spending Breakdown */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <PieChart className="w-6 h-6 text-purple-600" />
                        <h3 className="font-bold text-lg text-purple-900">Spending Analysis</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* By Category */}
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-3">By Category</p>
                            <div className="space-y-2">
                                {Object.entries(byCategory).map(([category, amount]) => (
                                    <div key={category} className="flex items-center justify-between bg-white bg-opacity-70 rounded px-3 py-2">
                                        <span className="text-sm capitalize text-gray-700">{category}</span>
                                        <span className="font-semibold text-purple-600">₹{amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* By Payment Method */}
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-3">By Payment Method</p>
                            <div className="space-y-2">
                                {Object.entries(byMethod).map(([method, amount]) => (
                                    <div key={method} className="flex items-center justify-between bg-white bg-opacity-70 rounded px-3 py-2">
                                        <span className="text-sm capitalize text-gray-700">{method}</span>
                                        <span className="font-semibold text-purple-600">₹{amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Educational Callout */}
                <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 p-6">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl">📚</div>
                        <div>
                            <p className="font-bold text-lg mb-2 text-blue-900">Key Learnings</p>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li>💳 <strong>Credit Cards:</strong> Use only when necessary - they charge 18% annual interest!</li>
                                <li>💰 <strong>Cash/UPI:</strong> Always prefer when you have the balance - no extra costs</li>
                                <li>📊 <strong>EMI:</strong> Only for expensive items (₹3000+) or emergencies - adds ~12% to the cost</li>
                                <li>🎯 <strong>Budget Wisely:</strong> Track spending by category to identify where you can save</li>
                            </ul>
                        </div>
                    </div>
                </Card>

                {/* Continue Button */}
                <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 text-center">
                    <p className="text-purple-900 font-semibold mb-3">
                        💡 Apply these insights in real life to manage your money better!
                    </p>
                    <Button variant="primary" className="w-full text-lg py-4" onClick={onContinue}>
                        Continue Learning
                        <TrendingUp className="ml-2" />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
