import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, Gamepad2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function BottomNav() {
    const location = useLocation();

    const navItems = [
        { name: 'Learn', icon: Home, path: '/', color: 'text-blue-600' },
        { name: 'Practice', icon: Gamepad2, path: '/simulator', color: 'text-purple-600' },
        { name: 'Rank', icon: Trophy, path: '/leaderboard', color: 'text-yellow-600' },
        { name: 'Profile', icon: User, path: '/profile', color: 'text-green-600' },
    ];

    return (
        <div className="fixed bottom-0 w-full z-50 px-4 pb-4">
            {/* Pill-shaped container with glassmorphism */}
            <div className="max-w-sm mx-auto">
                <motion.div
                    className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-full shadow-2xl px-3 py-2"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <div className="flex justify-around items-center">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="relative flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all"
                                >
                                    {/* Active indicator with gradient */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-xl"
                                            transition={{ type: 'spring', duration: 0.5 }}
                                        />
                                    )}

                                    <motion.div
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="relative"
                                    >
                                        <item.icon
                                            className={cn(
                                                "w-5 h-5 transition-all",
                                                isActive ? `${item.color} stroke-[2.5px]` : "text-gray-400"
                                            )}
                                        />
                                    </motion.div>

                                    <span className={cn(
                                        "text-[10px] font-bold relative",
                                        isActive ? item.color : "text-gray-400"
                                    )}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
