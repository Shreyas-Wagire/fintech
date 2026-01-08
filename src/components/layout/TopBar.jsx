import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { Heart, Zap, Gem, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopBar() {
    const navigate = useNavigate();
    const { user, wallet } = useStore();

    return (
        <div className="fixed top-0 w-full bg-gradient-to-r from-white via-gray-50 to-white backdrop-blur-md z-40 border-b-2 border-gray-200 shadow-sm">
            <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-3">
                {/* Wallet Balance - Most Important! */}
                <motion.button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Wallet className="w-5 h-5" />
                    <div className="text-left">
                        <p className="text-xs opacity-90 font-medium">Wallet</p>
                        <p className="text-lg font-bold leading-none">₹{wallet.balance.toLocaleString()}</p>
                    </div>
                </motion.button>

                {/* Stats */}
                <div className="flex gap-4">
                    {/* Streak */}
                    <motion.div
                        className="flex items-center gap-1.5 bg-yellow-50 px-3 py-2 rounded-lg border-2 border-yellow-200"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Zap className="fill-brand-gold text-brand-gold-dark w-5 h-5" />
                        <span className="text-sm font-bold text-gray-800">{user.streak}</span>
                    </motion.div>

                    {/* Gems */}
                    <motion.div
                        className="flex items-center gap-1.5 bg-blue-50 px-3 py-2 rounded-lg border-2 border-blue-200"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Gem className="fill-brand-blue text-brand-blue w-5 h-5" />
                        <span className="text-sm font-bold text-gray-800">{user.gems}</span>
                    </motion.div>

                    {/* Hearts */}
                    <motion.div
                        className="flex items-center gap-1.5 bg-red-50 px-3 py-2 rounded-lg border-2 border-red-200"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Heart className="fill-brand-red text-brand-red w-5 h-5" />
                        <span className="text-sm font-bold text-gray-800">{user.hearts}</span>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
