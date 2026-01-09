import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader, Trophy, TrendingUp, CheckCircle, ArrowRight, Award } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { generateLearningSummary } from '../../services/gemini';

export default function AILearningSummary({ simulationConfig, simulationData, onContinue }) {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSummary();
    }, []);

    const loadSummary = async () => {
        setLoading(true);
        try {
            const emergenciesPaid = simulationData.eventHistory?.filter(e => e.paid).length || 0;
            const emergenciesTotal = simulationData.eventHistory?.length || 0;

            const data = await generateLearningSummary(simulationConfig.title, {
                ...simulationData,
                emergenciesPaid,
                emergenciesTotal,
                emi: Math.round(simulationData.loanAmount / simulationData.months * 1.12) // Approximate
            });
            setSummary(data);
        } catch (error) {
            console.error('Failed to generate summary:', error);
            // Fallback
            setSummary({
                learned: simulationConfig.learningObjectives || ["Key concepts", "Practical skills", "Financial awareness"],
                mastered: [simulationConfig.title.split(' & ')[0] || "Financial Basics"],
                understanding: "good",
                nextLesson: "Continue practicing financial management",
                encouragement: "Great job completing the simulation!"
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-2 border-purple-300 p-8">
                    <div className="text-center py-8">
                        <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
                        <p className="text-gray-700 font-semibold">AI is analyzing your performance...</p>
                        <p className="text-sm text-gray-500 mt-2">Powered by Gemini</p>
                    </div>
                </Card>
            </div>
        );
    }

    const isGoodUnderstanding = summary.understanding === 'good';

    return (
        <div className="w-full max-w-2xl mx-auto">
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
                        {isGoodUnderstanding ? '🎉' : '📚'}
                    </motion.div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                        <h2 className="text-3xl font-bold">AI Learning Summary</h2>
                    </div>
                    <div className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-bold">
                        Powered by Gemini
                    </div>
                </div>

                {/* What You Learned */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-6 h-6 text-green-600" />
                        <h3 className="font-bold text-lg text-green-900">What You Learned</h3>
                    </div>
                    <ul className="space-y-2">
                        {summary.learned.map((point, index) => (
                            <motion.li
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-2"
                            >
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-800">{point}</span>
                            </motion.li>
                        ))}
                    </ul>
                </Card>

                {/* Concepts Mastered */}
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Award className="w-6 h-6 text-blue-600" />
                        <h3 className="font-bold text-lg text-blue-900">Concepts Mastered</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {summary.mastered.map((concept, index) => (
                            <motion.span
                                key={index}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm border-2 border-blue-300"
                            >
                                ✓ {concept}
                            </motion.span>
                        ))}
                    </div>
                </Card>

                {/* Recommended Next */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                        <h3 className="font-bold text-lg text-purple-900">Recommended Next</h3>
                    </div>
                    <p className="text-gray-800 text-lg">{summary.nextLesson}</p>
                </Card>

                {/* Encouragement */}
                <Card className={`p-6 ${isGoodUnderstanding ? 'bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300' : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300'}`}>
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">{isGoodUnderstanding ? '🌟' : '💪'}</span>
                        <div>
                            <p className="font-bold text-lg mb-1 text-gray-900">
                                {isGoodUnderstanding ? 'Excellent Performance!' : 'Keep Learning!'}
                            </p>
                            <p className="text-gray-800">{summary.encouragement}</p>
                        </div>
                    </div>
                </Card>

                {/* Continue Button */}
                <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-4 text-center">
                    <p className="text-purple-900 font-semibold mb-3">
                        💡 Keep practicing to master financial management!
                    </p>
                    <Button variant="primary" className="w-full text-lg py-4" onClick={onContinue}>
                        Continue Learning
                        <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
