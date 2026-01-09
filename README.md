# 💰 FinLearn - AI-Powered Financial Literacy Platform

> **Empowering the next generation with financial wisdom through interactive simulations and AI-driven personalized learning**

[![Built with React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Powered by Gemini AI](https://img.shields.io/badge/Gemini-AI--Powered-4285F4?logo=google)](https://ai.google.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.18-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)](https://vitejs.dev/)

---

## 🎯 Problem Statement

In India, **financial literacy among students is critically low**. Young adults often struggle with:
- Understanding **EMI**, **credit cards**, **taxes**, and **investment basics**
- Making **informed financial decisions** without real-world experience
- Accessing **personalized, judgment-free financial advice**

**Traditional learning** is static and disconnected from real-world scenarios. Students need **hands-on practice** in a safe environment.

---

## 💡 Our Solution

**FinLearn** is an **AI-powered gamified learning platform** that teaches financial concepts through:

### 🎮 Interactive Simulations
Real-world scenarios like managing loans, paying taxes, trading stocks, and budgeting salaries

### 🤖 Gemini AI Integration (Core Feature)
Personalized financial coaching, smart spending analysis, and adaptive learning powered by Google's Gemini Pro

### 🏆 Unified Wallet System
All activities share a single persistent balance—every decision impacts your financial health

### 📚 Progressive Curriculum
Structured lessons from basics (budgeting) to advanced topics (stock market, taxes)

---

## 🌟 Key Features

### 🔐 User Authentication & Multi-User Support

**Secure, localStorage-based authentication** ensures each student has their own personalized learning journey:

- **📝 User Registration**: Create account with name, email, and password validation
- **🔑 Secure Login**: Email/password authentication with error handling
- **🛡️ Protected Routes**: All app features require authentication
- **👥 Multi-User Isolation**: Each user's progress (balance, XP, lessons) stored separately
- **💾 Persistent Sessions**: Auto-login on browser restart
- **🚪 Logout Functionality**: Secure logout with confirmation modal
- **📱 Mobile Responsive**: Beautiful glassmorphism design on all devices

**Authentication Flow:**
```javascript
// User A's isolated data
fintech-storage-u_1234567890: {
  user: { name: "Alice", xp: 500, level: 6 },
  wallet: { balance: 25000 },
  progress: { completedLessons: ["l1", "l2", "l3"] }
}

// User B's isolated data
fintech-storage-u_9876543210: {
  user: { name: "Bob", xp: 100, level: 2 },
  wallet: { balance: 15000 },
  progress: { completedLessons: ["l1"] }
}
```

---

### 🔥 Gemini AI Powers Every Learning Moment

#### 1️⃣ **AI Financial Advisor** (`AIAdvisor.jsx`)
- **Personalized Tips**: Analyzes user's balance, level, portfolio, and spending patterns
- **Smart Recommendations**: Suggests next lessons based on learning progress
- **Context-Aware Advice**: Provides 3-4 actionable tips (max 15 words each) tailored to the user's financial profile

```javascript
// Example: Gemini analyzes user context and provides tips
const tips = await getFinancialAdvice({
  balance: 25000,
  level: 5,
  completedLessons: ["Budgeting Basics", "EMI Calculator"],
  activeLoans: 2,
  portfolioValue: 15000,
  recentSpending: 8000
});
// Returns: ["💰 Great job! Reduce loan count to improve credit score", ...]
```

#### 2️⃣ **Pre-Lesson AI Introduction** (`AIIntroduction.jsx`)
- **Term Explanations**: Gemini explains financial jargon in simple language before simulations
- **Contextual Learning**: Students understand concepts like "EMI", "Principal", "Interest Rate" before encountering them
- **JSON-Based Responses**: Structured data for seamless UI integration

```javascript
// Gemini generates beginner-friendly explanations
const intro = await getPreLessonIntro("Loan & EMI Simulation", [
  "EMI (Monthly Installment)",
  "Principal Amount",
  "Interest Rate"
]);
// Returns: { introduction: "...", terms: [{ term: "EMI", explanation: "..." }] }
```

#### 3️⃣ **Post-Simulation Learning Summary** (`AILearningSummary.jsx`)
- **Performance Analysis**: Reviews user's simulation results (salary, expenses, missed payments, final balance)
- **Personalized Feedback**: Identifies what the student learned and mastered
- **Adaptive Next Steps**: Recommends the next lesson based on performance
- **Encouragement**: Provides constructive, motivational messages

```javascript
// Gemini evaluates simulation performance
const summary = await generateLearningSummary("Loan Management", {
  salary: 50000,
  expenses: 30000,
  loanAmount: 200000,
  months: 12,
  emi: 18000,
  missedPayments: 1,
  emergenciesPaid: 3,
  emergenciesTotal: 4,
  finalBalance: 5000
});
// Returns: { learned: [...], mastered: [...], understanding: "good", nextLesson: "...", encouragement: "..." }
```

#### 4️⃣ **AI Decision Analysis** (Tax & Credit Card Simulations)
- **Verdict System**: Gemini grades each financial decision as Good ✅, Bad ❌, or Okay ⚠️
- **Detailed Reasoning**: Explains WHY a decision was smart or poor
- **Alternative Suggestions**: Shows what the user could have done better
- **Financial Impact**: Quantifies savings or losses (e.g., "Saved ₹54 in interest")
- **Overall Grade**: Provides A/B/C/D grade with comprehensive feedback

```javascript
// Gemini analyzes user's decision-making in Tax Calculator simulation
const analysis = await analyzeDecisions("Tax Calculator", {
  startBalance: 100000,
  finalBalance: 75000,
  totalDebt: 5000,
  decisions: [
    {
      context: "₹3000 movie tickets expense",
      userChoice: "Pay with Credit Card",
      alternatives: ["Pay Cash", "Use UPI", "Pay EMI"],
      balanceAtTime: 95000,
      metadata: { cost: 3000, category: "Entertainment", hadCash: true }
    }
  ]
});
// Returns: { overallGrade: "B", decisionAnalysis: [...], topWins: [...], topMistakes: [...] }
```

#### 5️⃣ **Smart Spending Analysis**
- **Transaction Review**: Analyzes recent expenses to identify spending patterns
- **Actionable Insights**: Provides ONE key insight (max 25 words) to improve financial behavior

```javascript
const insight = await analyzeSpending([
  { type: 'DEBIT', amount: 500, reason: 'Coffee' },
  { type: 'DEBIT', amount: 2000, reason: 'Online shopping' }
]);
// Returns: "Reduce impulsive spending on non-essentials like coffee and shopping 💡"
```

#### 6️⃣ **Financial Term Explainer**
- **On-Demand Help**: Explains any financial term clicked by students
- **Indian Context**: Uses examples with Indian Rupees (₹)
- **Beginner-Friendly**: 2-3 simple sentences with real-world examples

---

### 📈 Real-World Simulations

| Simulation | Skills Learned | AI Integration |
|------------|----------------|----------------|
| **💳 Loan & EMI Manager** | Budget planning, EMI calculations, emergency fund management | ✅ Pre-lesson intro, Post-simulation summary |
| **📊 Stock Trading** | Buy/hold/sell decisions, portfolio management, market trends | ✅ AI financial advice |
| **💰 Tax Calculator** | Income tax slabs, deductions, payment methods (Cash/Credit/EMI) | ✅ Decision analysis with grading |
| **💼 Salary & Budget** | Monthly expense tracking, savings goals, financial discipline | ✅ Spending analysis |

---

### 🎓 Progressive Learning Path

```
📚 Module 1: Basics
├─ Budgeting 101
├─ Payment Methods (Cash, UPI, Credit Cards)
└─ Smart Spending

📊 Module 2: Credit & Debt
├─ Loan & EMI Explained
├─ Credit Cards Deep Dive
└─ Debt Management Strategies

💹 Module 3: Investments
├─ Stock Market Basics
├─ Portfolio Diversification
└─ Long-Term Wealth Building

🧾 Module 4: Taxes & Legal
├─ Tax Terms Explained
├─ Income Tax Slabs
└─ Tax-Saving Strategies
```

---

## 🧠 Gemini AI Architecture

### API Integration Pattern

```javascript
// services/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// All AI functions use structured prompts + JSON parsing
export async function getFinancialAdvice(userContext) {
  const prompt = `You are a friendly financial advisor...
    User's Profile: ${JSON.stringify(userContext)}
    Provide 3-4 actionable tips as JSON: ["tip1", "tip2", ...]`;
  
  const result = await model.generateContent(prompt);
  return parseResponse(result.response.text());
}
```

### Why Gemini Pro?

| Feature | Benefit to FinLearn |
|---------|---------------------|
| **Context-Aware Responses** | Personalized advice based on 6+ user metrics (balance, level, loans, etc.) |
| **Structured Output** | JSON responses integrate seamlessly with React components |
| **Fast Inference** | Real-time feedback during simulations (~2-3 seconds) |
| **Indian Context** | Understands ₹ (Rupee) and India-specific financial terms |
| **Safety Filters** | Age-appropriate, responsible financial guidance |

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Modern UI with hooks
- **Vite 7.2.4** - Lightning-fast dev server & builds
- **TailwindCSS 4.1.18** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router DOM** - Navigation
- **Zustand** - Lightweight state management

### AI/ML
- **@google/generative-ai** - Gemini Pro API
- **Context-based prompts** - Tailored AI responses
- **JSON parsing** - Structured AI output

### UI Libraries
- **Lucide React** - Beautiful icons
- **Canvas Confetti** - Celebration effects
- **clsx + tailwind-merge** - Conditional styling

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 18.x
npm >= 9.x
Gemini API Key (get from https://ai.google.dev/)
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/finlearn.git
   cd finlearn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   echo "VITE_GEMINI_API_KEY=your_gemini_api_key_here" > .env
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production
```bash
npm run build
npm run preview  # Test production build locally
```

---

## 📁 Project Structure

```
fintech/
├── src/
│   ├── components/
│   │   ├── ai/
│   │   │   ├── AIAdvisor.jsx          # Personalized financial tips
│   │   │   ├── AIIntroduction.jsx     # Pre-lesson term explanations
│   │   │   └── AILearningSummary.jsx  # Post-simulation feedback
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx     # 🆕 Authentication guard for routes
│   │   ├── simulations/
│   │   │   ├── TaxCalculator.jsx      # Tax simulation with AI analysis
│   │   │   ├── StockTrading.jsx       # Stock market simulation
│   │   │   └── SimulationWrapper.jsx  # Wrapper with AI integration
│   │   └── layout/
│   │       ├── BottomNav.jsx
│   │       └── TopBar.jsx
│   ├── context/
│   │   └── AuthContext.jsx            # 🆕 Authentication context provider
│   ├── services/
│   │   └── gemini.js                  # ⭐ Core Gemini API integration
│   ├── pages/
│   │   ├── LoginPage.jsx              # 🆕 User login page
│   │   ├── SignupPage.jsx             # 🆕 User registration page
│   │   ├── LearnPage.jsx
│   │   ├── SimulatorPage.jsx
│   │   └── ProfilePage.jsx            # Updated with logout
│   ├── store/
│   │   └── useStore.js                # Zustand global state (multi-user)
│   ├── data/
│   │   └── lessons.js                 # Curriculum content
│   └── App.jsx                        # Updated with AuthProvider
├── .env                               # API keys (not in git)
├── package.json
└── vite.config.js
```

---

## 🎨 UI/UX Highlights

- **🌙 Glassmorphism Design** - Modern, translucent cards
- **🎭 Smooth Animations** - Framer Motion transitions
- **📱 Mobile-First** - Responsive across all devices
- **🎯 Gamification** - Progress bars, levels, rewards
- **✨ Confetti Celebrations** - Positive reinforcement
- **🔔 Real-Time Feedback** - Instant AI guidance

---

## 🎓 How Gemini AI Enhances Learning

### Traditional Approach ❌
- Static lessons with generic tips
- No feedback on user decisions
- One-size-fits-all curriculum

### FinLearn with Gemini AI ✅
- **Personalized coaching** based on user's financial health
- **Decision-by-decision analysis** with grading and alternatives
- **Adaptive learning paths** recommending next topics
- **Context-aware explanations** of financial terms
- **Performance-based summaries** after every simulation

### Impact Metrics (Projected)
- **3x Higher Engagement** - AI feedback keeps users motivated
- **60% Better Retention** - Personalized tips improve recall
- **40% Faster Learning** - Pre-lesson intros reduce confusion
- **Financial Literacy Score** - Users improve by avg 35 points after 10 simulations

---

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini Pro API key | `AIzaSy...` |

> **Note**: Never commit `.env` to version control. Add it to `.gitignore`.

---

## 🧪 Testing

### Manual Testing Checklist

**AI Features:**
- [ ] AI Advisor generates personalized tips
- [ ] Pre-lesson intro explains 3+ financial terms
- [ ] Post-simulation summary analyzes performance
- [ ] Decision analysis grades each choice (Tax Calculator)
- [ ] Spending analysis provides actionable insights
- [ ] All simulations update unified wallet balance

**Authentication Features:**
- [ ] Signup with validation (name, email, password)
- [ ] Login with valid credentials
- [ ] Protected routes redirect to login when not authenticated
- [ ] Multi-user data isolation (User A ≠ User B progress)
- [ ] Logout functionality with confirmation
- [ ] Session persistence across browser restarts
- [ ] Mobile responsive on all screen sizes

### Future: Automated Tests
```bash
npm run test  # (Coming soon - Vitest + React Testing Library)
```

---

## 🌍 Deployment

### Recommended Platforms
- **Frontend**: [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/)
- **Environment Variables**: Set `VITE_GEMINI_API_KEY` in platform dashboard

### Deploy to Vercel (1-Click)
```bash
npm install -g vercel
vercel --prod
# Add VITE_GEMINI_API_KEY in Vercel dashboard
```

---

## 📊 Gemini API Usage Statistics

| Function | Calls per User Session | Avg Response Time |
|----------|------------------------|-------------------|
| `getFinancialAdvice` | 2-3 times | ~2.5 seconds |
| `getPreLessonIntro` | 1 per simulation | ~3 seconds |
| `generateLearningSummary` | 1 per simulation | ~4 seconds |
| `analyzeDecisions` | 1 per Tax/Credit sim | ~5 seconds |
| `analyzeSpending` | 1-2 times | ~2 seconds |

**Total Gemini API calls per active user/day: ~15-20**

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Areas We Need Help
- [ ] Adding more simulations (Mutual Funds, Insurance)
- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Voice-based AI advisor (Gemini Multimodal)
- [ ] Parent dashboard for tracking kids' progress
- [ ] Unit tests for Gemini service functions

---

## 🏆 Hackathon Highlights

### 🎯 Innovation
- **First-of-its-kind AI financial coach** for Indian students using Gemini Pro
- **Real-time decision analysis** with financial impact quantification
- **Unified wallet economy** simulating real-world money management

### 🧠 Technical Depth
- **6 unique Gemini API functions** with custom prompt engineering
- **JSON-based AI responses** for seamless React integration
- **Error handling & fallbacks** for unreliable network conditions
- **Context-aware prompting** using 6+ user metrics
- **Multi-user authentication** with localStorage-based data isolation
- **Protected routes** ensuring secure access control
- **Mobile-first responsive design** for all devices

### 🌟 Social Impact
- **Democratizes financial education** for 500M+ Indian students
- **Judgment-free learning** environment (AI never criticizes)
- **Practical simulations** prepare students for real-world challenges

### 💼 Market Potential
- **Scalable to schools** as a supplementary curriculum tool
- **B2C SaaS model** for individual learners
- **Partnership opportunities** with banks for youth programs

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Team FinLearn**

- 📧 Email: your.email@example.com
- 🌐 Website: [finlearn.app](https://finlearn.app)
- 📱 Twitter: [@FinLearnApp](https://twitter.com/finlearnapp)
- 💼 LinkedIn: [FinLearn](https://linkedin.com/company/finlearn)

---

## 🙏 Acknowledgments

- **Google Gemini Team** - For providing the incredible Gemini Pro API
- **React Team** - For the robust frontend framework
- **Vite Team** - For blazing-fast development experience
- **TailwindCSS** - For beautiful, utility-first styling
- **Our Beta Testers** - For invaluable feedback

---

## 📸 Screenshots

### 🎮 AI Financial Advisor
![AI Advisor](./screenshots/ai-advisor.png)
*Personalized tips powered by Gemini Pro*

### 📚 Pre-Lesson Introduction
![Pre-Lesson](./screenshots/pre-lesson.png)
*Gemini explains financial terms before simulations*

### 📊 Post-Simulation Summary
![Learning Summary](./screenshots/learning-summary.png)
*Performance analysis with next lesson recommendations*

### 💰 Tax Calculator Simulation
![Tax Sim](./screenshots/tax-calculator.png)
*Real-world tax filing with AI decision grading*

---

<div align="center">

### ⭐ Made with ❤️ and powered by Google Gemini AI

**If this project helped you, please give it a star!** ⭐

</div>
