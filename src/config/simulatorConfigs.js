// Central configuration for all simulator AI tutors
export const SIMULATOR_CONFIGS = {
    loan: {
        id: 'loan',
        title: 'Loan & EMI Management',
        terms: [
            'EMI (Equated Monthly Installment)',
            'Interest Rate',
            'Loan Tenure',
            'Principal Amount',
            'Disposable Income'
        ],
        learningObjectives: [
            'Understanding EMI calculation and loan costs',
            'Managing monthly loan payments within budget',
            'Handling emergencies while repaying loans'
        ]
    },
    budget: {
        id: 'budget',
        title: 'Budget Management',
        terms: [
            'Fixed Expenses',
            'Variable Expenses',
            'Savings Rate',
            'Emergency Fund',
            'Wants vs Needs'
        ],
        learningObjectives: [
            'Creating and following a monthly budget',
            'Balancing essential needs vs optional wants',
            'Building emergency savings for unexpected costs'
        ]
    },
    tax: {
        id: 'tax',
        title: 'Tax Calculation & Savings',
        terms: [
            'Gross Income',
            'Taxable Income',
            'Tax Slab',
            'Deductions (80C, 80D)',
            'Net Tax Liability'
        ],
        learningObjectives: [
            'Understanding Indian income tax slabs',
            'Claiming important tax deductions',
            'Optimizing tax liability legally'
        ]
    },
    moneyMonth: {
        id: 'moneyMonth',
        title: 'Monthly Money Management',
        terms: [
            'Cash Payment',
            'UPI Transaction',
            'Credit Card',
            'EMI (Equated Monthly Installment)',
            'Interest Charges'
        ],
        learningObjectives: [
            'Understanding different payment methods and when to use them',
            'Managing monthly expenses within pocket money',
            'Avoiding unnecessary debt and high interest charges'
        ]
    },

    stockTrading: {
        title: 'Stock Trading Game',
        description: 'Trade stocks for 30 days and build your wealth!',
        introMessage: `Welcome to the Stock Market! 📈

You have ₹1,00,000 to invest. Trade 5 different stocks over 30 days.

**How it works:**
- Stock prices change daily (realistic fluctuations)
- Buy stocks when price is low
- Sell stockswhen price is high
- Your goal: Make as much profit as possible!

**5 Stocks Available:**
- Apple (AAPL) - Tech giant
- Google (GOOGL) - Search & cloud
- Tesla (TSLA) - Electric vehicles (high risk!)
- Reliance - Indian conglomerate
- TCS - IT services

**Tips:**
✅ Don't invest all cash at once
✅ Diversify (buy different stocks)
✅ Hold for long term when possible
✅ Don't panic-sell on small dips

Ready to become a trader?`,
        reward: 300
    }
};

// Helper function to get config by ID
export function getSimulatorConfig(simulatorId) {
    return SIMULATOR_CONFIGS[simulatorId] || null;
}
