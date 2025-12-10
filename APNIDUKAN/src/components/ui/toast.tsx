import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    
    const duration = toast.duration ?? 3000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
  warning: 'bg-yellow-500 text-white',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toastIcons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={cn(
                'flex items-center gap-3 p-4 rounded-lg shadow-lg',
                toastStyles[toast.type]
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="flex-1 text-sm font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Helper hook for easy toast usage
export function useToast() {
  const addToast = useToastStore((state) => state.addToast);
  
  return {
    success: (message: string, duration?: number) => addToast({ message, type: 'success', duration }),
    error: (message: string, duration?: number) => addToast({ message, type: 'error', duration }),
    info: (message: string, duration?: number) => addToast({ message, type: 'info', duration }),
    warning: (message: string, duration?: number) => addToast({ message, type: 'warning', duration }),
  };
}

