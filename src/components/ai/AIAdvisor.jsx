import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Lightbulb, Loader } from 'lucide-react';
import useStore from '../../store/useStore';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { getFinancialAdvice, getNextLessonRecommendation } from '../../services/gemini';

export default function AIAdvisor() {
    const { user, wallet, progress } = useStore();
    const [advice, setAdvice] = useState([]);
    const [recommendation, setRecommendation] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchAdvice = async () => {
        setLoading(true);
        try {
            const userContext = {
                balance: wallet.balance,
                level: user.level,
                completedLessons: progress.completedLessons.length,
                activeLoans: wallet.loans.length,
                portfolioValue: Object.values(wallet.portfolio).reduce((sum, qty) => sum + qty * 100, 0),
                recentSpending: wallet.transactions
                    .filter(t => t.type === 'DEBIT')
                    .slice(0, 5)
                    .reduce((sum, t) => sum + t.amount, 0)
            };

            const [tips, nextLesson] = await Promise.all([
                getFinancialAdvice(userContext),
                getNextLessonRecommendation(userContext)
            ]);

            setAdvice(tips);
            setRecommendation(nextLesson);
        } catch (error) {
            console.error('Failed to fetch AI advice:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-300">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold">AI Financial Advisor</h2>
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-bold">
                        Powered by Gemini
                    </span>
                </div>
                <Button
                    variant="primary"
                    onClick={fetchAdvice}
                    disabled={loading}
                    className="text-sm"
                >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Get Advice'}
                </Button>
            </div>

            {loading && !advice.length && (
                <div className="text-center py-8">
                    <Loader className="w-8 h-8 animate-spin mx-auto mb-3 text-purple-600" />
                    <p className="text-gray-600">AI is analyzing your finances...</p>
                </div>
            )}

            {!loading && advice.length === 0 && (
                <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                    <p className="text-gray-600 mb-4">Get personalized financial advice from AI</p>
                    <Button variant="primary" onClick={fetchAdvice}>
                        Ask AI Advisor
                    </Button>
                </div>
            )}

            {advice.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                >
                    {/* AI Tips */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-5 h-5 text-yellow-600" />
                            <span className="font-semibold text-gray-700">Smart Tips for You:</span>
                        </div>
                        {advice.map((tip, index) => (
                            <motion.div
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/80 p-3 rounded-lg border border-purple-200 flex items-start gap-2"
                            >
                                <span className="text-purple-600 font-bold">{index + 1}.</span>
                                <p className="text-gray-800 text-sm">{tip}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Next Lesson Recommendation */}
                    {recommendation && (
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 p-4 rounded-lg mt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold text-gray-700">Recommended Next:</span>
                            </div>
                            <p className="text-gray-800">{recommendation}</p>
                        </div>
                    )}

                    <p className="text-xs text-gray-500 text-center mt-4">
                        💡 AI advice updates based on your financial activity
                    </p>
                </motion.div>
            )}
        </Card>
    );
}
