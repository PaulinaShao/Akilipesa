import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, LogOut, UserX, Flag, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'danger' | 'warning' | 'info';
  icon?: React.ComponentType<any>;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default',
  icon,
  isLoading = false
}: ConfirmationModalProps) {
  
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white',
          defaultIcon: Trash2
        };
      case 'warning':
        return {
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-white',
          defaultIcon: AlertTriangle
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white',
          defaultIcon: AlertTriangle
        };
      default:
        return {
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          confirmButton: 'bg-primary hover:bg-primary/90 text-white',
          defaultIcon: AlertTriangle
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = icon || styles.defaultIcon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative bg-white rounded-3xl p-6 w-full max-w-sm"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Icon */}
            <div className="text-center mb-6">
              <div className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
                styles.iconBg
              )}>
                <IconComponent className={cn('w-8 h-8', styles.iconColor)} />
              </div>
              
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{message}</p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={cn(
                  'flex-1 py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center space-x-2',
                  styles.confirmButton
                )}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>{confirmText}</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Convenience components for common confirmation types
export const DeleteConfirmation = (props: Omit<ConfirmationModalProps, 'type' | 'icon'>) => (
  <ConfirmationModal {...props} type="danger" icon={Trash2} />
);

export const LogoutConfirmation = (props: Omit<ConfirmationModalProps, 'type' | 'icon'>) => (
  <ConfirmationModal {...props} type="warning" icon={LogOut} />
);

export const BlockConfirmation = (props: Omit<ConfirmationModalProps, 'type' | 'icon'>) => (
  <ConfirmationModal {...props} type="danger" icon={UserX} />
);

export const ReportConfirmation = (props: Omit<ConfirmationModalProps, 'type' | 'icon'>) => (
  <ConfirmationModal {...props} type="warning" icon={Flag} />
);
