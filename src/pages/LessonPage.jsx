import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';
import { LESSON_CONTENT } from '../data/curriculum';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LessonCompleteModal from '../components/modals/LessonCompleteModal';
import SimulationWrapper from '../components/simulations/SimulationWrapper';
import { cn } from '../lib/utils';
import canvasConfetti from 'canvas-confetti';

export default function LessonPage() {
    const { levelId } = useParams();
    const navigate = useNavigate();
    const { user, wallet, addXp, loseHeart, completeLesson, isLessonUnlocked } = useStore();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [balanceBefore, setBalanceBefore] = useState(0);
    const [balanceAfter, setBalanceAfter] = useState(0);

    const content = LESSON_CONTENT[levelId];

    // Handle case where content doesn't exist or lesson is locked
    if (!content || !isLessonUnlocked(levelId)) {
        return (
            <div className="pt-24 px-6 text-center">
                <h1 className="text-2xl font-bold mb-4">
                    {!content ? "Content Coming Soon!" : "This lesson is locked!"}
                </h1>
                <p className="text-gray-500 mb-4">
                    {!content
                        ? "It looks like the content didn't load correctly. Please try restarting the server."
                        : "Complete the previous lesson to unlock this one."}
                </p>
                <Button onClick={() => navigate('/')}>Go Back</Button>
            </div>
        );
    }

    const currentItem = content[currentIndex];
    const progress = ((currentIndex) / content.length) * 100;

    const handleOptionSelect = (index) => {
        if (isAnswered) return;
        setSelectedOption(index);
    };

    const handleCheck = () => {
        if (currentItem.type === 'explanation') {
            handleNext();
            return;
        }

        if (selectedOption === null) return;

        const correct = currentItem.options[selectedOption].correct;
        setIsAnswered(true);
        setIsCorrect(correct);

        if (correct) {
            setCorrectCount(prev => prev + 1);
        } else {
            loseHeart();
        }
    };

    const handleNext = () => {
        if (currentIndex < content.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setIsCorrect(false);
        } else {
            // Lesson Complete
            const totalQuestions = content.filter(item => item.type !== 'explanation').length;
            const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;

            canvasConfetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Capture balance before and after for modal display
            const beforeBalance = wallet.balance;
            completeLesson(levelId, 50, 200);
            setBalanceBefore(beforeBalance);
            setBalanceAfter(beforeBalance + 200);
            setShowCompleteModal(true);
        }
    };

    const handleContinue = () => {
        // Try to go to next lesson
        const lessonNum = parseInt(levelId.substring(1));
        const nextLessonId = `l${lessonNum + 1}`;

        // Check if next lesson exists in content
        if (LESSON_CONTENT[nextLessonId]) {
            navigate(`/lesson/${nextLessonId}`);
        } else {
            navigate('/');
        }
    };

    if (showCompleteModal) {
        const totalQuestions = content.filter(item => item.type !== 'explanation').length;
        const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;

        return (
            <LessonCompleteModal
                onContinue={handleContinue}
                onHome={() => navigate('/')}
                xpEarned={50}
                moneyEarned={200}
                accuracy={accuracy}
                balanceBefore={balanceBefore}
                balanceAfter={balanceAfter}
            />
        );
    }

    return (
        <div className="min-h-screen bg-off-white flex flex-col">
            {/* Header */}
            <div className="px-4 py-6 flex items-center justify-between bg-white border-b border-gray-100">
                <X className="w-8 h-8 text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => navigate('/')} />

                {/* Progress Bar */}
                <div className="flex-1 mx-4 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-brand-green"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <div className="flex items-center gap-1 text-brand-red font-bold">
                    <Heart className="fill-brand-red" />
                    <span>{user.hearts}</span>
                </div>
            </div>

            {/* Question Counter */}
            <div className="px-6 py-3 text-center">
                <span className="text-sm font-bold text-gray-500">
                    Question {currentIndex + 1} of {content.length}
                </span>
            </div>

            {/* Content Area */}
            <div className="flex-1 px-6 pb-32 flex flex-col justify-center max-w-2xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Title / Question */}
                        <h1 className="text-3xl font-bold text-gray-800">
                            {currentItem.title || currentItem.question}
                        </h1>

                        {/* Explanation Content */}
                        {currentItem.type === 'explanation' && (
                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 mb-4">
                                <div className="flex gap-4">
                                    <MessageCircle className="w-12 h-12 text-brand-blue shrink-0" />
                                    <p className="text-lg text-gray-700 leading-relaxed">{currentItem.content}</p>
                                </div>
                            </Card>
                        )}

                        {/* Simulation */}
                        {currentItem.type === 'simulation' && (
                            <SimulationWrapper
                                type={currentItem.simulationType}
                                config={currentItem.config}
                                onComplete={handleNext}
                            />
                        )}

                        {/* Options (Quiz/Scenario) */}
                        {(currentItem.type === 'quiz' || currentItem.type === 'scenario') && (
                            <div className="flex flex-col gap-3">
                                {currentItem.options.map((opt, idx) => (
                                    <Card
                                        key={idx}
                                        onClick={() => handleOptionSelect(idx)}
                                        className={cn(
                                            "cursor-pointer transition-all border-2 hover:shadow-lg",
                                            selectedOption === idx
                                                ? (isAnswered
                                                    ? (opt.correct ? "border-green-500 bg-green-50 shadow-green-200" : "border-red-500 bg-red-50 shadow-red-200")
                                                    : "border-blue-500 bg-blue-50 shadow-blue-200 scale-105")
                                                : isAnswered && opt.correct
                                                    ? "border-green-500 bg-green-50" // Show correct answer
                                                    : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-lg">{opt.text}</span>
                                            {isAnswered && (
                                                <>
                                                    {selectedOption === idx && (
                                                        opt.correct
                                                            ? <CheckCircle className="text-green-600 w-6 h-6" />
                                                            : <AlertCircle className="text-red-600 w-6 h-6" />
                                                    )}
                                                    {selectedOption !== idx && opt.correct && (
                                                        <CheckCircle className="text-green-600 w-6 h-6" />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer / Controls */}
            <div className={cn(
                "fixed bottom-0 w-full p-6 border-t-2 transition-all duration-300",
                isAnswered
                    ? (isCorrect ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300")
                    : "bg-white border-gray-200"
            )}>
                <div className="max-w-2xl mx-auto flex flex-col gap-4">
                    {isAnswered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-bold text-lg flex items-center gap-2"
                        >
                            {isCorrect ? (
                                <>
                                    <CheckCircle className="text-green-600" />
                                    <span className="text-green-700">Awesome! That's correct!</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="text-red-600" />
                                    <span className="text-red-700">Not quite right. Try again!</span>
                                </>
                            )}
                        </motion.div>
                    )}

                    <Button
                        variant={isAnswered ? (isCorrect ? 'primary' : 'danger') : 'primary'}
                        className="w-full text-lg uppercase tracking-wide py-4"
                        onClick={isAnswered ? handleNext : handleCheck}
                        disabled={!isAnswered && currentItem.type !== 'explanation' && selectedOption === null}
                    >
                        {isAnswered ? "Continue" : (currentItem.type === 'explanation' ? "Continue" : "Check")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
