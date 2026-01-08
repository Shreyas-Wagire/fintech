import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
            color: 'from-blue-500 to-cyan-600'
        },
        {
            id: 'l11',
            title: 'Budget Challenge',
            description: 'Manage your monthly budget for 3 months',
            icon: '💰',
            color: 'from-green-500 to-emerald-600'
        },
        {
            id: 'l14',
            title: 'Tax Calculator',
            description: 'Calculate your income tax and learn tax savings',
            icon: '🧮',
            color: 'from-purple-500 to-pink-600'
        }
    ];

    return (
        <div className="min-h-screen bg-off-white pt-20 pb-24 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Practice Simulators</h1>
                    <p className="text-gray-600">Learn by doing! Try these financial simulations</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {simulators.map((sim) => (
                        <Card
                            key={sim.id}
                            className="cursor-pointer hover:shadow-xl transition-all"
                            onClick={() => navigate(`/lesson/${sim.id}`)}
                        >
                            <div className={`bg-gradient-to-br ${sim.color} w-full h-32 rounded-t-lg flex items-center justify-center mb-4 -mt-4 -mx-4`}>
                                <span className="text-6xl">{sim.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{sim.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{sim.description}</p>
                            <Button variant="primary" className="w-full">
                                Start Simulation
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
