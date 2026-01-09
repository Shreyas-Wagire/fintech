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

// NEW: Explain a financial term in simple language
export async function explainFinancialTerm(term) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `Explain the financial term "${term}" to a beginner in 2-3 simple sentences. Use an example with Indian Rupees (₹). Be conversational and clear.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Gemini AI Error:', error);
        return `${term} is an important financial concept. Learn more about it to improve your money management skills.`;
    }
}

// NEW: Pre-lesson introduction with key terms (GENERIC)
export async function getPreLessonIntro(simulationTitle, terms) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const termsPrompt = terms.map((t, i) => `${i + 1}. ${t}`).join('\n');
        const prompt = `You're introducing a "${simulationTitle}" lesson to beginners. Explain these ${terms.length} key terms in simple language (1-2 sentences each):
${termsPrompt}

Format as JSON:
{
  "introduction": "Brief welcome message about learning ${simulationTitle.toLowerCase()}",
  "terms": [
    {"term": "${terms[0].split(' (')[0]}", "explanation": "..."},
    {"term": "${terms[1].split(' (')[0]}", "explanation": "..."},
    ...
  ]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Try to parse JSON
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.error('Failed to parse pre-lesson intro:', e);
        }

        // Fallback (generic)
        return {
            introduction: `Let's learn about ${simulationTitle}! Understanding these key terms will help you succeed.`,
            terms: terms.map(term => ({
                term: term.split(' (')[0],
                explanation: `${term} is an important concept you'll learn in this simulation.`
            }))
        };
    } catch (error) {
        console.error('Gemini AI Error:', error);
        return {
            introduction: `Let's learn about ${simulationTitle}!`,
            terms: terms.map(term => ({
                term: term.split(' (')[0],
                explanation: `${term} is a key concept in ${simulationTitle.toLowerCase()}.`
            }))
        };
    }
}

// NEW: Generate learning summary after simulation (GENERIC)
export async function generateLearningSummary(simulationTitle, simulationData) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `The user completed a "${simulationTitle}" simulation with these results:
- Salary: ₹${simulationData.salary.toLocaleString()}/month
- Monthly Expenses: ₹${simulationData.expenses.toLocaleString()}
- Loan Amount: ₹${simulationData.loanAmount.toLocaleString()}
- Loan Duration: ${simulationData.months} months
- Monthly EMI: ₹${simulationData.emi.toLocaleString()}
- Missed Payments: ${simulationData.missedPayments}
- Emergencies Paid: ${simulationData.emergenciesPaid}/${simulationData.emergenciesTotal}
- Final Balance: ₹${simulationData.finalBalance.toLocaleString()}

Based on this, provide a personalized learning summary as JSON:
{
  "learned": ["key takeaway 1", "key takeaway 2", "key takeaway 3"],
  "mastered": ["Concept 1", "Concept 2"],
  "understanding": "good/needs-improvement",
  "nextLesson": "Recommended topic - short reason",
  "encouragement": "Personalized encouraging message"
}

Be specific to their performance. If they had missed payments or negative balance, address it constructively.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Try to parse JSON
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.error('Failed to parse learning summary:', e);
        }

        // Fallback based on performance
        const performanceGood = simulationData.missedPayments === 0 && simulationData.finalBalance > 0;

        return {
            learned: [
                "Monthly EMI payments must fit within your disposable income",
                "Emergency funds are crucial for unexpected expenses",
                "Loan management requires disciplined budgeting"
            ],
            mastered: performanceGood ? ["Budget Planning", "EMI Management"] : ["Loan Basics"],
            understanding: performanceGood ? "good" : "needs-improvement",
            nextLesson: "Emergency Fund Planning - Learn to prepare for unexpected expenses",
            encouragement: performanceGood
                ? "Excellent work! You managed the loan responsibly and maintained a positive balance."
                : "Good effort! Managing loans is challenging. Try planning a bigger emergency buffer next time."
        };
    } catch (error) {
        console.error('Gemini AI Error:', error);
        return {
            learned: ["EMI management", "Budget planning", "Emergency handling"],
            mastered: ["Loan Basics"],
            understanding: "good",
            nextLesson: "Continue practicing financial management",
            encouragement: "Great job completing the simulation!"
        };
    }
}

// NEW: Analyze user decisions for detailed feedback
export async function analyzeDecisions(simulationTitle, decisionData) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a financial advisor analyzing a student's decisions in the "${simulationTitle}" simulation.

SIMULATION CONTEXT:
- Starting Balance: ₹${decisionData.startBalance}
- Final Balance: ₹${decisionData.finalBalance}
- Total Debt: ₹${decisionData.totalDebt || 0}

USER'S DECISIONS:
${decisionData.decisions.map((d, i) => `
Decision ${i + 1}: ${d.context}
- User chose: ${d.userChoice}
- Other options were: ${d.alternatives.join(', ')}
- Balance at time of decision: ₹${d.balanceAtTime}
- Expense cost: ₹${d.metadata.cost}
- Category: ${d.metadata.category}
${d.metadata.hadCash !== undefined ? `- Had sufficient cash: ${d.metadata.hadCash ? 'Yes' : 'No'}` : ''}
`).join('\n')}

ANALYZE EACH DECISION:
For every decision, determine if it was financially smart or not:
1. GOOD (✅) - smart financial choice
2. BAD (❌) - poor financial choice  
3. OKAY (⚠️) - acceptable but could be better

For each decision provide:
- Whether it was good/bad/okay
- WHY (one clear sentence)
- What would have been BETTER (one sentence)
- Financial impact if measurable (e.g., "Cost ₹54 in interest" or "Saved ₹200")

Also provide:
- Overall grade (A/B/C/D)
- Overall feedback (2-3 sentences about financial awareness)
- Top 2-3 smart decisions made
- Top 2-3 mistakes to learn from

Respond ONLY with valid JSON in this exact format:
{
    "overallGrade": "B",
    "overallFeedback": "Good financial awareness with some room for improvement",
    "decisionAnalysis": [
        {
            "decisionNumber": 1,
            "verdict": "good",
            "reasoning": "Used cash when available, avoiding unnecessary interest charges",
            "betterAlternative": "This was already a smart choice - well done!",
            "financialImpact": "Saved ₹54 in credit card interest"
        }
    ],
    "topWins": [
        "Used EMI for expensive emergency - preserved cash flow",
        "Paid credit card in full - avoided 18% interest"
    ],
    "topMistakes": [
        "Credit card for small purchases when cash available",
        "Impulsive spending on entertainment"
    ]
}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const analysisData = JSON.parse(jsonText);

        return analysisData;
    } catch (error) {
        console.error('Error analyzing decisions:', error);
        // Return fallback analysis
        return {
            overallGrade: 'C',
            overallFeedback: 'Unable to generate detailed analysis. Review your decisions manually.',
            decisionAnalysis: decisionData.decisions.map((d, i) => ({
                decisionNumber: i + 1,
                verdict: 'okay',
                reasoning: 'Analysis unavailable',
                betterAlternative: 'Consider if this was the most cost-effective choice',
                financialImpact: null
            })),
            topWins: ['Completed the simulation'],
            topMistakes: ['AI analysis failed - try again']
        };
    }
}
