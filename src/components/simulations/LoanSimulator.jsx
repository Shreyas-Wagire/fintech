import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, AlertCircle, CheckCircle, Zap, TrendingDown, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { cn } from '../../lib/utils';
import useStore from '../../store/useStore';

const RANDOM_EVENTS = [
    { text: "Phone screen cracked! Repair needed", cost: 2000, icon: '📱', type: 'emergency' },
    { text: "Electricity bill arrived", cost: 1500, icon: '💡', type: 'bill' },
    { text: "Birthday gift for friend", cost: 1000, icon: '🎁', type: 'social' },
    { text: "Medical checkup required", cost: 2500, icon: '🏥', type: 'emergency' },
    { text: "Car/Bike repair", cost: 3000, icon: '🔧', type: 'emergency' },
    { text: "Internet bill due", cost: 800, icon: '🌐', type: 'bill' },
    { text: "Groceries needed", cost: 4000, icon: '🛒', type: 'essential' },
];

export default function LoanSimulator({ onComplete }) {
    const { wallet, takeLoan, deductMoney } = useStore();

    const [step, setStep] = useState('choose'); // 'choose', 'setup', 'simulation', 'result'
    const [selectedItem, setSelectedItem] = useState(null);
    const [loanTerms, setLoanTerms] = useState({ months: 12, interestRate: 12 });
    const [currentMonth, setCurrentMonth] = useState(0);
    const [simulationStartBalance, setSimulationStartBalance] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);
    const [missedPayments, setMissedPayments] = useState(0);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [eventHistory, setEventHistory] = useState([]);
    const [activeLoanId, setActiveLoanId] = useState(null);

    const ITEMS = [
        { id: 'bike', name: 'Bike', price: 30000, icon: '🏍️', emoji: '🏍️' },
        { id: 'phone', name: 'Smartphone', price: 50000, icon: '📱', emoji: '📱' },
        { id: 'laptop', name: 'Laptop', price: 80000, icon: '💻', emoji: '💻' },
    ];

    const SALARY = 20000;

    // Calculate EMI
    const calculateEMI = (principal, rate, months) => {
        const monthlyRate = rate / 12 / 100;
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);
        return Math.round(emi);
    };

    const emi = selectedItem ? calculateEMI(selectedItem.price, loanTerms.interestRate, loanTerms.months) : 0;
    const totalAmount = emi * loanTerms.months;
    const interestPaid = totalAmount - (selectedItem?.price || 0);

    const startSimulation = () => {
        // Take the actual loan in the real wallet!
        const loanId = Date.now();
        takeLoan(selectedItem.price, loanTerms.months, loanTerms.interestRate, `Loan Simulation: ${selectedItem.name}`);

        setActiveLoanId(loanId);
        setSimulationStartBalance(wallet.balance);
        setStep('simulation');
        setCurrentMonth(1);
        processMonth();
    };

    const processMonth = () => {
        // Generate random event (50% chance)
        if (Math.random() > 0.5 && currentMonth < loanTerms.months) {
            const randomEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
            setCurrentEvent(randomEvent);
        } else {
            proceedToNextMonth();
        }
    };

    const handleEventChoice = (pay) => {
        if (pay) {
            deductMoney(currentEvent.cost, `Loan Simulation: ${currentEvent.text}`);
            setEventHistory([...eventHistory, { ...currentEvent, paid: true, month: currentMonth }]);

            if (wallet.balance < 0) {
                // Went into debt
                setMissedPayments(prev => prev + 1);
            }
        } else {
            setEventHistory([...eventHistory, { ...currentEvent, paid: false, month: currentMonth }]);
        }
        setCurrentEvent(null);
        proceedToNextMonth();
    };

    const proceedToNextMonth = () => {
        // Deduct EMI from real wallet
        deductMoney(emi, `Loan Simulation: Monthly EMI Payment`);
        setTotalPaid(prev => prev + emi);

        if (wallet.balance < 0) {
            setMissedPayments(prev => prev + 1);
        }

        if (currentMonth >= loanTerms.months) {
            setStep('result');
        } else {
            setTimeout(() => {
                setCurrentMonth(prev => prev + 1);
                processMonth();
            }, 2000); // Increased from 500ms to 2000ms for better readability
        }
    };

    const isWorthIt = missedPayments === 0 && interestPaid < selectedItem?.price * 0.2;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {/* Step 1: Choose Item */}
                {step === 'choose' && (
                    <motion.div
                        key="choose"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-2">What do you want to buy?</h2>
                            <p className="text-gray-600">Choose an item to buy on loan</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {ITEMS.map(item => (
                                <Card
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className={cn(
                                        "cursor-pointer transition-all hover:scale-105 text-center p-6",
                                        selectedItem?.id === item.id ? "border-4 border-blue-500 bg-blue-50" : "border-2"
                                    )}
                                >
                                    <div className="text-6xl mb-4">{item.emoji}</div>
                                    <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                                    <p className="text-2xl font-bold text-blue-600">₹{item.price.toLocaleString()}</p>
                                </Card>
                            ))}
                        </div>

                        <Button
                            variant="primary"
                            className="w-full"
                            disabled={!selectedItem}
                            onClick={() => setStep('setup')}
                        >
                            Next: Choose Loan Terms
                            <ArrowRight className="ml-2" />
                        </Button>
                    </motion.div>
                )}

                {/* Step 2: Loan Setup */}
                {step === 'setup' && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">{selectedItem.emoji}</div>
                            <h2 className="text-3xl font-bold mb-2">Loan Terms for {selectedItem.name}</h2>
                            <p className="text-gray-600">Price: ₹{selectedItem.price.toLocaleString()}</p>
                        </div>

                        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-bold mb-2">Loan Duration</label>
                                    <div className="flex gap-2">
                                        {[6, 12, 24].map(m => (
                                            <button
                                                key={m}
                                                onClick={() => setLoanTerms({ ...loanTerms, months: m })}
                                                className={cn(
                                                    "flex-1 py-3 rounded-xl font-bold transition-all",
                                                    loanTerms.months === m
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-white border-2 border-gray-200"
                                                )}
                                            >
                                                {m} months
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Monthly EMI</span>
                                        <span className="font-bold text-xl">₹{emi.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Amount to Pay</span>
                                        <span className="font-bold text-xl">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Interest Paid</span>
                                        <span className="font-bold text-xl text-red-600">₹{interestPaid.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setStep('choose')} className="flex-1">
                                <ArrowLeft className="mr-2" />
                                Back
                            </Button>
                            <Button variant="primary" onClick={startSimulation} className="flex-1">
                                Start Simulation
                                <Zap className="ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Month Simulation */}
                {step === 'simulation' && !currentEvent && (
                    <motion.div
                        key={`month-${currentMonth}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <motion.h2
                                className="text-5xl font-bold mb-2 text-blue-600"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, type: 'spring' }}
                            >
                                Month {currentMonth}
                            </motion.h2>
                            <p className="text-gray-600 text-lg">Processing payments...</p>
                            <p className="text-sm text-gray-500 mt-2">Balance updating...</p>
                        </div>

                        <Card className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8 border-2 border-blue-200">
                            <div className="space-y-6 text-center">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <p className="text-sm text-gray-600 font-semibold">EMI Deducted</p>
                                    <p className="text-4xl font-bold text-red-600">-₹{emi.toLocaleString()}</p>
                                </motion.div>
                                <motion.div
                                    className="pt-4 border-t-2 border-blue-200"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <p className="text-sm text-gray-600 font-semibold mb-2">Current Balance</p>
                                    <p className={cn("text-5xl font-bold", wallet.balance >= 0 ? "text-blue-600" : "text-red-600")}>
                                        ₹{wallet.balance.toLocaleString()}
                                    </p>
                                </motion.div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Event Popup */}
                {currentEvent && (
                    <motion.div
                        key="event"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <motion.div
                                className="text-7xl mb-4"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.5, repeat: 2 }}
                            >
                                {currentEvent.icon}
                            </motion.div>
                            <h2 className="text-3xl font-bold mb-3 text-red-600">Surprise Expense!</h2>
                            <p className="text-2xl text-gray-700 font-semibold">{currentEvent.text}</p>
                        </div>

                        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 p-6 text-center">
                            <p className="text-sm text-gray-600 mb-2 font-semibold">Cost Required</p>
                            <p className="text-5xl font-bold text-red-600">₹{currentEvent.cost.toLocaleString()}</p>
                        </Card>

                        <Card className="bg-blue-50 border-blue-200 p-4">
                            <p className="text-base font-semibold mb-2 text-gray-700">Your Current Balance: ₹{wallet.balance.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">
                                After this expense: <span className={cn("font-bold", (wallet.balance - currentEvent.cost) >= 0 ? "text-green-600" : "text-red-600")}>
                                    ₹{(wallet.balance - currentEvent.cost).toLocaleString()}
                                </span>
                            </p>
                        </Card>

                        <div className="flex gap-3">
                            <Button
                                variant="danger"
                                onClick={() => handleEventChoice(true)}
                                className="flex-1 text-lg py-4"
                            >
                                Pay Now
                                <TrendingDown className="ml-2" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleEventChoice(false)}
                                className="flex-1 text-lg py-4"
                            >
                                Skip (Risk it!)
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Step 4: Result */}
                {step === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="text-8xl mb-4">{isWorthIt ? '🎉' : '😰'}</div>
                            <h2 className="text-4xl font-bold mb-2">
                                {isWorthIt ? 'Well Managed!' : 'Tough Journey!'}
                            </h2>
                        </div>

                        <Card className={cn("p-6", isWorthIt ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300")}>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Item Cost</span>
                                    <span className="text-xl font-bold">₹{selectedItem.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Total Paid</span>
                                    <span className="text-xl font-bold">₹{totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center border-t pt-2">
                                    <span className="font-semibold text-red-600">Interest Paid</span>
                                    <span className="text-2xl font-bold text-red-600">₹{interestPaid.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Missed Payments</span>
                                    <span className={cn("text-xl font-bold", missedPayments > 0 ? "text-red-600" : "text-green-600")}>
                                        {missedPayments}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                {isWorthIt ? <CheckCircle className="text-green-600" /> : <AlertCircle className="text-red-600" />}
                                Verdict
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {isWorthIt
                                    ? `Great job! You managed the loan well. The interest was reasonable (${((interestPaid / selectedItem.price) * 100).toFixed(1)}%) and you didn't miss any payments.`
                                    : `Think twice before taking loans! You paid ₹${interestPaid.toLocaleString()} extra in interest (${((interestPaid / selectedItem.price) * 100).toFixed(1)}% of the original price)${missedPayments > 0 ? ` and missed ${missedPayments} payment(s)` : ''}.`}
                            </p>
                        </Card>

                        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                            <p className="font-bold text-yellow-800 mb-2">💡 Key Takeaway</p>
                            <p className="text-sm text-yellow-900">
                                Loans cost extra money through interest. Only take loans for essential things, and choose the shortest duration you can afford!
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
