import { useEffect } from 'react';
import LoanSimulator from './LoanSimulator';
import BudgetChallenge from './BudgetChallenge';
import TaxCalculator from './TaxCalculator';
import useStore from '../../store/useStore';

export default function SimulationWrapper({ type, config, onComplete }) {
    const completeSimulation = useStore(state => state.completeSimulation);

    const handleComplete = () => {
        completeSimulation(type);
        onComplete();
    };

    switch (type) {
        case 'loan':
            return <LoanSimulator onComplete={handleComplete} {...config} />;
        case 'budget':
            return <BudgetChallenge onComplete={handleComplete} {...config} />;
        case 'tax':
            return <TaxCalculator onComplete={handleComplete} {...config} />;
        default:
            return <div>Unknown simulation type</div>;
    }
}
