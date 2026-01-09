import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wallet, CreditCard, Smartphone, Coins, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import AIIntroduction from '../ai/AIIntroduction';
import AILearningSummary from '../ai/AILearningSummary';
import { SIMULATOR_CONFIGS } from '../../config/simulatorConfigs';

const FIXED_EXPENSES = [
    { id: 1, text: "Lunch with friends 🍔", cost: 300, category: 'food' },
    { id: 2, text: "Auto to college 🚕", cost: 150, category: 'transport' },
    { id: 3, text: "Phone recharge 📱", cost: 500, category: 'bill' },
    { id: 4, text: "Movie tickets 🎬", cost: 400, category: 'entertainment' },
    { id: 5, text: "Friend's birthday gift 🎁", cost: 1500, category: 'social' },
    { id: 6, text: "Internet bill 🌐", cost: 600, category: 'bill' },
    { id: 7, text: "New shoes 👟", cost: 2000, category: 'shopping' },
    { id: 8, text: "Electricity bill 💡", cost: 1200, category: 'bill' },
    { id: 9, text: "Phone screen repair 📱💔", cost: 3500, category: 'emergency', emiEligible: true },
    { id: 10, text: "Weekend trip ✈️", cost: 4000, category: 'social', emiEligible: true }
];

export default function MoneyMonth({ onComplete }) {
    const [balance, setBalance] = useState(10000);
    const [step, setStep] = useState('ai-intro');
    const [currentExpenseIndex, setCurrentExpenseIndex] = useState(0);
    const [monthlyIncome] = useState(10000);
    const [creditCardBill, setCreditCardBill] = useState(0);
    const [emiPayments, setEmiPayments] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [startBalance, setStartBalance] = useState(0);

    const currentExpense = FIXED_EXPENSES[currentExpenseIndex];
    const totalExpenses = FIXED_EXPENSES.length;

    const startSimulation = () => {
        setStartBalance(balance);
        setStep('expenses');
    };

    const moveToNextExpense = () => {
        if (currentExpenseIndex + 1 >= totalExpenses) {
            setStep('month-end');
        } else {
            setCurrentExpenseIndex(prev => prev + 1);
        }
    };

    const recordTransaction = (method, expense) => {
        setTransactions(prev => [...prev, {
            expense: expense.text,
            cost: expense.cost,
            method: method,
            success: true
        }]);
    };

    const handlePayment = (method) => {
        if (!currentExpense) return;

        switch (method) {
            case 'cash':
            case 'upi':
                if (balance >= currentExpense.cost) {
                    setBalance(prev => prev - currentExpense.cost);
                    recordTransaction(method, currentExpense);
                    moveToNextExpense();
                } else {
                    alert('Insufficient balance! Try another payment method.');
                    return;
                }
                break;

            case 'credit':
                setCreditCardBill(prev => prev + currentExpense.cost);
                recordTransaction(method, currentExpense);
                moveToNextExpense();
                break;

            case 'emi':
                if (!currentExpense.emiEligible || currentExpense.cost < 3000) {
                    alert('EMI not available for this purchase (minimum ₹3,000)');
                    return;
                }
                const emiAmount = Math.round(currentExpense.cost / 3 * 1.12);
                setEmiPayments(prev => [...prev, {
                    name: currentExpense.text,
                    total: emiAmount * 3,
                    monthly: emiAmount,
                    remaining: 3
                }]);
                recordTransaction(method, currentExpense);
                moveToNextExpense();
                break;
        }
    };

    const handleMonthEnd = () => {
        let finalBalance = balance;
        emiPayments.forEach(emi => {
            finalBalance -= emi.monthly;
        });

        if (creditCardBill > 0) {
            if (finalBalance >= creditCardBill) {
                finalBalance -= creditCardBill;
                setCreditCardBill(0);
            } else {
                const interest = Math.round(creditCardBill * 0.18 / 12);
                const payment = Math.min(finalBalance, creditCardBill);
                finalBalance -= payment;
                setCreditCardBill(prev => prev - payment + interest);
            }
        }

        setBalance(finalBalance);
        setStep('ai-summary');
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {step === 'ai-intro' && (
                    <AIIntroduction
                        simulationConfig={SIMULATOR_CONFIGS.moneyMonth}
                        onComplete={() => setStep('setup')}
                    />
                )}

                {step === 'setup' && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <div className="text-6xl mb-4">💰</div>
                            <h2 className="text-3xl font-bold mb-2">Money Month Challenge</h2>
                            <p className="text-gray-600">Manage your money wisely!</p>
                        </div>

                        <Card className="bg-gradient-to-br from-green-50 to-blue-50 p-6">
                            <h3 className="font-bold mb-4 text-lg">The Challenge:</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>💵 Monthly Pocket Money: <span className="font-bold text-green-600">₹10,000</span></li>
                                <li>📋 Total Expenses: <span className="font-bold">{totalExpenses} purchases</span></li>
                                <li>🎯 Goal: End with money left!</li>
                                <li>💳 Choose payment methods smartly</li>
                            </ul>
                        </Card>

                        <Button variant="primary" className="w-full text-lg py-4" onClick={startSimulation}>
                            Start Challenge
                            <ArrowRight className="ml-2" />
                        </Button>
                    </motion.div>
                )}

                {step === 'expenses' && currentExpense && (
                    <motion.div
                        key={currentExpenseIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <p className="text-lg font-bold text-purple-600 mb-2">
                                Expense {currentExpenseIndex + 1} of {totalExpenses}
                            </p>
                        </div>

                        <Card className="bg-gradient-to-r from-green-50 to-blue-50 p-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">💰 Balance</span>
                                <span className="text-2xl font-bold text-green-600">₹{balance.toLocaleString()}</span>
                            </div>
                            {creditCardBill > 0 && (
                                <div className="text-sm text-red-600 mt-2">
                                    💳 Credit Bill: ₹{creditCardBill.toLocaleString()}
                                </div>
                            )}
                        </Card>

                        <div className="text-center">
                            <div className="text-6xl mb-4">💸</div>
                            <h3 className="text-2xl font-bold mb-2">New Expense!</h3>
                            <p className="text-xl text-gray-700">{currentExpense.text}</p>
                        </div>

                        <Card className="bg-red-50 border-red-300 p-6 text-center">
                            <p className="text-sm text-gray-600 mb-2">Amount</p>
                            <p className="text-5xl font-bold text-red-600">₹{currentExpense.cost.toLocaleString()}</p>
                        </Card>

                        <div className="space-y-3">
                            <p className="text-center font-semibold text-gray-700">Choose Payment Method:</p>

                            <Button
                                variant={balance >= currentExpense.cost ? "primary" : "outline"}
                                className="w-full justify-between text-left"
                                onClick={() => handlePayment('cash')}
                                disabled={balance < currentExpense.cost}
                            >
                                <span className="flex items-center gap-2">
                                    <Coins className="w-5 h-5" />
                                    Cash - Pay Now
                                </span>
                                <span className="text-sm">
                                    {balance >= currentExpense.cost ? '✅' : '❌ Insufficient'}
                                </span>
                            </Button>

                            <Button
                                variant={balance >= currentExpense.cost ? "primary" : "outline"}
                                className="w-full justify-between text-left"
                                onClick={() => handlePayment('upi')}
                                disabled={balance < currentExpense.cost}
                            >
                                <span className="flex items-center gap-2">
                                    <Smartphone className="w-5 h-5" />
                                    UPI - Digital Payment
                                </span>
                                <span className="text-sm">
                                    {balance >= currentExpense.cost ? '✅' : '❌ Insufficient'}
                                </span>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full justify-between text-left border-orange-300 hover:bg-orange-50"
                                onClick={() => handlePayment('credit')}
                            >
                                <span className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Credit Card - Pay Later
                                </span>
                                <span className="text-sm text-orange-600">18% interest</span>
                            </Button>

                            {currentExpense.emiEligible && (
                                <Button
                                    variant="outline"
                                    className="w-full justify-between text-left border-purple-300 hover:bg-purple-50"
                                    onClick={() => handlePayment('emi')}
                                >
                                    <span className="flex items-center gap-2">
                                        <Wallet className="w-5 h-5" />
                                        EMI - 3 Months
                                    </span>
                                    <span className="text-sm text-purple-600">
                                        ₹{Math.round(currentExpense.cost / 3 * 1.12)}/month
                                    </span>
                                </Button>
                            )}
                        </div>
                    </motion.div>
                )}

                {step === 'month-end' && (
                    <motion.div
                        key="month-end"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <div className="text-8xl mb-4">📅</div>
                            <h2 className="text-3xl font-bold mb-2">Month End</h2>
                            <p className="text-gray-600">Time to settle bills!</p>
                        </div>

                        {creditCardBill > 0 && (
                            <Card className="bg-red-50 border-red-300 p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                    <h3 className="font-bold text-lg">Credit Card Bill Due</h3>
                                </div>
                                <p className="text-3xl font-bold text-red-600 mb-2">₹{creditCardBill.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">
                                    {balance >= creditCardBill ? '✅ You can pay the full amount' : '⚠️ Partial payment - interest charged'}
                                </p>
                            </Card>
                        )}

                        <Card className="bg-blue-50 p-4">
                            <p className="text-sm text-gray-600">Current Balance</p>
                            <p className="text-3xl font-bold text-blue-600">₹{balance.toLocaleString()}</p>
                        </Card>

                        <Button variant="primary" className="w-full text-lg py-4" onClick={handleMonthEnd}>
                            Process Month-End Payments
                            <ArrowRight className="ml-2" />
                        </Button>
                    </motion.div>
                )}

                {step === 'ai-summary' && (
                    <AILearningSummary
                        simulationConfig={SIMULATOR_CONFIGS.moneyMonth}
                        simulationData={{
                            salary: monthlyIncome,
                            expenses: transactions.reduce((sum, t) => sum + t.cost, 0),
                            loanAmount: creditCardBill,
                            months: 1,
                            missedPayments: 0,
                            finalBalance: balance,
                            eventHistory: transactions.map(t => ({
                                paid: t.success,
                                method: t.method,
                                cost: t.cost
                            }))
                        }}
                        onContinue={onComplete}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
