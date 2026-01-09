import { useParams } from 'react-router-dom';
import LoanSimulator from './LoanSimulator';
import TaxCalculator from './TaxCalculator';
import MoneyMonth from './MoneyMonth';
import StockTrading from './StockTrading';
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
        case 'tax':
            return <TaxCalculator onComplete={handleComplete} {...config} />;
        case 'moneyMonth':
            return <MoneyMonth onComplete={handleComplete} {...config} />;
        case 'stockTrading':
            return <StockTrading onComplete={handleComplete} {...config} />;
        default:
            return <div>Unknown simulation type</div>;
    }
}
