import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Shield, PiggyBank, Award } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import AIIntroduction from '../ai/AIIntroduction';
import { SIMULATOR_CONFIGS } from '../../config/simulatorConfigs';
import { analyzeDecisions } from '../../services/gemini';

const SCENARIOS = [
    {
        month: 2,
        title: "ELSS Investment Opportunity",
        description: "Your colleague suggests investing in ELSS (Equity Linked Saving Scheme) mutual funds",
        icon: "📈",
        info: "ELSS: 3-year lock-in, tax benefit up to ₹1.5L under 80C, market-linked returns",
        question: "Invest ₹50,000 in ELSS?",
        choices: [
            { id: 'yes', text: '✅ Yes - Save Tax', value: 50000, type: '80C' },
            { id: 'no', text: '❌ No - Keep Cash', value: 0, type: 'none' }
        ]
    },
    {
        month: 3,
        title: "Housing Allowance Choice",
        description: "Your manager offers you a choice for accommodation",
        icon: "🏠",
        info: "HRA allows tax exemption on rent paid. Company flat has no HRA benefit.",
        question: "Which do you prefer?",
        choices: [
            { id: 'hra', text: '₹15,000/month HRA (rent your own)', value: 60000, type: 'HRA' },
            { id: 'flat', text: '₹10,000/month company flat', value: 0, type: 'none' }
        ]
    },
    {
        month: 6,
        title: "Health Insurance",
        description: "Annual health insurance premium is due",
        icon: "🏥",
        info: "₹25,000 deduction under 80D + ₹5 lakh coverage",
        question: "Buy health insurance?",
        choices: [
            { id: 'yes', text: '✅ Yes - Tax + Protection', value: 25000, type: '80D' },
            { id: 'no', text: '❌ No - Risk It', value: 0, type: 'none' }
        ]
    },
    {
        month: 9,
        title: "NPS Contribution",
        description: "Company offers National Pension Scheme",
        icon: "💰",
        info: "Additional ₹50,000 deduction under 80CCD(1B). Locked till retirement.",
        question: "Invest in NPS?",
        choices: [
            { id: 'yes', text: '✅ Yes - Extra Deduction', value: 50000, type: '80CCD' },
            { id: 'no', text: '❌ No - Need Freedom', value: 0, type: 'none' }
        ]
    }
];

