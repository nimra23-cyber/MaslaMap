import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'article';
}

export function Card({ children, className = '', onClick, as = 'div' }: CardProps) {
  const Tag = as;
  return (
    <Tag
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 ${onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
