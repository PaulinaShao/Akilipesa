import { Clock, CheckCircle, XCircle, Loader2, Play, Download } from 'lucide-react';
import { Card, CardContent, CardHeader } from './Card';
import { cn, formatDate } from '@/lib/utils';
import { Job } from '@/lib/mock-data';

interface JobCardProps {
  job: Job;
  onDownload?: (job: Job) => void;
  onRetry?: (job: Job) => void;
  className?: string;
}

export default function JobCard({ job, onDownload, onRetry, className }: JobCardProps) {
  const getStatusIcon = () => {
    switch (job.status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-accent-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-danger" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusText = () => {
    switch (job.status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = () => {
    switch (job.status) {
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'processing':
        return 'text-accent-500 bg-accent-100';
      case 'completed':
        return 'text-success bg-success/10';
      case 'failed':
        return 'text-danger bg-danger/10';
      default:
        return 'text-slate-500 bg-slate-100';
    }
  };

  const getTypeIcon = () => {
    switch (job.type) {
      case 'udio':
        return '🎵';
      case 'runway':
        return '🎬';
      case 'deepmotion':
        return '🕺';
      case 'tts':
        return '🗣️';
      default:
        return '⚡';
    }
  };

  return (
    <Card className={cn('relative overflow-hidden', className)} variant="glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getTypeIcon()}</div>
            <div>
              <h3 className="font-semibold text-slate-900">{job.title}</h3>
              <p className="text-sm text-slate-500">
                {formatDate(job.createdAt)}
              </p>
            </div>
          </div>
          <div className={cn(
            'flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium',
            getStatusColor()
          )}>
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {job.prompt && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {job.prompt}
          </p>
        )}

        {/* Progress Bar */}
        {job.status === 'processing' && typeof job.progress === 'number' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Progress</span>
              <span>{job.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${job.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Duration */}
        {job.completedAt && (
          <p className="text-xs text-slate-500 mb-4">
            Completed in {Math.round((job.completedAt.getTime() - job.createdAt.getTime()) / 1000 / 60)} minutes
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center space-x-2">
            {job.status === 'completed' && job.result && onDownload && (
              <button
                onClick={() => onDownload(job)}
                className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            )}
            {job.status === 'failed' && onRetry && (
              <button
                onClick={() => onRetry(job)}
                className="flex items-center space-x-2 text-sm text-accent-600 hover:text-accent-700 font-medium"
              >
                <Play className="w-4 h-4" />
                <span>Retry</span>
              </button>
            )}
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">
            {job.type}
          </div>
        </div>
      </CardContent>

      {/* Glow effect for processing jobs */}
      {job.status === 'processing' && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 animate-pulse-glow pointer-events-none" />
      )}
    </Card>
  );
}
