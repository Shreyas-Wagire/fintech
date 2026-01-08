import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Button({
    children,
    variant = 'primary',
    className,
    onClick,
    disabled
}) {
    const baseStyles = "px-6 py-3 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed border-b-4 active:border-b-0 active:translate-y-1";

    const variants = {
        primary: "bg-brand-green text-white border-brand-green-dark hover:bg-opacity-90",
        secondary: "bg-brand-blue text-white border-blue-700 hover:bg-opacity-90",
        danger: "bg-brand-red text-white border-red-700 hover:bg-opacity-90",
        outline: "bg-white text-gray-500 border-gray-200 hover:bg-gray-50",
        ghost: "bg-transparent text-gray-500 border-transparent shadow-none px-2 py-1",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={disabled}
            className={cn(baseStyles, variants[variant], className)}
        >
            {children}
        </motion.button>
    );
}