export default function TaxCalculator({ onComplete }) {
    const [step, setStep] = useState('ai-intro'); // 'ai-intro', 'intro', 'regime', 'scenarios', 'calculation', 'ai-analysis'
    const [salary] = useState(600000); // ₹6 LPA
    const [regime, setRegime] = useState(null); // 'old' or 'new'
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [decisions, setDecisions] = useState([]);
    const [deductions, setDeductions] = useState({
        section80C: 0,
        section80D: 0,
        HRA: 0,
        section80CCD: 0,
        standardDeduction: 50000
    });

    const currentScenario = SCENARIOS[currentScenarioIndex];

    const handleRegimeChoice = (selectedRegime) => {
        setRegime(selectedRegime);
        setDecisions([{
            type: 'regime_choice',
            choice: selectedRegime,
            context: 'Tax Regime Selection',
            alternatives: ['old', 'new']
        }]);
        setStep('scenarios');
    };

    const handleScenarioChoice = (choice) => {
        // Track decision
        const decision = {
            type: 'tax_decision',
            context: `${currentScenario.title} - Month ${currentScenario.month}`,
            choice: choice.id,
            alternatives: currentScenario.choices.map(c => c.id),
            metadata: {
                amount: choice.value,
                deductionType: choice.type,
                month: currentScenario.month
            }
        };
        setDecisions(prev => [...prev, decision]);

        // Update deductions
        if (regime === 'old') {
            if (choice.type === '80C') {
                setDeductions(prev => ({ ...prev, section80C: prev.section80C + choice.value }));
            } else if (choice.type === '80D') {
                setDeductions(prev => ({ ...prev, section80D: choice.value }));
            } else if (choice.type === 'HRA') {
                setDeductions(prev => ({ ...prev, HRA: choice.value }));
            } else if (choice.type === '80CCD') {
                setDeductions(prev => ({ ...prev, section80CCD: choice.value }));
            }
        }

        // Move to next scenario
        if (currentScenarioIndex + 1 < SCENARIOS.length) {
            setCurrentScenarioIndex(prev => prev + 1);
        } else {
            setStep('calculation');
        }
    };

    const calculateTax = () => {
        let taxableIncome = salary;
        let tax = 0;

        if (regime === 'old') {
            // Old regime: Apply deductions
            const totalDeductions = deductions.section80C + deductions.section80D +
                deductions.HRA + deductions.section80CCD +
                deductions.standardDeduction;
            taxableIncome = salary - Math.min(totalDeductions, 250000); // Max deduction cap

            // Old regime slabs
            if (taxableIncome <= 250000) tax = 0;
            else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
            else if (taxableIncome <= 1000000) {
                tax = 12500 + (taxableIncome - 500000) * 0.20;
            }
        } else {
            // New regime: Standard deduction only
            taxableIncome = salary - deductions.standardDeduction;

            // New regime slabs
            if (taxableIncome <= 300000) tax = 0;
            else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
            else if (taxableIncome <= 900000) {
                tax = 15000 + (taxableIncome - 600000) * 0.10;
            }
        }

        // Rebate under 87A
        if (taxableIncome <= 500000) {
            tax = Math.max(0, tax - 12500);
        }

        const cess = tax * 0.04;
        return {
            grossIncome: salary,
            totalDeductions: salary - taxableIncome,
            taxableIncome,
            tax: Math.round(tax),
            cess: Math.round(cess),
            totalTax: Math.round(tax + cess)
        };
    };

    const taxCalc = step === 'calculation' || step === 'ai-analysis' ? calculateTax() : null;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
                {/* AI Introduction */}
                {step === 'ai-intro' && (
                    <AIIntroduction
                        simulationConfig={SIMULATOR_CONFIGS.tax}
                        onComplete={() => setStep('intro')}
                    />
                )}

                {/* Story Introduction */}
                {step === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <div className="text-8xl mb-4">👩‍💼</div>
                            <h2 className="text-3xl font-bold mb-2">Meet Priya!</h2>
                            <p className="text-gray-600">22-year-old fresh graduate</p>
                        </div>

                        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Congratulations!</h3>
                                    <p className="text-gray-700">You got selected at TechCorp!</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg space-y-2">
                                <p className="text-sm text-gray-600">Your Offer Letter:</p>
                                <div className="flex justify-between">
                                    <span className="font-semibold">💰 Annual Salary</span>
                                    <span className="text-green-600 font-bold">₹6,00,000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">📅 Start Date</span>
                                    <span>April 2024</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-yellow-50 border-yellow-300 p-4">
                            <p className="font-semibold text-yellow-900 mb-2">⚡ First Decision Ahead!</p>
                            <p className="text-sm text-yellow-800">
                                You need to choose your tax regime. This will affect how much tax you pay throughout the year!
                            </p>
                        </Card>

                        <Button variant="primary" className="w-full" onClick={() => setStep('regime')}>
                            Choose Tax Regime
                            <ArrowRight className="ml-2" />
                        </Button>
                    </motion.div>
                )}

                {/* Regime Choice */}
                {step === 'regime' && (
                    <motion.div
                        key="regime"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">Choose Your Tax Regime</h2>
                            <p className="text-gray-600">This decision affects your entire year!</p>
                        </div>

                        {/* Old Regime */}
                        <Card
                            className="p-6 border-2 border-blue-300 hover:border-blue-500 cursor-pointer transition-all"
                            onClick={() => handleRegimeChoice('old')}
                        >
                            <h3 className="font-bold text-xl mb-3 text-blue-900">Old Tax Regime</h3>
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-start gap-2">
                                    <span className="text-green-600">✅</span>
                                    <span>Tax deductions (80C, 80D, HRA, NPS)</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-red-600">❌</span>
                                    <span>Higher base tax rates</span>
                                </div>
                            </div>
                            <p className="text-xs bg-blue-50 p-2 rounded">
                                <strong>Best for:</strong> People who invest/save regularly (ELSS, PPF, Insurance)
                            </p>
                        </Card>

                        {/* New Regime */}
                        <Card
                            className="p-6 border-2 border-purple-300 hover:border-purple-500 cursor-pointer transition-all"
                            onClick={() => handleRegimeChoice('new')}
                        >
                            <h3 className="font-bold text-xl mb-3 text-purple-900">New Tax Regime</h3>
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex items-start gap-2">
                                    <span className="text-green-600">✅</span>
                                    <span>Lower tax rates</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-red-600">❌</span>
                                    <span>No deductions allowed</span>
                                </div>
                            </div>
                            <p className="text-xs bg-purple-50 p-2 rounded">
                                <strong>Best for:</strong> Simple finances, don't invest much
                            </p>
                        </Card>
                    </motion.div>
                )}

                {/* Monthly Scenarios */}
                {step === 'scenarios' && currentScenario && (
                    <motion.div
                        key={`scenario-${currentScenarioIndex}`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <div className="text-6xl mb-4">{currentScenario.icon}</div>
                            <p className="text-sm text-purple-600 font-bold">Month {currentScenario.month} / 12</p>
                            <h2 className="text-2xl font-bold mb-2">{currentScenario.title}</h2>
                            <p className="text-gray-600">{currentScenario.description}</p>
                        </div>

                        <Card className="bg-blue-50 border-blue-300 p-4">
                            <p className="text-sm text-blue-900">{currentScenario.info}</p>
                        </Card>

                        <div className="space-y-3">
                            <p className="font-semibold text-center">{currentScenario.question}</p>
                            {currentScenario.choices.map((choice) => (
                                <Button
                                    key={choice.id}
                                    variant={choice.id === 'yes' ? 'primary' : 'outline'}
                                    className="w-full text-left justify-start"
                                    onClick={() => handleScenarioChoice(choice)}
                                >
                                    {choice.text}
                                </Button>
                            ))}
                        </div>

                        {regime === 'new' && currentScenario.choices[0].type !== 'none' && (
                            <Card className="bg-yellow-50 border-yellow-300 p-3">
                                <p className="text-xs text-yellow-900">
                                    ⚠️ Note: You chose New Regime - deductions won't apply to you!
                                </p>
                            </Card>
                        )}
                    </motion.div>
                )}

                {/* Tax Calculation */}
                {step === 'calculation' && taxCalc && (
                    <motion.div
                        key="calculation"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <div className="text-8xl mb-4">📊</div>
                            <h2 className="text-3xl font-bold mb-2">Your Tax Calculation</h2>
                            <p className="text-gray-600">Year-end tax filing time!</p>
                        </div>

                        <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
                            <div className="space-y-3">
                                <div className="flex justify-between text-lg">
                                    <span>💰 Gross Salary</span>
                                    <span className="font-bold">₹{taxCalc.grossIncome.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-red-600">
                                    <span>➖ Total Deductions</span>
                                    <span className="font-bold">₹{taxCalc.totalDeductions.toLocaleString()}</span>
                                </div>
                                <div className="border-t-2 border-gray-300 pt-2"></div>
                                <div className="flex justify-between text-xl font-bold">
                                    <span>= Taxable Income</span>
                                    <span className="text-purple-600">₹{taxCalc.taxableIncome.toLocaleString()}</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white border-2 border-purple-300">
                            <h3 className="font-bold mb-4">Tax Breakdown:</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Income Tax</span>
                                    <span>₹{taxCalc.tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Health & Education Cess (4%)</span>
                                    <span>₹{taxCalc.cess.toLocaleString()}</span>
                                </div>
                                <div className="border-t-2 border-purple-200 pt-2 mt-2"></div>
                                <div className="flex justify-between text-2xl font-bold">
                                    <span>Final Tax</span>
                                    <span className={taxCalc.totalTax === 0 ? "text-green-600" : "text-red-600"}>
                                        ₹{taxCalc.totalTax.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {taxCalc.totalTax === 0 && (
                            <Card className="bg-green-50 border-green-300 p-4 text-center">
                                <div className="text-4xl mb-2">🎉</div>
                                <p className="font-bold text-green-900">YOU PAY NO TAX!</p>
                                <p className="text-sm text-green-700">Great financial planning!</p>
                            </Card>
                        )}

                        <Button variant="primary" className="w-full" onClick={() => setStep('ai-analysis')}>
                            See AI Analysis
                            <ArrowRight className="ml-2" />
                        </Button>
                    </motion.div>
                )}

                {/* AI Analysis Placeholder */}
                {step === 'ai-analysis' && (
                    <motion.div
                        key="ai-analysis"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
                            <h3 className="font-bold text-xl mb-4">🤖 AI Analysis Coming Soon!</h3>
                            <p className="text-gray-700 mb-4">
                                Your tax decisions will be analyzed by AI to show which choices saved money and which ones you could improve next year.
                            </p>
                            <div className="text-sm text-gray-600">
                                <p>• Regime choice analysis</p>
                                <p>• Investment decisions review</p>
                                <p>• Tax-saving recommendations</p>
                            </div>
                        </Card>

                        <Button variant="primary" className="w-full" onClick={onComplete}>
                            Complete Simulation
                            <ArrowRight className="ml-2" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
