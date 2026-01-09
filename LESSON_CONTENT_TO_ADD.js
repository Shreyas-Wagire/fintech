import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Simple lesson content appended to end of curriculum.js
// Add this before the closing };

// GST Lesson (l17)
const l17Content = [
    {
        id: 'l17-intro', type: 'explanation', title: 'What is GST? 🧾',
        content: "GST = Goods and Services Tax. It's a tax you pay when you BUY things (food, clothes, services). Already included in the price!"
    },
    {
        id: 'l17-rate', type: 'explanation', title: 'GST Rates 💰',
        content: "Different items have different GST rates: 0% (Essential foods), 5% (Daily needs), 12-18% (Most goods), 28% (Luxury items like cars)"
    },
    {
        id: 'l17-example', type: 'explanation', title: 'Example 🔢',
        content: "₹100 shirt + 18% GST = ₹118 total. The ₹18 goes to government for roads, schools, hospitals!"
    },
    {
        id: 'l17-summary', type: 'explanation', title: 'Remember!',
        content: "GST is already in the price you see. It funds public services. Higher luxury items have higher GST. 🎯"
    }
];

// Shares Lesson (l18)
const l18Content = [
    {
        id: 'l18-intro', type: 'explanation', title: 'What are Shares? 📈',
        content: "A SHARE = Small piece of a company. Buy Apple shares = Own small part of Apple! If Apple grows, your shares become more valuable!"
    },
    {
        id: 'l18-why', type: 'explanation', title: 'Why Buy Shares? 💰',
        content: "2 ways to make money: 1) Price goes up → Sell for profit, 2) Dividends → Company shares profits with you"
    },
    {
        id: 'l18-risk', type: 'explanation', title: 'Risk & Reward ⚠️',
        content: "Shares can go UP or DOWN. High risk = High reward. Never invest money you can't afford to lose!"
    },
    {
        id: 'l18-example', type: 'explanation', title: 'Example 🔢',
        content: "Buy 10 Apple shares at ₹150 each = ₹1,500. Price rises to ₹180 → Sell = ₹1,800. Profit = ₹300! (20% return)"
    },
    {
        id: 'l18-summary', type: 'explanation', title: 'Smart Investing!',
        content: "Research before buying. Diversify (don't put all eggs in one basket). Think long-term. Ready to try our simulator? 🎯"
    }
];

// Assets vs Liabilities (l19)
const l19Content = [
    {
        id: 'l19-intro', type: 'explanation', title: 'Assets vs Liabilities 📊',
        content: "ASSET = Puts money IN your pocket (stocks, rental property). LIABILITY = Takes money OUT (loans, credit card debt)"
    },
    {
        id: 'l19-assets', type: 'explanation', title: 'Good Assets ✅',
        content: "Stocks, Mutual Funds, Real Estate (rental), Business, Gold. These GROW your wealth over time!"
    },
    {
        id: 'l19-liabilities', type: 'explanation', title: 'Common Liabilities ❌',
        content: "Car loans, Credit card debt, Personal loans, EMIs. These DRAIN your wealth with interest!"
    },
    {
        id: 'l19-summary', type: 'explanation', title: 'Wealth Formula!',
        content: "Rich people buy ASSETS. Poor people buy LIABILITIES. Choose wisely! Build assets, minimize liabilities. 🎯"
    }
];

// Stock Trading Simulator (l20)
const l20Content = [
    {
        id: 'l20-sim',
        type: 'simulation',
        simulationType: 'stockTrading',
        title: '📈 30-Day Stock Trading Game',
        config: {}
    }
];

// Export this at end of curriculum.js:
// 'l17': l17Content,
// 'l18': l18Content,
// 'l19': l19Content,
// 'l20': l20Content
