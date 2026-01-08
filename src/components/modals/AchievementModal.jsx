import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function AchievementModal({ achievement, onClose }) {
    if (!achievement) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="relative w-full max-w-md mx-4"
                >
                    <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-4 border-yellow-400 p-8">
                        {/* Background decoration */}
                        <div className="absolute inset-0 opacity-10">
                            <Sparkles className="absolute top-4 left-4 w-12 h-12 text-yellow-600" />
                            <Sparkles className="absolute bottom-4 right-4 w-12 h-12 text-orange-600" />
                            <Sparkles className="absolute top-1/2 left-1/2 w-16 h-16 text-red-600" />
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Content */}
                        <div className="relative text-center space-y-6">
                            {/* Achievement icon with animation */}
                            <motion.div
                                initial={{ y: -20 }}
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-8xl"
                            >
                                {achievement.icon}
                            </motion.div>

                            {/* Title */}
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    Achievement Unlocked!
                                </h2>
                                <h3 className="text-2xl font-bold text-yellow-700">
                                    {achievement.title}
                                </h3>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-lg">
                                {achievement.description}
                            </p>

                            {/* Rewards */}
                            {achievement.reward && (
                                <Card className="bg-white/80 p-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-3">Rewards Earned:</p>
                                    <div className="flex justify-center gap-6">
                                        {achievement.reward.xp && (
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    +{achievement.reward.xp}
                                                </div>
                                                <div className="text-xs text-gray-600">XP</div>
                                            </div>
                                        )}
                                        {achievement.reward.gems && (
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-purple-600">
                                                    +{achievement.reward.gems}
                                                </div>
                                                <div className="text-xs text-gray-600">Gems</div>
                                            </div>
                                        )}
                                        {achievement.reward.money && (
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600">
                                                    +₹{achievement.reward.money}
                                                </div>
                                                <div className="text-xs text-gray-600">Money</div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )}

                            {/* Continue button */}
                            <Button
                                variant="primary"
                                onClick={onClose}
                                className="w-full text-lg py-3"
                            >
                                🎉 Awesome!
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
