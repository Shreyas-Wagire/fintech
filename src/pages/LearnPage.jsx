import { useNavigate } from 'react-router-dom';
import { Check, Star, Lock, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import { UNITS } from '../data/curriculum';
import { cn } from '../lib/utils';

export default function LearnPage() {
    const navigate = useNavigate();
    const { isLessonUnlocked, isLessonCompleted, user } = useStore();

    return (
        <div className="pb-24 pt-20 px-4 flex flex-col items-center gap-12 min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md text-center mb-4"
            >
                <h1 className="text-4xl font-extrabold mb-3">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Master Your Money
                    </span>
                </h1>
                <p className="text-gray-600 text-lg">Learn finance through real-world simulations</p>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-md">
                        <Zap className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
                        <p className="text-2xl font-bold text-gray-800">{user.streak}</p>
                        <p className="text-xs text-gray-600">Day Streak</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-md">
                        <TrendingUp className="w-6 h-6 mx-auto mb-1 text-purple-500" />
                        <p className="text-2xl font-bold text-gray-800">{user.level}</p>
                        <p className="text-xs text-gray-600">Level</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-md">
                        <Star className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                        <p className="text-2xl font-bold text-gray-800">{user.xp}</p>
                        <p className="text-xs text-gray-600">XP</p>
                    </div>
                </div>
            </motion.div>

            {UNITS.map((unit, unitIndex) => (
                <motion.div
                    key={unit.id}
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: unitIndex * 0.1 }}
                >
                    {/* Premium Unit Header */}
                    <div className={cn(
                        "p-6 rounded-2xl mb-8 text-white shadow-2xl relative overflow-hidden",
                        unit.color
                    )}>
                        {/* Decorative gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-2xl font-bold">{unit.title}</h2>
                                <div className="bg-white/30 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold">
                                    Unit {unit.id}
                                </div>
                            </div>
                            <p className="opacity-95 text-sm mb-4">{unit.description}</p>

                            {/* Enhanced Progress Bar */}
                            <div className="relative">
                                <div className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                                    <motion.div
                                        className="bg-white h-full rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${(unit.levels.filter(l => isLessonCompleted(l.id)).length / unit.levels.length) * 100}%`
                                        }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                                <p className="text-xs mt-2 opacity-90">
                                    {unit.levels.filter(l => isLessonCompleted(l.id)).length} / {unit.levels.length} completed
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Lessons Path */}
                    <div className="relative flex flex-col items-center gap-6">
                        {/* Animated Connecting Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 -z-10 rounded-full"
                            style={{ transform: 'translateX(-50%)' }}
                        />

                        {unit.levels.map((level, index) => {
                            const unlocked = isLessonUnlocked(level.id);
                            const completed = isLessonCompleted(level.id);
                            const align = index % 2 === 0 ? 'items-end pr-8' : 'items-start pl-8';

                            return (
                                <motion.div
                                    key={level.id}
                                    className={cn("flex w-full", align)}
                                    whileHover={{ scale: unlocked ? 1.02 : 1 }}
                                >
                                    <div className="relative">
                                        {/* Premium Lesson Node */}
                                        <motion.button
                                            disabled={!unlocked}
                                            onClick={() => unlocked && navigate(`/lesson/${level.id}`)}
                                            className={cn(
                                                "w-24 h-24 rounded-2xl flex items-center justify-center transition-all shadow-lg relative z-10",
                                                completed
                                                    ? "bg-gradient-to-br from-green-400 to-green-600 border-4 border-white shadow-green-200"
                                                    : unlocked
                                                        ? "bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-white shadow-purple-200"
                                                        : "bg-gray-300 border-4 border-gray-200 cursor-not-allowed"
                                            )}
                                            whileHover={unlocked ? { scale: 1.1, rotate: 5 } : {}}
                                            whileTap={unlocked ? { scale: 0.95 } : {}}
                                        >
                                            {completed ? (
                                                <Check className="w-12 h-12 text-white stroke-[3px]" />
                                            ) : unlocked ? (
                                                <Star className="w-12 h-12 text-white fill-white" />
                                            ) : (
                                                <Lock className="w-10 h-10 text-gray-500" />
                                            )}
                                        </motion.button>

                                        {/* Premium Label */}
                                        <div className={cn(
                                            "absolute top-1/2 -translate-y-1/2 w-52",
                                            index % 2 === 0 ? "right-28" : "left-28"
                                        )}>
                                            <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-gray-100">
                                                <span className={cn(
                                                    "text-sm font-bold block mb-1",
                                                    completed ? "text-green-600" : unlocked ? "text-blue-600" : "text-gray-400"
                                                )}>
                                                    {level.title}
                                                </span>
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    {completed ? (
                                                        <>✓ Completed!</>
                                                    ) : unlocked ? (
                                                        <>→ Tap to start</>
                                                    ) : (
                                                        <>🔒 Locked</>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            ))}

            <div className="h-20" />
        </div>
    );
}
