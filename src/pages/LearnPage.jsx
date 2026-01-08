import { useNavigate } from 'react-router-dom';
import { Check, Star, Lock } from 'lucide-react';
import useStore from '../store/useStore';
import { UNITS } from '../data/curriculum';
import { cn } from '../lib/utils';
import Button from '../components/ui/Button';

export default function LearnPage() {
    const navigate = useNavigate();
    const { isLessonUnlocked, isLessonCompleted } = useStore();

    return (
        <div className="pb-24 pt-20 px-4 flex flex-col items-center gap-8 min-h-screen bg-gradient-to-b from-blue-50 to-off-white">

            {UNITS.map((unit, unitIndex) => (
                <div key={unit.id} className="w-full max-w-md">
                    {/* Unit Header */}
                    <div className={cn("p-6 rounded-2xl mb-8 text-white shadow-xl", unit.color)}>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold">{unit.title}</h2>
                            <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                                Unit {unit.id}
                            </div>
                        </div>
                        <p className="opacity-90 text-sm">{unit.description}</p>

                        {/* Progress Bar */}
                        <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-white h-full transition-all duration-500"
                                style={{
                                    width: `${(unit.levels.filter(l => isLessonCompleted(l.id)).length / unit.levels.length) * 100}%`
                                }}
                            />
                        </div>
                    </div>

                    {/* Levels Path */}
                    <div className="relative flex flex-col items-center gap-6">
                        {/* Connecting Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 -z-10"
                            style={{ transform: 'translateX(-50%)' }}
                        />

                        {unit.levels.map((level, index) => {
                            const unlocked = isLessonUnlocked(level.id);
                            const completed = isLessonCompleted(level.id);

                            // Zig-zag alignment
                            const align = index % 2 === 0 ? 'items-end pr-8' : 'items-start pl-8';
                            const labelAlign = index % 2 === 0 ? 'text-right' : 'text-left';

                            return (
                                <div key={level.id} className={cn("flex w-full", align)}>
                                    <div className="relative">
                                        {/* Lesson Node */}
                                        <button
                                            disabled={!unlocked}
                                            onClick={() => unlocked && navigate(`/lesson/${level.id}`)}
                                            className={cn(
                                                "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg relative z-10",
                                                completed
                                                    ? "bg-gradient-to-br from-green-400 to-green-600 border-4 border-green-700"
                                                    : unlocked
                                                        ? "bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-blue-700 hover:scale-110 active:scale-95"
                                                        : "bg-gray-300 border-4 border-gray-400 cursor-not-allowed"
                                            )}
                                        >
                                            {completed ? (
                                                <Check className="w-10 h-10 text-white stroke-[3px]" />
                                            ) : unlocked ? (
                                                <Star className="w-10 h-10 text-white fill-white" />
                                            ) : (
                                                <Lock className="w-8 h-8 text-gray-500" />
                                            )}
                                        </button>

                                        {/* Label */}
                                        <div className={cn("absolute top-1/2 -translate-y-1/2 w-48",
                                            index % 2 === 0 ? "right-24" : "left-24",
                                            labelAlign
                                        )}>
                                            <div className="bg-white px-4 py-2 rounded-xl shadow-md border-2 border-gray-100">
                                                <span className={cn(
                                                    "text-sm font-bold block mb-1",
                                                    completed ? "text-green-600" : unlocked ? "text-blue-600" : "text-gray-400"
                                                )}>
                                                    {level.title}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {completed ? "Completed!" : unlocked ? "Tap to start" : "Locked"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Bottom Spacer */}
            <div className="h-20" />
        </div>
    );
}
