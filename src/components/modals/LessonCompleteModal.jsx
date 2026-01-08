import { motion } from 'framer-motion';
import { Trophy, Coins, Star, ArrowRight, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';

export default function LessonCompleteModal({
    onContinue,
    onHome,
    xpEarned = 50,
    moneyEarned = 200,
    accuracy = 0,
    balanceBefore = 0,
    balanceAfter = 0
}) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full text-center"
            >
                {/* Trophy Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="mb-6"
                >
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                        <Trophy className="w-12 h-12 text-white" />
                    </div>
                </motion.div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Lesson Complete!</h1>
                <p className="text-gray-500 mb-6">Great job! Keep it up!</p>

                {/* Rewards */}
                <div className="space-y-3 mb-8">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-between bg-green-50 p-4 rounded-xl"
                    >
                        <div className="flex items-center gap-3">
                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-gray-700">XP Earned</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">+{xpEarned}</span>
                    </motion.div>

                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center justify-between bg-blue-50 p-4 rounded-xl"
                    >
                        <div className="flex items-center gap-3">
                            <Coins className="w-6 h-6 text-yellow-600 fill-yellow-400" />
                            <span className="font-bold text-gray-700">Money Earned</span>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">₹{moneyEarned}</span>
                    </motion.div>

                    {/* Balance Change */}
                    {balanceBefore > 0 && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200"
                        >
                            <div className="flex items-center justify-center gap-3 text-lg font-bold">
                                <span className="text-gray-600">₹{balanceBefore.toLocaleString()}</span>
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <span className="text-green-600">₹{balanceAfter.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">New Balance</p>
                        </motion.div>
                    )}

                    {accuracy > 0 && (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-purple-50 p-4 rounded-xl"
                        >
                            <span className="font-bold text-gray-700">Accuracy: </span>
                            <span className="text-xl font-bold text-purple-600">{accuracy}%</span>
                        </motion.div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button
                        variant="primary"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={onContinue}
                    >
                        Continue
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={onHome}
                    >
                        Back to Home
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
