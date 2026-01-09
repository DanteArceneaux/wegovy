import { memo } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

export const Card = memo(({ children, className = "", onClick, delay = 0 }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay,
      ease: [0.16, 1, 0.3, 1]
    }}
    whileTap={onClick ? { scale: 0.98 } : {}}
    onClick={onClick}
    className={`rounded-[2rem] p-6 transition-premium ${className}`}
  >
    {children}
  </motion.div>
));

Card.displayName = 'Card';


