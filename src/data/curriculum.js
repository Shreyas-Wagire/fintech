export const UNITS = [
    {
        id: 1,
        title: "Unit 1: Saving Basics",
        description: "Master money management fundamentals",
        color: "bg-gradient-to-r from-green-500 to-emerald-600",
        levels: [
            { id: 'l1', title: 'Income vs Expense', icon: 'money-bag', totalLessons: 5, completed: 0 },
            { id: 'l2', title: 'Needs vs Wants', icon: 'shopping-cart', totalLessons: 5, completed: 0 },
            { id: 'l3', title: 'Save Before You Spend', icon: 'piggy-bank', totalLessons: 5, completed: 0 },
            { id: 'l11', title: '💳 Payment Methods Explained', icon: 'credit-card', totalLessons: 6, completed: 0 },
            { id: 'l12', title: '💸 Money Month Simulator', icon: 'game', totalLessons: 1, completed: 0 }
        ]
    },
    {
        id: 2,
        title: "Unit 2: Smart Borrowing",
        description: "Learn about loans and interest",
        color: "bg-gradient-to-r from-blue-500 to-indigo-600",
        levels: [
            { id: 'l4', title: 'Savings Accounts', icon: 'bank', totalLessons: 4, completed: 0 },
            { id: 'l5', title: 'Understanding Interest', icon: 'percent', totalLessons: 4, completed: 0 },
            { id: 'l6', title: 'Fixed Deposits', icon: 'lock', totalLessons: 4, completed: 0 },
            { id: 'l16', title: '🏦 Loan & EMI Explained', icon: 'trending-down', totalLessons: 6, completed: 0 },
            { id: 'l10', title: '🎮 Loan Simulator', icon: 'game', totalLessons: 1, completed: 0 }
        ]
    },
    {
        id: 3,
        title: "Unit 3: Investing Basics",
        description: "Grow your money over time.",
        color: "bg-gradient-to-r from-purple-500 to-pink-600",
        levels: [
            { id: 'l7', title: 'What is Inflation?', icon: 'trending-up', totalLessons: 4, completed: 0 },
            { id: 'l8', title: 'Risk vs Return', icon: 'activity', totalLessons: 4, completed: 0 },
            { id: 'l9', title: 'Your First Stock', icon: 'bar-chart', totalLessons: 5, completed: 0 }
        ]
    },
    {
        id: 4,
        title: "Unit 4: Taxes & Planning",
        description: "Master tax-saving strategies",
        color: "bg-gradient-to-r from-orange-500 to-red-600",
        levels: [
            { id: 'l13', title: 'Credit Cards 101', icon: 'credit-card', totalLessons: 4, completed: 0 },
            { id: 'l17', title: '🧾 Understanding GST', icon: 'receipt', totalLessons: 4, completed: 0 },
            { id: 'l15', title: '📊 Tax Terms Explained', icon: 'file-text', totalLessons: 7, completed: 0 },
            { id: 'l14', title: '🧮 Tax Calculator Simulator', icon: 'game', totalLessons: 1, completed: 0 }
        ]
    },
    {
        id: 5,
        title: "Unit 5: Stock Market Investing",
        description: "Learn to trade and build wealth",
        color: "bg-gradient-to-r from-cyan-500 to-blue-600",
        levels: [
            { id: 'l18', title: 'What are Shares?', icon: 'trending-up', totalLessons: 5, completed: 0 },
            { id: 'l19', title: 'Assets vs Liabilities', icon: 'balance-scale', totalLessons: 4, completed: 0 },
            { id: 'l20', title: '📈 30-Day Stock Trading Game', icon: 'game', totalLessons: 1, completed: 0 }
        ]
    }
];

