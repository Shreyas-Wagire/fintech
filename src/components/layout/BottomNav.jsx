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
        <div className="fixed bottom-0 w-full bg-white border-t-2 border-gray-200 shadow-lg backdrop-blur-sm">
            <div className="flex justify-around items-center max-w-7xl mx-auto px-4 py-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="relative flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all"
                        >
                            {/* Active indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-brand-green/10 rounded-xl"
                                    transition={{ type: 'spring', duration: 0.5 }}
                                />
                            )}

                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative"
                            >
                                <item.icon
                                    className={cn(
                                        "w-6 h-6 transition-all",
                                        isActive ? `${item.color} stroke-[2.5px]` : "text-gray-400"
                                    )}
                                />
                            </motion.div>

                            <span className={cn(
                                "text-xs font-bold relative",
                                isActive ? item.color : "text-gray-400"
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
