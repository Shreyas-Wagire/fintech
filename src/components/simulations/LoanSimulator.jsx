import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, AlertCircle, CheckCircle, Zap, TrendingDown, TrendingUp, DollarSign, Wallet, Receipt } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { cn } from '../../lib/utils';
import useStore from '../../store/useStore';
import AIIntroduction from '../ai/AIIntroduction';
import AILearningSummary from '../ai/AILearningSummary';
import { SIMULATOR_CONFIGS } from '../../config/simulatorConfigs';

const RANDOM_EVENTS = [
    { text: "Phone screen cracked! Repair needed", cost: 2000, icon: '📱', type: 'emergency' },
    { text: "Electricity bill arrived", cost: 1500, icon: '💡', type: 'bill' },
    { text: "Birthday gift for friend", cost: 1000, icon: '🎁', type: 'social' },
    { text: "Medical checkup required", cost: 2500, icon: '🏥', type: 'emergency' },
    { text: "Car/Bike repair", cost: 3000, icon: '🔧', type: 'emergency' },
    { text: "Internet bill due", cost: 800, icon: '🌐', type: 'bill' },
    { text: "Family celebration", cost: 1500, icon: '🎉', type: 'social' },
];

export default function LoanSimulator({ onComplete }) {
    // INTERNAL BALANCE - Based on salary input
    const [balance, setBalance] = useState(0); // Will be set when salary is chosen
    const [loanDebt, setLoanDebt] = useState(0); // Track loan separately

    const [step, setStep] = useState('intro');
    const [selectedItem, setSelectedItem] = useState(null);
    const [salary, setSalary] = useState(25000);
    const [monthlyExpenses, setMonthlyExpenses] = useState(15000);
    const [loanAmount, setLoanAmount] = useState(0);
    const [loanTerms, setLoanTerms] = useState({ months: 12, interestRate: 12 });
    const [currentMonth, setCurrentMonth] = useState(0);
    const [totalPaid, setTotalPaid] = useState(0);
    const [missedPayments, setMissedPayments] = useState(0);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [eventHistory, setEventHistory] = useState([]);
    const [monthlyLog, setMonthlyLog] = useState([]);

    const ITEMS = [
        { id: 'bike', name: 'Bike', price: 30000, icon: '🏍️', emoji: '🏍️' },
        { id: 'phone', name: 'Smartphone', price: 50000, icon: '📱', emoji: '📱' },
        { id: 'laptop', name: 'Laptop', price: 80000, icon: '💻', emoji: '💻' },
    ];

    // Calculate EMI
    const calculateEMI = (principal, rate, months) => {
        const monthlyRate = rate / 12 / 100;
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);
        return Math.round(emi);
    };

    const emi = loanAmount > 0 ? calculateEMI(loanAmount, loanTerms.interestRate, loanTerms.months) : 0;
    const totalAmount = emi * loanTerms.months;
    const interestPaid = totalAmount - loanAmount;
    const disposableIncome = salary - monthlyExpenses;

    const startSimulation = () => {
        // Take the actual loan in the real wallet!
        takeLoan(loanAmount, loanTerms.months, loanTerms.interestRate, `Loan Simulation: ${selectedItem.name}`);

        setStep('simulation');
        setCurrentMonth(1);
        setMonthlyLog([]);
        processMonth();
    };

    const processMonth = () => {
        // Start of month: receive salary
        const startBalance = wallet.balance;
        addMoney(salary, `Month ${currentMonth}: Salary`);

        // Deduct monthly expenses
        deductMoney(monthlyExpenses, `Month ${currentMonth}: Monthly Expenses`);

        // Generate random event (40% chance)
        if (Math.random() > 0.6 && currentMonth < loanTerms.months) {
            const randomEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
            setCurrentEvent(randomEvent);
        } else {
            proceedToNextMonth();
        }
    };

    const handleEventChoice = (pay) => {
        if (pay) {
            deductMoney(currentEvent.cost, `Month ${currentMonth}: ${currentEvent.text}`);
            setEventHistory([...eventHistory, { ...currentEvent, paid: true, month: currentMonth }]);
        } else {
            setEventHistory([...eventHistory, { ...currentEvent, paid: false, month: currentMonth }]);
        }
        setCurrentEvent(null);
        proceedToNextMonth();
    };

    const proceedToNextMonth = () => {
        // Deduct EMI from real wallet
        deductMoney(emi, `Month ${currentMonth}: Loan EMI Payment`);
        setTotalPaid(prev => prev + emi);

        // Check if went into negative balance (missed payment)
        if (wallet.balance < 0) {
            setMissedPayments(prev => prev + 1);
        }

        // Log this month
        setMonthlyLog(prev => [...prev, {
            month: currentMonth,
            balance: wallet.balance,
            missedPayment: wallet.balance < 0
        }]);

        if (currentMonth >= loanTerms.months) {
            setStep('result');
        } else {
            setTimeout(() => {
                setCurrentMonth(prev => prev + 1);
                processMonth();
            }, 2000);
        }
    };

    const isSuccessful = missedPayments === 0 && wallet.balance > 0;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {/* AI Introduction */}
                {step === 'intro' && (
                    <AIIntroduction
                        simulationConfig={SIMULATOR_CONFIGS.loan}
                        onComplete={() => setStep('choose')}
                    />
                )}

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
                            <h2 className="text-3xl font-bold mb-2">🎯 Loan & EMI Challenge</h2>
                            <p className="text-gray-600">What do you want to buy on loan?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {ITEMS.map(item => (
                                <Card
                                    key={item.id}
                                    onClick={() => {
                                        setSelectedItem(item);
                                        setLoanAmount(item.price);
                                    }}
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
                            onClick={() => setStep('salary')}
                        >
                            Next: Set Your Salary
                            <ArrowRight className="ml-2" />
                        </Button>
                    </motion.div>
                )}

                {/* Step 2: Set Salary */}
                {step === 'salary' && (
                    <motion.div
                        key="salary"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">💰</div>
                            <h2 className="text-3xl font-bold mb-2">What's Your Monthly Salary?</h2>
                            <p className="text-gray-600">This is how much you earn each month</p>
                        </div>

                        <Card className="bg-gradient-to-br from-green-50 to-blue-50 p-6">
                            <label className="block font-bold mb-4 text-lg">Monthly Salary</label>
                            <input
                                type="range"
                                min="15000"
                                max="50000"
                                step="1000"
                                value={salary}
                                onChange={(e) => setSalary(Number(e.target.value))}
                                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer mb-4"
                            />
                            <div className="text-center">
                                <p className="text-5xl font-bold text-green-600">₹{salary.toLocaleString()}</p>
                                <p className="text-sm text-gray-600 mt-2">per month</p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {[20000, 30000, 40000].map(amount => (
                                    <button
                                        key={amount}
                                        onClick={() => setSalary(amount)}
                                        className={cn(
                                            "py-2 rounded-lg font-semibold text-sm transition-all",
                                            salary === amount
                                                ? "bg-green-600 text-white"
                                                : "bg-white border-2 border-gray-200 hover:border-green-400"
                                        )}
                                    >
                                        ₹{amount.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setStep('choose')} className="flex-1">
                                <ArrowLeft className="mr-2" />
                                Back
                            </Button>
                            <Button variant="primary" onClick={() => setStep('expenses')} className="flex-1">
                                Next: Set Expenses
                                <ArrowRight className="ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Set Monthly Expenses */}
                {step === 'expenses' && (
                    <motion.div
                        key="expenses"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🏠</div>
                            <h2 className="text-3xl font-bold mb-2">Monthly Expenses</h2>
                            <p className="text-gray-600">Rent, food, utilities, transport</p>
                        </div>

                        <Card className="bg-gradient-to-br from-orange-50 to-red-50 p-6">
                            <label className="block font-bold mb-4 text-lg">Total Monthly Expenses</label>
                            <input
                                type="range"
                                min="5000"
                                max={salary - 1000}
                                step="500"
                                value={monthlyExpenses}
                                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                                className="w-full h-3 bg-red-200 rounded-lg appearance-none cursor-pointer mb-4"
                            />
                            <div className="text-center">
                                <p className="text-5xl font-bold text-red-600">₹{monthlyExpenses.toLocaleString()}</p>
                                <p className="text-sm text-gray-600 mt-2">per month</p>
                            </div>

                            {monthlyExpenses >= salary && (
                                <div className="mt-4 p-3 bg-red-100 border-2 border-red-400 rounded-lg">
                                    <p className="text-red-800 font-semibold text-sm">
                                        ⚠️ Expenses must be less than salary!
                                    </p>
                                </div>
                            )}
                        </Card>

                        <Card className="bg-blue-50 border-2 border-blue-300 p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">Monthly Salary</span>
                                <span className="text-green-600 font-bold">₹{salary.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">Monthly Expenses</span>
                                <span className="text-red-600 font-bold">-₹{monthlyExpenses.toLocaleString()}</span>
                            </div>
                            <div className="border-t-2 border-blue-300 pt-2 flex justify-between items-center">
                                <span className="font-bold text-lg">Disposable Income</span>
                                <span className={cn("text-2xl font-bold", disposableIncome > 0 ? "text-blue-600" : "text-red-600")}>
                                    ₹{disposableIncome.toLocaleString()}
                                </span>
                            </div>
                        </Card>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setStep('salary')} className="flex-1">
                                <ArrowLeft className="mr-2" />
                                Back
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => setStep('loan')}
                                className="flex-1"
                                disabled={monthlyExpenses >= salary}
                            >
                                Next: Set Loan
                                <ArrowRight className="ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* Step 4: Loan Setup */}
                {step === 'loan' && (
                    <motion.div
                        key="loan"
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
                                    <label className="block font-bold mb-2">Loan Amount</label>
                                    <input
                                        type="range"
                                        min={Math.min(selectedItem.price, 10000)}
                                        max={selectedItem.price}
                                        step="1000"
                                        value={loanAmount}
                                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                                        className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer mb-2"
                                    />
                                    <p className="text-3xl font-bold text-purple-600 text-center">
                                        ₹{loanAmount.toLocaleString()}
                                    </p>
                                </div>

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

                                {emi > disposableIncome && (
                                    <div className="p-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
                                        <p className="text-yellow-800 font-semibold text-sm">
                                            ⚠️ Warning: EMI (₹{emi.toLocaleString()}) is more than your disposable income (₹{disposableIncome.toLocaleString()})!
                                            <br />This will be very difficult to manage.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setStep('expenses')} className="flex-1">
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

                {/* Step 5: Month Simulation */}
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
                            <p className="text-gray-600 text-lg">Processing monthly cycle...</p>
                        </div>

                        <Card className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8 border-2 border-blue-200">
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-6 h-6 text-green-600" />
                                        <span className="font-semibold">Salary Received</span>
                                    </div>
                                    <span className="text-2xl font-bold text-green-600">+₹{salary.toLocaleString()}</span>
                                </motion.div>

                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-2">
                                        <Receipt className="w-6 h-6 text-red-600" />
                                        <span className="font-semibold">Expenses Paid</span>
                                    </div>
                                    <span className="text-2xl font-bold text-red-600">-₹{monthlyExpenses.toLocaleString()}</span>
                                </motion.div>

                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-2">
                                        <Wallet className="w-6 h-6 text-purple-600" />
                                        <span className="font-semibold">EMI Deducted</span>
                                    </div>
                                    <span className="text-2xl font-bold text-purple-600">-₹{emi.toLocaleString()}</span>
                                </motion.div>

                                <motion.div
                                    className="pt-4 border-t-2 border-blue-200"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <p className="text-sm text-gray-600 font-semibold mb-2 text-center">Current Balance</p>
                                    <p className={cn("text-5xl font-bold text-center", wallet.balance >= 0 ? "text-blue-600" : "text-red-600")}>
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

                {/* Step 6: Result */}
                {step === 'result' && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="text-8xl mb-4">{isSuccessful ? '🎉' : '😰'}</div>
                            <h2 className="text-4xl font-bold mb-2">
                                {isSuccessful ? 'Well Managed!' : 'Tough Journey!'}
                            </h2>
                            <p className="text-gray-600">
                                {isSuccessful
                                    ? 'You successfully managed your loan!'
                                    : 'Managing loans with limited income is challenging'}
                            </p>
                        </div>

                        <Card className={cn("p-6", isSuccessful ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300")}>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Item Cost</span>
                                    <span className="text-xl font-bold">₹{selectedItem.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Loan Amount</span>
                                    <span className="text-xl font-bold">₹{loanAmount.toLocaleString()}</span>
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
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Final Balance</span>
                                    <span className={cn("text-2xl font-bold", wallet.balance >= 0 ? "text-green-600" : "text-red-600")}>
                                        ₹{wallet.balance.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                {isSuccessful ? <CheckCircle className="text-green-600" /> : <AlertCircle className="text-red-600" />}
                                Verdict
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                {isSuccessful
                                    ? `Excellent job! You managed the loan well with a monthly salary of ₹${salary.toLocaleString()} and expenses of ₹${monthlyExpenses.toLocaleString()}. Your disciplined approach kept you financially stable.`
                                    : `Think twice before taking loans! With a salary of ₹${salary.toLocaleString()} and expenses of ₹${monthlyExpenses.toLocaleString()}, the EMI of ₹${emi.toLocaleString()} was challenging to manage${missedPayments > 0 ? ` and you missed ${missedPayments} payment(s)` : ''}.`}
                            </p>
                        </Card>

                        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                            <p className="font-bold text-yellow-800 mb-2">💡 Key Takeaways</p>
                            <ul className="text-sm text-yellow-900 space-y-1">
                                <li>• Keep EMI under 30-40% of your disposable income</li>
                                <li>• Maintain emergency funds for unexpected expenses</li>
                                <li>• Only take loans when absolutely necessary</li>
                                <li>• Plan your budget carefully before committing to a loan</li>
                            </ul>
                        </div>

                        <Button variant="primary" className="w-full" onClick={() => setStep('ai-summary')}>
                            See AI Learning Summary
                            <ArrowRight className="ml-2" />
                        </Button>
                    </motion.div>
                )}

                {/* AI Learning Summary */}
                {step === 'ai-summary' && (
                    <AILearningSummary
                        simulationConfig={SIMULATOR_CONFIGS.loan}
                        simulationData={{
                            salary,
                            expenses: monthlyExpenses,
                            loanAmount,
                            months: loanTerms.months,
                            missedPayments,
                            finalBalance: wallet.balance,
                            eventHistory
                        }}
                        onContinue={onComplete}
                    />
                )}
            </AnimatePresence >
        </div >
    );
}
