import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, DollarSign, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { cn } from '../../lib/utils';
import useStore from '../../store/useStore';

const EVENTS = {
    1: [
        { text: 'Medical emergency - need ₹3,000', cost: 3000, category: 'emergency' },
        { text: 'Car repair - ₹2,500', cost: 2500, category: 'emergency' },
    ],
    2: [
        { text: "Friend's wedding - gift ₹5,000", cost: 5000, category: 'social' },
        { text: 'Phone upgrade temptation - ₹8,000', cost: 8000, category: 'want' },
    ],
    3: [
        { text: 'Laptop needed for work - ₹15,000', cost: 15000, category: 'need' },
        { text: 'Home appliance broke - ₹6,000', cost: 6000, category: 'emergency' },
    ],
};

export default function BudgetChallenge({ onComplete }) {
    const { wallet, addMoney, deductMoney } = useStore();

    const [step, setStep] = useState('intro'); // 'intro', 'allocate', 'month', 'result'
    const [budget, setBudget] = useState({
        rent: 8000,
        food: 5000,
        transport: 2000,
        savings: 5000,
        fun: 5000,
    });
    const [currentMonth, setCurrentMonth] = useState(1);
    const [simulationStartBalance, setSimulationStartBalance] = useState(0);
    const [totalSavingsAccumulated, setTotalSavingsAccumulated] = useState(0);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [decisions, setDecisions] = useState([]);

    const SALARY = 25000;
    const totalAllocated = Object.values(budget).reduce((sum, val) => sum + val, 0);

    const startChallenge = () => {
        setSimulationStartBalance(wallet.balance);
        setStep('month');
        setCurrentMonth(1);

        // Add monthly salary to real wallet
        addMoney(SALARY, 'Budget Challenge: Month 1 Salary');

        // Trigger first month event
        const event = EVENTS[1][Math.floor(Math.random() * EVENTS[1].length)];
        setCurrentEvent(event);
    };

    const handleEventDecision = (payNow) => {
        const decision = {
            month: currentMonth,
            event: currentEvent.text,
            choice: payNow ? 'Paid' : 'Skipped',
            impact: payNow ? -currentEvent.cost : 0,
        };

        setDecisions([...decisions, decision]);

        if (payNow) {
            // Deduct from real wallet
            deductMoney(currentEvent.cost, `Budget Challenge: ${currentEvent.text}`);
        }

        setCurrentEvent(null);
        proceedToNextMonth();
    };

    const proceedToNextMonth = () => {
        // Track savings accumulated this month
        const monthlySavings = budget.savings;
        setTotalSavingsAccumulated(prev => prev + monthlySavings);

        if (currentMonth < 3) {
            setTimeout(() => {
                const nextMonth = currentMonth + 1;
                setCurrentMonth(nextMonth);

                // Add next month's salary to real wallet
                addMoney(SALARY, `Budget Challenge: Month ${nextMonth} Salary`);

                // Trigger event for next month
                const event = EVENTS[nextMonth][Math.floor(Math.random() * EVENTS[nextMonth].length)];
                setCurrentEvent(event);
            }, 1000);
        } else {
            setStep('result');
        }
    };

    const getGrade = () => {
        const netChange = wallet.balance - simulationStartBalance;

        if (netChange < 0) return 'F'; // Lost money
        if (netChange >= 12000) return 'A';
        if (netChange >= 9000) return 'B';
        if (netChange >= 6000) return 'C';
        return 'D';
    };

    const grade = getGrade();

    return (
        <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {/* Intro */}
                {step === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <div className="text-6xl mb-4">💰</div>
                            <h2 className="text-3xl font-bold mb-4">3-Month Budget Challenge</h2>
                            <p className="text-gray-600">Can you manage your finances wisely?</p>
                        </div>

                        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                            <h3 className="font-bold mb-4">The Challenge:</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>✅ Salary: ₹25,000/month</li>
                                <li>✅ Allocate budget wisely</li>
                                <li>✅ Handle surprise expenses</li>
                                <li>✅ Try to save money</li>
                                <li>❌ Don't go into debt!</li>
                            </ul>
                        </Card>

                        <Button variant="primary" className="w-full" onClick={() => setStep('allocate')}>
                            Start Challenge
                            <ArrowRight className="ml-2" />
                        </Button>
                    </motion.div>
                )}

                {/* Allocate Budget */}
                {step === 'allocate' && (
                    <motion.div
                        key="allocate"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-2">Set Your Monthly Budget</h2>
                            <p className="text-gray-600">Salary: ₹{SALARY.toLocaleString()}/month</p>
                        </div>

                        <div className="space-y-4">
                            {Object.keys(budget).map(category => (
                                <div key={category}>
                                    <div className="flex justify-between mb-2">
                                        <label className="font-semibold capitalize">{category}</label>
                                        <span className="font-bold">₹{budget[category].toLocaleString()}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        step="500"
                                        value={budget[category]}
                                        onChange={(e) => setBudget({ ...budget, [category]: parseInt(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>
                            ))}
                        </div>

                        <Card className={cn(
                            "p-4",
                            totalAllocated === SALARY ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
                        )}>
                            <div className="flex justify-between items-center">
                                <span className="font-bold">Total Allocated</span>
                                <span className={cn(
                                    "text-2xl font-bold",
                                    totalAllocated === SALARY ? "text-green-600" : "text-red-600"
                                )}>
                                    ₹{totalAllocated.toLocaleString()}
                                </span>
                            </div>
                            {totalAllocated !== SALARY && (
                                <p className="text-sm text-red-600 mt-2">
                                    {totalAllocated > SALARY ? 'Over budget!' : 'Under budget!'} (₹{Math.abs(SALARY - totalAllocated).toLocaleString()})
                                </p>
                            )}
                        </Card>

                        <Button
                            variant="primary"
                            className="w-full"
                            disabled={totalAllocated !== SALARY}
                            onClick={startChallenge}
                        >
                            Lock Budget & Start
                        </Button>
                    </motion.div>
                )}

                {/* Event Handling */}
                {step === 'month' && currentEvent && (
                    <motion.div
                        key={`event-${currentMonth}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-2">Month {currentMonth}</h2>
                            <div className="text-6xl my-6">⚠️</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Surprise Expense!</h3>
                            <p className="text-xl text-gray-600">{currentEvent.text}</p>
                        </div>

                        <Card className="bg-red-50 border-red-300 p-6 text-center">
                            <p className="text-sm text-gray-600 mb-2">Cost</p>
                            <p className="text-4xl font-bold text-red-600">₹{currentEvent.cost.toLocaleString()}</p>
                        </Card>

                        <Card className="bg-blue-50 p-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Current Balance</span>
                                    <span className="font-bold">₹{wallet.balance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Savings Buffer</span>
                                    <span className="font-bold">₹{budget.savings.toLocaleString()}</span>
                                </div>
                            </div>
                        </Card>

                        <div className="flex gap-3">
                            <Button variant="danger" onClick={() => handleEventDecision(true)} className="flex-1">
                                Pay Now
                                <AlertTriangle className="ml-2" />
                            </Button>
                            <Button variant="outline" onClick={() => handleEventDecision(false)} className="flex-1">
                                Skip (Risky!)
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Result */}
                {step === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <div className="text-8xl mb-4">
                                {grade === 'A' || grade === 'B' ? '🎉' : grade === 'F' ? '😰' : '😐'}
                            </div>
                            <h2 className="text-5xl font-bold mb-2">Grade: {grade}</h2>
                        </div>

                        <Card className={cn(
                            "p-6",
                            wallet.balance >= simulationStartBalance ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
                        )}>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Starting Balance</span>
                                    <span className="text-xl font-bold">
                                        ₹{simulationStartBalance.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Current Balance</span>
                                    <span className="text-2xl font-bold text-green-600">
                                        ₹{wallet.balance.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-t pt-2">
                                    <span className="font-semibold">Net Change</span>
                                    <span className={cn("text-2xl font-bold",
                                        wallet.balance >= simulationStartBalance ? "text-green-600" : "text-red-600")}>
                                        {wallet.balance >= simulationStartBalance ? '+' : ''}₹{(wallet.balance - simulationStartBalance).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                            <h3 className="font-bold text-lg mb-3">Your Decisions:</h3>
                            <div className="space-y-2">
                                {decisions.map((d, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span>Month {d.month}: {d.event}</span>
                                        <span className={cn("font-bold", d.choice === 'Paid' ? "text-red-600" : "text-gray-500")}>
                                            {d.choice}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                            <p className="font-bold text-yellow-800 mb-2">💡 Key Takeaway</p>
                            <p className="text-sm text-yellow-900">
                                {wallet.balance >= simulationStartBalance
                                    ? "Great job managing your budget! You increased your real wallet balance through smart financial decisions."
                                    : "Budget management is crucial! Plan your expenses and build an emergency fund to handle surprises."}
                            </p>
                        </div>

                        <Button variant="primary" className="w-full" onClick={onComplete}>
                            Continue Learning
                            <ArrowRight className="ml-2" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
