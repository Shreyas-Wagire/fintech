import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get AI Financial Advisor
export async function getFinancialAdvice(userContext) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `You are a friendly financial advisor helping a student learn about money management. 

User's Financial Profile:
- Current Balance: ₹${userContext.balance.toLocaleString()}
- Level: ${userContext.level}
- Completed Lessons: ${userContext.completedLessons}
- Active Loans: ${userContext.activeLoans}
- Portfolio Value: ₹${userContext.portfolioValue.toLocaleString()}
- Recent Spending: ₹${userContext.recentSpending.toLocaleString()}

Provide 3-4 **short, actionable tips** (each max 15 words) to help them improve their financial health. Be encouraging and specific to their situation. Use emojis.

Format as a JSON array of strings: ["tip1", "tip2", "tip3"]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Try to parse JSON response
        try {
            const tipsMatch = text.match(/\[.*\]/s);
            if (tipsMatch) {
                return JSON.parse(tipsMatch[0]);
            }
        } catch (e) {
            // Fallback: split by newlines
            return text.split('\n').filter(line => line.trim().length > 0).slice(0, 4);
        }

        return [
            "💰 Great start! Keep learning to grow your wealth",
            "📚 Complete more lessons to unlock new strategies",
            "🎯 Set a savings goal and track your progress"
        ];
    } catch (error) {
        console.error('Gemini AI Error:', error);
        // Fallback advice
        return [
            "💰 Save at least 20% of your income each month",
            "📚 Complete all lessons to master money management",
            "🎯 Track your spending to identify savings opportunities"
        ];
    }
}

// Get personalized lesson recommendation
export async function getNextLessonRecommendation(userContext) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Based on this user's profile, recommend which financial topic they should learn next:

Completed Lessons: ${userContext.completedLessons.join(', ')}
Current Level: ${userContext.level}
Balance: ₹${userContext.balance}
Active Loans: ${userContext.activeLoans}

Available topics: Budgeting, Loans & EMI, Stock Market, Credit Cards, Taxes, Savings

Respond with just the topic name and a one-sentence reason (max 20 words).
Format: "Topic: [name] - [reason]"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Gemini AI Error:', error);
        return "Budgeting - Master the basics to build a strong financial foundation";
    }
}

// Smart spending analysis
export async function analyzeSpending(transactions) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const recentExpenses = transactions
            .filter(t => t.type === 'DEBIT')
            .slice(0, 10)
            .map(t => `₹${t.amount} - ${t.reason}`)
            .join('\n');

        const prompt = `Analyze these recent expenses and provide ONE key insight (max 25 words):

${recentExpenses}

Focus on spending patterns or areas to improve. Be specific and actionable.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Gemini AI Error:', error);
        return "Track your expenses regularly to identify areas where you can save money 💡";
    }
}
