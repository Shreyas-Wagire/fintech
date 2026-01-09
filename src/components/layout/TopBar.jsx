import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { Heart, Zap, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopBar() {
    const navigate = useNavigate();
    const { user } = useStore();

    return (
        <div className="fixed top-0 w-full z-50 px-4 pt-4">
            {/* Pill-shaped container with glassmorphism */}
            <div className="max-w-5xl mx-auto">
                <motion.div
                    className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-full shadow-2xl px-6 py-3"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <div className="flex justify-between items-center">
                        {/* App Logo/Title */}
                        <motion.div
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                FinLearn
                            </span>
                        </motion.div>

                        {/* Compact Stats */}
                        <div className="flex gap-2">
                            {/* Streak */}
                            <motion.div
                                className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1.5 rounded-full border border-yellow-200/50 backdrop-blur-sm"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Zap className="fill-yellow-500 text-yellow-600 w-4 h-4" />
                                <span className="text-sm font-bold text-gray-800">{user.streak}</span>
                            </motion.div>

                            {/* Gems */}
                            <motion.div
                                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1.5 rounded-full border border-blue-200/50 backdrop-blur-sm"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Gem className="fill-blue-500 text-blue-600 w-4 h-4" />
                                <span className="text-sm font-bold text-gray-800">{user.gems}</span>
                            </motion.div>

                            {/* Hearts */}
                            <motion.div
                                className="flex items-center gap-1.5 bg-gradient-to-r from-red-50 to-pink-50 px-3 py-1.5 rounded-full border border-red-200/50 backdrop-blur-sm"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Heart className="fill-red-500 text-red-600 w-4 h-4" />
                                <span className="text-sm font-bold text-gray-800">{user.hearts}</span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

