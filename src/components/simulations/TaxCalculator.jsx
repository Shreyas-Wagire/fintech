import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calculator, TrendingDown } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { cn } from '../../lib/utils';

export default function TaxCalculator({ onComplete }) {
    const [income, setIncome] = useState('');
    const [deductions, setDeductions] = useState('');
    const [result, setResult] = useState(null);

    const calculateTax = () => {
        const annualIncome = parseFloat(income) || 0;
        const totalDeductions = parseFloat(deductions) || 0;
        const taxableIncome = Math.max(0, annualIncome - totalDeductions);

        let tax = 0;

        // New Tax Regime (2023-24)
        if (taxableIncome <= 300000) {
            tax = 0;
        } else if (taxableIncome <= 600000) {
            tax = (taxableIncome - 300000) * 0.05;
        } else if (taxableIncome <= 900000) {
            tax = 15000 + (taxableIncome - 600000) * 0.10;
        } else if (taxableIncome <= 1200000) {
            tax = 45000 + (taxableIncome - 900000) * 0.15;
        } else if (taxableIncome <= 1500000) {
            tax = 90000 + (taxableIncome - 1200000) * 0.20;
        } else {
            tax = 150000 + (taxableIncome - 1500000) * 0.30;
        }

        // Add 4% cess
        tax = Math.round(tax * 1.04);

        const netIncome = annualIncome - tax;
        const effectiveTaxRate = ((tax / annualIncome) * 100).toFixed(2);

        setResult({
            taxableIncome,
            tax,
            netIncome,
            effectiveTaxRate,
            monthlySurplus: Math.round((netIncome - deductions) / 12)
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {!result ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="text-center">
                        <div className="text-6xl mb-4">🧮</div>
                        <h2 className="text-3xl font-bold mb-2">Tax Calculator</h2>
                        <p className="text-gray-600">Calculate your income tax (New Regime FY 2023-24)</p>
                    </div>

                    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block font-bold mb-2">Annual Income (₹)</label>
                                <input
                                    type="number"
                                    value={income}
                                    onChange={(e) => setIncome(e.target.value)}
                                    placeholder="500000"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-2">Deductions under 80C (₹)</label>
                                <input
                                    type="number"
                                    value={deductions}
                                    onChange={(e) => setDeductions(e.target.value)}
                                    placeholder="150000"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-lg focus:border-blue-500 focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Max ₹1,50,000 (PPF, ELSS, Life Insurance)</p>
                            </div>
                        </div>
                    </Card>

                    <Button
                        variant="primary"
                        className="w-full text-lg py-4"
                        onClick={calculateTax}
                        disabled={!income}
                    >
                        Calculate Tax
                        <Calculator className="ml-2" />
                    </Button>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                >
                    <div className="text-center">
                        <div className="text-6xl mb-4">{result.tax > 50000 ? '😰' : '😊'}</div>
                        <h2 className="text-3xl font-bold mb-2">Your Tax Calculation</h2>
                    </div>

                    <Card className="bg-gradient-to-br from-green-50 to-blue-50 p-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b">
                                <span className="text-gray-600">Annual Income</span>
                                <span className="text-xl font-bold">₹{parseFloat(income).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b">
                                <span className="text-gray-600">Deductions (80C)</span>
                                <span className="text-xl font-bold text-green-600">-₹{parseFloat(deductions || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b">
                                <span className="text-gray-600">Taxable Income</span>
                                <span className="text-xl font-bold">₹{result.taxableIncome.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b">
                                <span className="text-gray-600 font-semibold">Tax Payable</span>
                                <span className="text-2xl font-bold text-red-600">₹{result.tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3">
                                <span className="font-bold text-lg">Net Income (After Tax)</span>
                                <span className="text-3xl font-bold text-blue-600">₹{result.netIncome.toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-purple-50 border-purple-200 p-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Effective Tax Rate:</span>
                                <span className="font-bold">{result.effectiveTaxRate}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Monthly Surplus:</span>
                                <span className="font-bold text-green-600">₹{result.monthlySurplus.toLocaleString()}/mo</span>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                        <p className="font-bold text-yellow-800 mb-2">💡 Tax Saving Tip</p>
                        <p className="text-sm text-yellow-900">
                            {result.tax === 0
                                ? "You're in the tax-free bracket! Save more to build wealth."
                                : `Invest ₹${(150000 - parseFloat(deductions || 0)).toLocaleString()} more in 80C to save additional tax!`}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setResult(null)} className="flex-1">
                            Calculate Again
                        </Button>
                        <Button variant="primary" onClick={onComplete} className="flex-1">
                            Complete
                            <ArrowRight className="ml-2" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
