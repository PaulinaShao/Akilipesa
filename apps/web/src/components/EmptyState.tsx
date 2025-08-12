import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className
}: EmptyStateProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionHref) {
      navigate(actionHref);
    }
  };

  return (
    <div className={cn('empty-state', className)}>
      {icon && (
        <div className="empty-state-icon">
          {icon}
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      <button
        onClick={handleAction}
        className="btn-primary"
      >
        {actionLabel}
      </button>
    </div>
  );
}
