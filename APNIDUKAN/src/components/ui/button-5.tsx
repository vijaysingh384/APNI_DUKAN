import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Button5Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  hoverText?: string;
  hoverBgColor?: string;
  hoverTextColor?: string;
  showIcon?: boolean;
  className?: string;
}

export const Button5: React.FC<Button5Props> = ({
  children,
  hoverText,
  hoverBgColor = 'bg-green-400',
  hoverTextColor = 'text-white',
  showIcon = false,
  className,
  ...props
}) => {
  const displayHoverText = hoverText || children;

  return (
    <button
      className={cn(
        'group relative cursor-pointer p-2 border bg-white rounded-full overflow-hidden text-black text-center font-semibold transition-all duration-300',
        className
      )}
      {...props}
    >
      <span className="translate-y-0 group-hover:-translate-y-12 group-hover:opacity-0 transition-all duration-300 inline-block">
        {children}
      </span>
      <div
        className={cn(
          'flex gap-2 z-10 items-center absolute left-0 top-0 h-full w-full justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 rounded-full group-hover:rounded-none',
          hoverBgColor,
          hoverTextColor
        )}
      >
        <span>{displayHoverText}</span>
        {showIcon && <ArrowRight className="w-4 h-4" />}
      </div>
    </button>
  );
};