export const LESSON_CONTENT = {
    // UNIT 1: Money Basics
    'l1': [ // Income vs Expense
        {
            id: 'l1-intro', type: 'explanation', title: 'What is Cash Flow?',
            content: "Think of your money like water in a bucket. 💧 Income is the water pouring in (like your salary or allowance), and Expenses are the leaks (like rent, food, or that new game you bought)."
        },
        {
            id: 'l1-q1', type: 'quiz', question: "Which of these is an Income?",
            options: [
                { text: "Getting birthday money from grandma", correct: true },
                { text: "Buying lunch at school", correct: false },
                { text: "Paying your phone bill", correct: false },
            ]
        },
        {
            id: 'l1-q2', type: 'quiz', question: "Which one is an Expense?",
            options: [
                { text: "Monthly salary", correct: false },
                { text: "Netflix subscription", correct: true },
                { text: "Selling old books", correct: false },
            ]
        },
        {
            id: 'l1-scenario', type: 'scenario',
            question: "You earned ₹2,000 from a part-time job. Then you spent ₹1,500 on shoes. What is your Net Cash Flow?",
            options: [
                { text: "+₹500 (You have ₹500 left)", correct: true },
                { text: "-₹500 (You lost money)", correct: false },
                { text: "+₹2,000 (You still have all the money)", correct: false }
            ]
        },
        {
            id: 'l1-summary', type: 'explanation', title: 'Remember This!',
            content: "Net Cash Flow = Income - Expenses. If positive, you're saving. If negative, you're overspending! 🎯"
        }
    ],

    'l2': [ // Needs vs Wants
        {
            id: 'l2-intro', type: 'explanation', title: 'Needs vs. Wants',
            content: "NEEDS are things you must have to survive: Food 🍞, Shelter 🏠, Medicine 💊. WANTS are things that are nice to have: Video Games 🎮, Designer Clothes 👟, Latest Phone 📱."
        },
        {
            id: 'l2-q1', type: 'quiz', question: "Which one is a NEED?",
            options: [
                { text: "A fancy sports car", correct: false },
                { text: "Groceries for the week", correct: true },
                { text: "Concert tickets", correct: false },
            ]
        },
        {
            id: 'l2-q2', type: 'quiz', question: "Which one is a WANT?",
            options: [
                { text: "Medicine when you're sick", correct: false },
                { text: "The latest iPhone 15 Pro Max", correct: true },
                { text: "Electricity bill", correct: false },
            ]
        },
        {
            id: 'l2-scenario', type: 'scenario',
            question: "You have ₹1,000. You NEED lunch (₹100) but WANT a new video game (₹999). What should you do?",
            options: [
                { text: "Skip lunch, buy the game", correct: false },
                { text: "Buy lunch, save the rest for later", correct: true },
                { text: "Borrow money to buy both", correct: false }
            ]
        },
        {
            id: 'l2-tip', type: 'explanation', title: 'Smart Money Tip',
            content: "Always cover your NEEDS first. Then, if you have money left over, you can think about your WANTS! 💡"
        }
    ],

    'l3': [ // Save Before You Spend
        {
            id: 'l3-intro', type: 'explanation', title: 'The 50-30-20 Rule',
            content: "A simple way to manage money: 50% for Needs, 30% for Wants, 20% for Savings. This way, you always save before you spend!"
        },
        {
            id: 'l3-q1', type: 'quiz', question: "You earn ₹10,000. Using the 50-30-20 rule, how much should you save?",
            options: [
                { text: "₹1,000", correct: false },
                { text: "₹2,000", correct: true },
                { text: "₹5,000", correct: false },
            ]
        },
        {
            id: 'l3-scenario', type: 'scenario',
            question: "Your friend says 'Saving is boring, just spend all your money on fun!' What do you do?",
            options: [
                { text: "Agree and spend everything", correct: false },
                { text: "Politely disagree and explain the importance of saving", correct: true },
            ]
        },
        {
            id: 'l3-q2', type: 'quiz', question: "Why is saving important?",
            options: [
                { text: "For emergencies and future goals", correct: true },
                { text: "It's not important, spend everything now", correct: false },
                { text: "Only rich people need to save", correct: false },
            ]
        },
        {
            id: 'l3-tip', type: 'explanation', title: 'Pro Tip',
            content: "Start small! Even saving ₹50 a week adds up to ₹2,600 a year. That's enough for a new phone or a trip! 🚀"
        }
    ],

    // UNIT 2: Banking 101
    'l4': [ // Savings Accounts
        {
            id: 'l4-intro', type: 'explanation', title: 'Why Use a Bank?',
            content: "Banks keep your money safe. Plus, they pay you a small amount called 'Interest' just for keeping money there! Much better than hiding cash under your mattress. 🏦"
        },
        {
            id: 'l4-q1', type: 'quiz', question: "What happens to money in a Savings Account?",
            options: [
                { text: "It disappears over time", correct: false },
                { text: "It stays the same forever", correct: false },
                { text: "It grows slowly with interest", correct: true },
            ]
        },
        {
            id: 'l4-scenario', type: 'scenario',
            question: "You have ₹50,000. Where should you keep it?",
            options: [
                { text: "In a savings account earning 4% interest", correct: true },
                { text: "Under your pillow (0% interest)", correct: false },
            ]
        },
        {
            id: 'l4-tip', type: 'explanation', title: 'Did You Know?',
            content: "With 4% interest, ₹10,000 becomes ₹10,400 in one year. That's free money just for saving! 💰"
        }
    ],

    'l5': [ // Understanding Interest
        {
            id: 'l5-intro', type: 'explanation', title: 'The Magic of Compound Interest',
            content: "Compound Interest is earning 'interest on interest'. Your money grows faster over time, like a snowball rolling downhill! ❄️"
        },
        {
            id: 'l5-q1', type: 'quiz', question: "What is compound interest?",
            options: [
                { text: "Interest only on the original amount", correct: false },
                { text: "Interest on both principal and accumulated interest", correct: true },
                { text: "A type of bank fee", correct: false },
            ]
        },
        {
            id: 'l5-scenario', type: 'scenario',
            question: "You invest ₹1,000 at 10% interest. Year 1: ₹1,100. In Year 2, you earn 10% on ₹1,100. How much do you have?",
            options: [
                { text: "₹1,200", correct: false },
                { text: "₹1,210", correct: true },
                { text: "₹1,100", correct: false }
            ]
        },
        {
            id: 'l5-tip', type: 'explanation', title: 'Einstein Said...',
            content: "\"Compound interest is the eighth wonder of the world. He who understands it, earns it. He who doesn't, pays it.\" Start early! ⏰"
        }
    ],

    'l6': [ // Fixed Deposits
        {
            id: 'l6-intro', type: 'explanation', title: 'Fixed Deposits (FD)',
            content: "An FD is like locking your money in a safe for a fixed time (6 months, 1 year, etc.). You get higher interest, but you can't touch it until the time is up! 🔐"
        },
        {
            id: 'l6-q1', type: 'quiz', question: "Why choose an FD over a regular savings account?",
            options: [
                { text: "Higher interest rate", correct: true },
                { text: "Can withdraw anytime", correct: false },
                { text: "Lower interest rate", correct: false },
            ]
        },
        {
            id: 'l6-scenario', type: 'scenario',
            question: "You need emergency money next month. Should you put savings in a 1-year FD?",
            options: [
                { text: "Yes, the interest is great!", correct: false },
                { text: "No, I can't access it when I need it", correct: true },
            ]
        },
        {
            id: 'l6-tip', type: 'explanation', title: 'Smart Tip',
            content: "Use FDs for money you won't need soon (like for a trip next year). Keep emergency money in a regular savings account! 🎯"
        }
    ],

    // UNIT 3: Investing
    'l7': [ // Inflation
        {
            id: 'l7-intro', type: 'explanation', title: 'The Silent Money Killer: Inflation',
            content: "Inflation makes things more expensive over time. ₹100 today won't buy the same amount of stuff 10 years from now. That's why you need to invest, not just save! 📈"
        },
        {
            id: 'l7-q1', type: 'quiz', question: "What is inflation?",
            options: [
                { text: "When prices go down over time", correct: false },
                { text: "When prices stay the same forever", correct: false },
                { text: "When prices increase over time", correct: true },
            ]
        },
        {
            id: 'l7-scenario', type: 'scenario',
            question: "Inflation is 6% per year. Your savings account gives 3% interest. Are you gaining or losing purchasing power?",
            options: [
                { text: "Gaining - I'm earning interest!", correct: false },
                { text: "Losing - Inflation is higher than my interest", correct: true },
            ]
        },
        {
            id: 'l7-tip', type: 'explanation', title: 'Beat Inflation',
            content: "To beat inflation, you need investments that grow faster than the inflation rate. That's where stocks and mutual funds come in! 🚀"
        }
    ],

    'l8': [ // Risk vs Return
        {
            id: 'l8-intro', type: 'explanation', title: 'Risk vs Return',
            content: "High potential rewards usually come with high risk. Crypto can double overnight... or crash to zero. Government bonds are safe but pay very little. Choose wisely! ⚖️"
        },
        {
            id: 'l8-q1', type: 'quiz', question: "Which is generally safer?",
            options: [
                { text: "Government bonds", correct: true },
                { text: "A startup's stock", correct: false },
                { text: "Cryptocurrency", correct: false },
            ]
        },
        {
            id: 'l8-scenario', type: 'scenario',
            question: "You have ₹10,000 to invest for retirement (30 years away). What's the best strategy?",
            options: [
                { text: "All in safe government bonds (low risk, low return)", correct: false },
                { text: "Mix of stocks and bonds (balanced)", correct: true },
                { text: "All in one risky stock", correct: false }
            ]
        },
        {
            id: 'l8-tip', type: 'explanation', title: 'Diversification',
            content: "\"Don't put all your eggs in one basket.\" Spread your money across different investments to reduce risk! 🥚🧺"
        }
    ],

    'l9': [ // Intro to Stocks
        {
            id: 'l9-intro', type: 'explanation', title: 'Owning a Piece of a Company',
            content: "When you buy a Stock (or Share), you become a partial OWNER of that company. If the company does well, the stock price goes up. If it struggles, it goes down. 📊"
        },
        {
            id: 'l9-q1', type: 'quiz', question: "What does it mean to own a stock?",
            options: [
                { text: "You lent money to the company", correct: false },
                { text: "You own a small piece of the company", correct: true },
                { text: "You work for the company", correct: false },
            ]
        },
        {
            id: 'l9-q2', type: 'quiz', question: "You bought 10 shares at ₹100 each. Now they're worth ₹150 each. What's your profit?",
            options: [
                { text: "₹50", correct: false },
                { text: "₹500", correct: true },
                { text: "₹1,500", correct: false },
            ]
        },
        {
            id: 'l9-scenario', type: 'scenario',
            question: "Tesla announces a revolutionary new car. What likely happens to the stock price?",
            options: [
                { text: "Goes up (good news)", correct: true },
                { text: "Goes down (bad news)", correct: false },
                { text: "Stays exactly the same", correct: false }
            ]
        },
        {
            id: 'l9-tip', type: 'explanation', title: 'Long-Term Thinking',
            content: "Stock prices go up and down daily. Don't panic! Successful investors think long-term (5-10+ years) and stay patient. 🧘"
        }
    ],

    // SIMULATIONS - Now standalone without Q&A inside
    'l10': [ // Loan Simulator - Pure simulation
        {
            id: 'l10-sim',
            type: 'simulation',
            simulationType: 'loan',
            title: '🎮 Interactive Loan Simulator',
            config: {}
        }
    ],

    'l11': [ // Payment Methods Explained
        {
            id: 'l11-intro', type: 'explanation', title: 'Payment Methods 💳',
            content: "There are different ways to pay for things. Each has pros and cons. Let's learn when to use what!"
        },
        {
            id: 'l11-cash', type: 'explanation', title: 'Cash Payment 💵',
            content: "CASH: Pay with real money. ✅ No interest, immediate. ❌ Limited by what you have."
        },
        {
            id: 'l11-upi', type: 'explanation', title: 'UPI/Digital Payment 📱',
            content: "UPI (GPay, PhonePe): Digital payment from your bank. ✅ Instant, free. ❌ Limited by bank balance."
        },
        {
            id: 'l11-credit', type: 'explanation', title: 'Credit Card 💳',
            content: "CREDIT CARD: Borrow money from bank. ✅ Buy now, pay later. ❌ 18% interest if not paid in full!"
        },
        {
            id: 'l11-emi', type: 'explanation', title: 'EMI (Installments) 🔄',
            content: "EMI: Split big purchases into monthly payments. ✅ Afford expensive items. ❌ 12-18% interest + total cost increases."
        },
        {
            id: 'l11-q1', type: 'quiz', question: 'Which payment method has NO interest?',
            options: [
                { text: 'Cash or UPI', correct: true },
                { text: 'Credit Card', correct: false },
                { text: 'EMI', correct: false },
            ]
        },
        {
            id: 'l11-summary', type: 'explanation', title: 'Smart Choice!',
            content: "Best order: Cash/UPI → Credit Card (pay full) → EMI (if necessary). Avoid interest when possible! 🎯"
        }
    ],

    // Money Month Simulation
    'l12': [
        {
            id: 'l12-sim',
            type: 'simulation',
            simulationType: 'moneyMonth',
            title: '💸 Money Month Challenge',
            config: {}
        }
    ],

    'l13': [ // Taxes
        {
            id: 'l12-intro', type: 'explanation', title: 'What is a Credit Card?',
            content: "A credit card lets you BORROW money from the bank to buy things. But if you don't pay it back in full each month, you pay HUGE interest (18-36%!)! 💳"
        },
        {
            id: 'l12-q1', type: 'quiz', question: 'What happens if you only pay minimum amount on credit card?',
            options: [
                { text: 'No problem, all good', correct: false },
                { text: 'You pay high interest on remaining amount', correct: true },
                { text: 'Bank gives you a bonus', correct: false },
            ]
        },
        {
            id: 'l12-q2', type: 'quiz', question: 'Credit card rewards are...',
            options: [
                { text: 'Free money with no catch', correct: false },
                { text: 'Only valuable if you pay full balance monthly', correct: true },
                { text: 'Better than savings interest', correct: false },
            ]
        },
        {
            id: 'l12-scenario', type: 'scenario',
            question: 'Your credit card limit is ₹50,000. Should you max it out?',
            options: [
                { text: 'Yes, use the full limit!', correct: false },
                { text: 'No, keep usage under 30% (₹15,000)', correct: true },
                { text: 'Doesn\'t matter', correct: false }
            ]
        },
        {
            id: 'l12-tip', type: 'explanation', title: 'Golden Rule',
            content: "ALWAYS pay full credit card balance before due date. Otherwise, interest eats your money fast! Think of it as a debit card, not free money. 🎯"
        }
    ],

    'l13': [ // Taxes
        {
            id: 'l13-intro', type: 'explanation', title: 'Why Do We Pay Taxes?',
            content: "Taxes fund roads, schools, hospitals, and defense. Everyone earning above ₹2.5 lakh/year pays income tax. It's not optional, it's the law! 🏛️"
        },
        {
            id: 'l13-q1', type: 'quiz', question: 'Income tax is calculated on...',
            options: [
                { text: 'Gross income (before deductions)', correct: false },
                { text: 'Taxable income (after deductions like 80C)', correct: true },
                { text: 'Only salary, not investments', correct: false },
            ]
        },
        {
            id: 'l13-q2', type: 'quiz', question: 'What is GST?',
            options: [
                { text: 'Tax on salary', correct: false },
                { text: 'Tax on goods and services you buy', correct: true },
                { text: 'Tax on houses', correct: false },
            ]
        },
        {
            id: 'l13-tip', type: 'explanation', title: 'Save Tax Legally',
            content: "Invest in ELSS, PPF, or NPS under Section 80C to save up to ₹1.5 lakh from taxable income. Pay less tax legally! 💡"
        }
    ],

    'l14': [ // Tax Calculator Simulation
        {
            id: 'l14-sim',
            type: 'simulation',
            simulationType: 'tax',
            title: '🧮 Tax Calculator',
            config: {}
        }
    ],

    'l15': [ // Tax Terms Explained
        {
            id: 'l15-intro', type: 'explanation', title: 'Tax Terms Simplified 📊',
            content: "Taxes can be confusing! Let's learn the key terms you'll hear about income tax."
        },
        {
            id: 'l15-80c', type: 'explanation', title: 'Section 80C 💰',
            content: "80C: Save tax by investing up to ₹1.5 lakh/year in ELSS, PPF, Life Insurance, or NPS. Example: Invest ₹1.5L → Save ₹46,800 in tax (at 30% rate)!"
        },
        {
            id: 'l15-elss', type: 'explanation', title: 'ELSS (Tax-saving Mutual Fund) 📈',
            content: "ELSS: Equity Linked Savings Scheme. Invest in stocks via mutual fund. ✅ Tax benefit + market returns. ❌ 3-year lock-in."
        },
        {
            id: 'l15-80d', type: 'explanation', title: 'Section 80D (Health Insurance) 🏥',
            content: "80D: Deduction for health insurance premium. ₹25,000 for self, ₹50,000 for parents (60+). Get coverage + save tax!"
        },
        {
            id: 'l15-hra', type: 'explanation', title: 'HRA (House Rent Allowance) 🏠',
            content: "HRA: Part of salary that's tax-free if you pay rent. Can save ₹50,000+ on tax! Metro cities get higher exemption."
        },
        {
            id: 'l15-nps', type: 'explanation', title: 'NPS (Pension Scheme) 🔐',
            content: "NPS: Extra ₹50,000 deduction under 80CCD(1B). Locked till retirement (age 60). Plan for your future + save tax now!"
        },
        {
            id: 'l15-q1', type: 'quiz', question: 'What is the maximum 80C deduction?',
            options: [
                { text: '₹50,000', correct: false },
                { text: '₹1,50,000', correct: true },
                { text: '₹5,00,000', correct: false },
            ]
        },
        {
            id: 'l15-summary', type: 'explanation', title: 'Smart Tax Planning!',
            content: "Use 80C + 80D + HRA + NPS to reduce taxable income legally. Pay less tax, build wealth! 🎯"
        }
    ],

    'l16': [ // Loan & EMI Explained
        {
            id: 'l16-intro', type: 'explanation', title: 'Understanding Loans 🏦',
            content: "A loan is borrowed money you must pay back with INTEREST. Let's understand how it works!"
        },
        {
            id: 'l16-emi', type: 'explanation', title: 'What is EMI? 💳',
            content: "EMI = Equated Monthly Installment. Instead of paying ₹50,000 at once, pay ₹4,500/month for 12 months. Easier... but costs more!"
        },
        {
            id: 'l16-interest', type: 'explanation', title: 'How Interest Works 📈',
            content: "Interest = Cost of borrowing. Example: Borrow ₹50,000 at 12% for 1 year →  Pay ₹53,000 total. Interest = ₹3,000 extra!"
        },
        {
            id: 'l16-example', type: 'explanation', title: 'Real Example 🔢',
            content: "₹50,000 loan at 12% for 12 months:\n- EMI: ₹4,440/month\n- Total paid: ₹53,280\n- Interest cost: ₹3,280\nYou pay 6.5% MORE than the actual price!"
        },
        {
            id: 'l16-hidden', type: 'explanation', title: 'Hidden Charges ⚠️',
            content: "Watch out for: Processing fee (1-3%), Late payment penalty (₹500-₹1000), Foreclosure charges. Read the fine print!"
        },
        {
            id: 'l16-q1', type: 'quiz', question: 'Higher interest rate means...',
            options: [
                { text: 'Lower EMI', correct: false },
                { text: 'Higher EMI and more total cost', correct: true },
                { text: 'No difference', correct: false },
            ]
        },
        {
            id: 'l16-summary', type: 'explanation', title: 'Borrow Smart!',
            content: "Only take loans for needs, not wants. Compare interest rates. Shorter tenure = less interest. Use our Loan Simulator next! 🎯"
        }
    ],

    'l17': [ // Understanding GST
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
    ],

    'l18': [ // What are Shares
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
    ],

    'l19': [ // Assets vs Liabilities
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
    ],

    'l20': [ // Stock Trading Simulator
        {
            id: 'l20-sim',
            type: 'simulation',
            simulationType: 'stockTrading',
            title: '📈 30-Day Stock Trading Game',
            config: {}
        }
    ]
};
