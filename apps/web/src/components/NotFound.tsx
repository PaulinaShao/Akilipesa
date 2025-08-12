import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Brand from './Brand';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-screen-safe flex-center text-center p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Brand size="md" showWordmark={true} animated={false} />
        </div>
        
        <h1 className="heading-2 mb-4">Page Not Found</h1>
        <p className="text-white/60 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <button
          onClick={() => navigate('/reels', { replace: true })}
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          <Home className="w-5 h-5" />
          Go Home
        </button>
      </div>
    </div>
  );
}
