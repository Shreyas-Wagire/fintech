import { cn } from '../../lib/utils';

export default function Card({ children, className, onClick }) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-4",
                className
            )}
        >
            {children}
        </div>
    );
}
