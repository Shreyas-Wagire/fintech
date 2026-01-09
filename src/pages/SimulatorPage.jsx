import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function SimulatorPage() {
    const navigate = useNavigate();

    const simulators = [
        {
            id: 'l10',
            title: 'Loan Simulator',
            description: 'Experience taking a loan and managing EMI payments',
            icon: '🏦',
            color: 'from-blue-500 to-cyan-600',
            difficulty: 'Medium'
        },
        {
            id: 'l14',
            title: 'Tax Calculator',
            description: 'Calculate your income tax and learn tax savings',
            icon: '🧮',
            color: 'from-purple-500 to-pink-600',
            difficulty: 'Advanced'
        },
        {
            id: 'l12',
            title: 'Money Month',
            description: 'Experience one month of money management with payment choices',
            icon: '💸',
            color: 'from-yellow-500 to-orange-600',
            difficulty: 'Beginner'
        }
    ];

    const difficultyColors = {
        'Beginner': 'bg-green-100 text-green-700',
        'Medium': 'bg-yellow-100 text-yellow-700',
        'Advanced': 'bg-red-100 text-red-700'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20 pb-24 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Premium Header */}
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-5xl font-extrabold mb-4">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Practice Simulators
                        </span>
                    </h1>
                    <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                        Learn by doing! Experience real financial scenarios in a risk-free environment
                    </p>
                </motion.div>

                {/* Premium Simulator Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {simulators.map((sim, index) => (
                        <motion.div
                            key={sim.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group"
                        >
                            <Card className="cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-300 transition-all duration-300 h-full bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl"
                                onClick={() => navigate(`/lesson/${sim.id}`)}
                            >
                                {/* Gradient Header */}
                                <div className={`bg-gradient-to-br ${sim.color} w-full h-40 flex items-center justify-center mb-4 -mt-4 -mx-4 relative overflow-hidden`}>
                                    {/* Decorative pattern */}
                                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                                    <motion.span
                                        className="text-7xl relative z-10"
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {sim.icon}
                                    </motion.span>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {/* Difficulty Badge */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyColors[sim.difficulty]}`}>
                                            {sim.difficulty}
                                        </span>
                                        <Zap className="w-4 h-4 text-yellow-500" />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-purple-600 transition-colors">
                                        {sim.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                                        {sim.description}
                                    </p>

                                    {/* Premium Button */}
                                    <Button
                                        variant="primary"
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Start Simulation
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Coming Soon Teaser */}
                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full border-2 border-purple-200">
                        <p className="text-purple-700 font-semibold">
                            ✨ More simulators coming soon!
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
