import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import AIIntroduction from '../ai/AIIntroduction';
import AILearningSummary from '../ai/AILearningSummary';
import { SIMULATOR_CONFIGS } from '../../config/simulatorConfigs';

const INITIAL_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 15000, volatility: 0.03 },
    { symbol: 'GOOGL', name: 'Google', price: 12000, volatility: 0.025 },
    { symbol: 'TSLA', name: 'Tesla', price: 18000, volatility: 0.04 },
    { symbol: 'RELIANCE', name: 'Reliance', price: 2500, volatility: 0.02 },
    { symbol: 'TCS', name: 'Tata Consultancy', price: 3500, volatility: 0.022 }
];

export default function StockTrading() {
    const [step, setStep] = useState('intro'); // intro, trading, summary
    const [day, setDay] = useState(1);
    const [cash, setCash] = useState(100000); // ₹1 lakh
    const [portfolio, setPortfolio] = useState({}); // { AAPL: 5, GOOGL: 3 }
    const [stocks, setStocks] = useState(INITIAL_STOCKS);
    const [history, setHistory] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const startSimulation = () => setStep('trading');

    // Calculate portfolio value
    const portfolioValue = Object.entries(portfolio).reduce((total, [symbol, qty]) => {
        const stock = stocks.find(s => s.symbol === symbol);
        return total + (stock.price * qty);
    }, 0);

    const totalValue = cash + portfolioValue;
    const profitLoss = totalValue - 100000;
    const profitPercent = ((profitLoss / 100000) * 100).toFixed(2);

    // Update stock prices for next day
    const nextDay = () => {
        const newStocks = stocks.map(stock => {
            const change = (Math.random() - 0.5) * 2 * stock.volatility;
            const newPrice = Math.round(stock.price * (1 + change));
            return { ...stock, price: Math.max(100, newPrice), prevPrice: stock.price };
        });

        setStocks(newStocks);
        setDay(prev => prev + 1);

        if (day >= 30) {
            setStep('summary');
        }
    };

    const buyStock = () => {
        if (!selectedStock || quantity <= 0) return;

        const stock = stocks.find(s => s.symbol === selectedStock);
        const cost = stock.price * quantity;

        if (cash >= cost) {
            setCash(prev => prev - cost);
            setPortfolio(prev => ({
                ...prev,
                [selectedStock]: (prev[selectedStock] || 0) + quantity
            }));
            setHistory(prev => [...prev, {
                day,
                action: 'BUY',
                symbol: selectedStock,
                quantity,
                price: stock.price,
                total: cost
            }]);
            setSelectedStock(null);
            setQuantity(1);
        }
    };

    const sellStock = () => {
        if (!selectedStock || quantity <= 0) return;

        const owned = portfolio[selectedStock] || 0;
        if (owned < quantity) return;

        const stock = stocks.find(s => s.symbol === selectedStock);
        const revenue = stock.price * quantity;

        setCash(prev => prev + revenue);
        setPortfolio(prev => ({
            ...prev,
            [selectedStock]: prev[selectedStock] - quantity
        }));
        setHistory(prev => [...prev, {
            day,
            action: 'SELL',
            symbol: selectedStock,
            quantity,
            price: stock.price,
            total: revenue
        }]);
        setSelectedStock(null);
        setQuantity(1);
    };

    if (step === 'intro') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 pt-28 pb-28 px-4">
                <div className="max-w-2xl mx-auto">
                    <AIIntroduction
                        config={SIMULATOR_CONFIGS.stockTrading}
                        onStart={startSimulation}
                    />
                </div>
            </div>
        );
    }

    if (step === 'summary') {
        const grade = profitLoss >= 20000 ? 'A' : profitLoss >= 10000 ? 'B' : profitLoss >= 0 ? 'C' : profitLoss >= -10000 ? 'D' : 'F';

        return (
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 pt-28 pb-28 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl font-bold mb-2">30 Days Complete! 🎉</h1>
                        <p className="text-gray-600">Let's see how you did...</p>
                    </motion.div>

                    <Card className="mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                        <div className="text-center">
                            <p className="text-lg opacity-90 mb-2">Final Portfolio Value</p>
                            <p className="text-5xl font-bold mb-4">₹{totalValue.toLocaleString()}</p>
                            <div className={`text-2xl font-bold flex items-center justify-center gap-2 ${profitLoss >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                                {profitLoss >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                                {profitLoss >= 0 ? '+' : ''}₹{profitLoss.toLocaleString()} ({profitPercent}%)
                            </div>
                            <p className="mt-4 text-sm opacity-90">Grade: <span className="text-2xl font-bold">{grade}</span></p>
                        </div>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <Card>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                Breakdown
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Cash Remaining:</span>
                                    <span className="font-bold">₹{cash.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Stocks Value:</span>
                                    <span className="font-bold">₹{portfolioValue.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                    <span className="text-gray-600">Total Trades:</span>
                                    <span className="font-bold">{history.length}</span>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-purple-600" />
                                Your Stocks
                            </h3>
                            {Object.keys(portfolio).length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No stocks held</p>
                            ) : (
                                <div className="space-y-2">
                                    {Object.entries(portfolio).filter(([_, qty]) => qty > 0).map(([symbol, qty]) => {
                                        const stock = stocks.find(s => s.symbol === symbol);
                                        return (
                                            <div key={symbol} className="flex justify-between text-sm">
                                                <span className="font-medium">{symbol}</span>
                                                <span>{qty} × ₹{stock.price.toLocaleString()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Card>
                    </div>

                    <AILearningSummary
                        simulationData={{
                            day: 30,
                            startBalance: 100000,
                            finalBalance: totalValue,
                            profitLoss,
                            trades: history.length,
                            grade
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 pt-28 pb-28 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Stock Trading Game</h1>
                        <p className="text-gray-600">Day {day} of 30</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Total Value</p>
                        <p className="text-3xl font-bold text-blue-600">₹{totalValue.toLocaleString()}</p>
                        <p className={`text-sm ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {profitLoss >= 0 ? '+' : ''}₹{profitLoss.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card className="text-center">
                        <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                        <p className="text-sm text-gray-600">Cash</p>
                        <p className="text-xl font-bold">₹{cash.toLocaleString()}</p>
                    </Card>
                    <Card className="text-center">
                        <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                        <p className="text-sm text-gray-600">Stocks</p>
                        <p className="text-xl font-bold">₹{portfolioValue.toLocaleString()}</p>
                    </Card>
                    <Card className="text-center">
                        <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm text-gray-600">Days Left</p>
                        <p className="text-xl font-bold">{30 - day}</p>
                    </Card>
                    <Card className="text-center">
                        {profitLoss >= 0 ? <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" /> : <TrendingDown className="w-6 h-6 mx-auto mb-2 text-red-600" />}
                        <p className="text-sm text-gray-600">P/L</p>
                        <p className={`text-xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {profitPercent}%
                        </p>
                    </Card>
                </div>

                {/* Stock List */}
                <Card className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">Available Stocks</h2>
                    <div className="space-y-3">
                        {stocks.map(stock => {
                            const priceChange = stock.prevPrice ? ((stock.price - stock.prevPrice) / stock.prevPrice * 100) : 0;
                            const owned = portfolio[stock.symbol] || 0;

                            return (
                                <motion.div
                                    key={stock.symbol}
                                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedStock === stock.symbol ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                        }`}
                                    onClick={() => setSelectedStock(stock.symbol)}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-lg">{stock.symbol}</p>
                                            <p className="text-sm text-gray-600">{stock.name}</p>
                                            {owned > 0 && <p className="text-xs text-purple-600 font-semibold mt-1">You own: {owned} shares</p>}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">₹{stock.price.toLocaleString()}</p>
                                            {stock.prevPrice && (
                                                <p className={`text-sm flex items-center gap-1 justify-end ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {priceChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                                    {Math.abs(priceChange).toFixed(2)}%
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </Card>

                {/* Buy/Sell Controls */}
                {selectedStock && (
                    <Card className="mb-6">
                        <h3 className="text-xl font-bold mb-4">Trade {selectedStock}</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="w-24 px-3 py-2 border rounded-lg"
                            />
                            <span className="text-gray-600">shares</span>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="primary"
                                onClick={buyStock}
                                disabled={cash < (stocks.find(s => s.symbol === selectedStock)?.price * quantity)}
                                className="flex-1"
                            >
                                Buy (₹{((stocks.find(s => s.symbol === selectedStock)?.price || 0) * quantity).toLocaleString()})
                            </Button>
                            <Button
                                variant="outline"
                                onClick={sellStock}
                                disabled={(portfolio[selectedStock] || 0) < quantity}
                                className="flex-1"
                            >
                                Sell (₹{((stocks.find(s => s.symbol === selectedStock)?.price || 0) * quantity).toLocaleString()})
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Next Day Button */}
                <div className="text-center">
                    <Button
                        onClick={nextDay}
                        variant="primary"
                        className="px-12 py-4 text-lg"
                    >
                        {day < 30 ? `Next Day (${day + 1}/30)` : 'Finish & See Results'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
