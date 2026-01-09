import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader, BookOpen, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { getPreLessonIntro } from '../../services/gemini';

export default function AIIntroduction({ simulationConfig, onComplete }) {
    const [introData, setIntroData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadIntroduction();
    }, []);

    const loadIntroduction = async () => {
        setLoading(true);
        try {
            const data = await getPreLessonIntro(simulationConfig.title, simulationConfig.terms);
            setIntroData(data);
        } catch (error) {
            console.error('Failed to load introduction:', error);
            // Use fallback data
            setIntroData({
                introduction: `Let's learn about ${simulationConfig.title}! Understanding these key terms will help you succeed.`,
                terms: simulationConfig.terms.map(term => ({
                    term: term.split(' (')[0],
                    explanation: `${term} is an important concept you'll learn in this simulation.`
                }))
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
                        <p className="text-gray-700 font-semibold">AI is preparing your lesson...</p>
                        <p className="text-sm text-gray-500 mt-2">Powered by Gemini</p>
                        <Button variant="outline" className="mt-6" onClick={onComplete}>Skip Introduction →</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Sparkles className="w-8 h-8 text-purple-600" />
                        <h2 className="text-3xl font-bold">AI Tutor</h2>
                    </div>
                    <div className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-bold mb-4">
                        Powered by Gemini
                    </div>
                </div>

                {/* Introduction */}
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 p-6">
                    <div className="flex items-start gap-3">
                        <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-lg text-blue-900 mb-2">Before We Start...</h3>
                            <p className="text-gray-700 leading-relaxed">{introData?.introduction}</p>
                        </div>
                    </div>
                </Card>

                {/* Key Terms */}
                <div className="space-y-3">
                    <h3 className="font-bold text-xl text-center">📚 Key Financial Terms</h3>
                    {introData?.terms.map((item, index) => (
                        <motion.div
                            key={item.term}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="bg-white border-2 border-purple-200 hover:border-purple-400 transition-all p-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-purple-100 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-purple-900 mb-1">{item.term}</h4>
                                        <p className="text-gray-700 text-sm">{item.explanation}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Start Button */}
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 text-center">
                    <p className="text-yellow-900 font-semibold mb-3">
                        💡 Understanding these terms will help you make smarter financial decisions!
                    </p>
                    <Button variant="primary" className="w-full text-lg py-4" onClick={onComplete}>
                        Got it! Let's Start the Simulation
                        <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
