import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  Share,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { subscribeUserJobs, subscribeJob, cancelJob, type Job } from '@/modules/api';
import { useAppStore } from '@/store';

const statusConfig = {
  queued: {
    icon: Clock,
    label: 'Queued',
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10'
  },
  processing: {
    icon: RotateCcw,
    label: 'Processing',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10'
  },
  completed: {
    icon: CheckCircle,
    label: 'Completed',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10'
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10'
  }
};

interface JobCardProps {
  job: Job;
  onView: () => void;
  onCancel: () => void;
}

function JobCard({ job, onView, onCancel }: JobCardProps) {
  const status = statusConfig[job.status];
  const StatusIcon = status.icon;
  
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
      <div className="flex items-start gap-3">
        {/* Type Icon */}
        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        
        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-medium truncate">
              {job.inputs.prompt || `${job.type} generation`}
            </h3>
            <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full text-xs", status.bgColor, status.color)}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </div>
          </div>
          
          <div className="text-white/60 text-sm mb-3">
            Type: {job.type} • {new Date(job.createdAt).toLocaleDateString()}
          </div>
          
          {/* Progress Bar */}
          {job.status === 'processing' && (
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-white/60 mb-1">
                <span>Progress</span>
                <span>{job.progress || 0}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2 transition-all duration-300"
                  style={{ width: `${job.progress || 0}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Error Message */}
          {job.status === 'failed' && job.error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 mb-3">
              <p className="text-red-400 text-xs">{job.error}</p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {job.status === 'completed' && (
              <>
                <button
                  onClick={onView}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-primary text-sm transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  View
                </button>
                {job.outputs?.url && (
                  <>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-colors">
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm transition-colors">
                      <Share className="w-3 h-3" />
                      Share
                    </button>
                  </>
                )}
              </>
            )}
            
            {(job.status === 'queued' || job.status === 'processing') && (
              <button
                onClick={onCancel}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm transition-colors"
              >
                <XCircle className="w-3 h-3" />
                Cancel
              </button>
            )}
            
            {job.status === 'failed' && (
              <button className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-amber-400 text-sm transition-colors">
                <RotateCcw className="w-3 h-3" />
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppStore();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    location.state?.jobId || null
  );
  const [filter, setFilter] = useState<'all' | 'processing' | 'completed' | 'failed'>('all');

  useEffect(() => {
    if (!user) {
      // Show offline/demo jobs for guests
      const offlineJobs = JSON.parse(localStorage.getItem('offlineJobs') || '[]');
      setJobs(offlineJobs.map((job: any) => ({
        ...job,
        createdAt: new Date(job.createdAt),
        updatedAt: new Date(job.updatedAt || job.createdAt)
      })));
      return;
    }

    // Subscribe to user's jobs
    const unsubscribe = subscribeUserJobs(user.id, (userJobs) => {
      setJobs(userJobs);
    });

    return unsubscribe;
  }, [user]);

  // Subscribe to specific job if provided
  useEffect(() => {
    if (selectedJobId) {
      const unsubscribe = subscribeJob(selectedJobId, (job) => {
        if (job) {
          setJobs(prev => {
            const existing = prev.findIndex(j => j.id === job.id);
            if (existing >= 0) {
              const updated = [...prev];
              updated[existing] = job;
              return updated;
            } else {
              return [job, ...prev];
            }
          });
        }
      });

      return unsubscribe;
    }
  }, [selectedJobId]);

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const handleViewJob = (job: Job) => {
    if (job.outputs?.url) {
      // Open job result in a modal or new page
      window.open(job.outputs.url, '_blank');
    }
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      await cancelJob(jobId);
    } catch (error) {
      console.error('Failed to cancel job:', error);
    }
  };

  const statusCounts = {
    all: jobs.length,
    processing: jobs.filter(j => j.status === 'processing' || j.status === 'queued').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
  };

  return (
    <div className="h-screen-safe bg-gradient-to-b from-[#0b0c14] to-[#1a1235] overflow-y-auto">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/create')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <h1 className="text-xl font-semibold text-white">AI Jobs</h1>
          
          <div className="w-10" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 border-b border-white/10">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'All' },
            { key: 'processing', label: 'Active' },
            { key: 'completed', label: 'Done' },
            { key: 'failed', label: 'Failed' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all whitespace-nowrap",
                filter === tab.key
                  ? "bg-primary text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              )}
            >
              {tab.label}
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs",
                filter === tab.key
                  ? "bg-white/20"
                  : "bg-white/10"
              )}>
                {statusCounts[tab.key as keyof typeof statusCounts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="p-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">
              {filter === 'all' ? 'No AI jobs yet' : `No ${filter} jobs`}
            </h3>
            <p className="text-white/60 mb-6">
              {filter === 'all' 
                ? 'Create your first AI-generated content'
                : `You don't have any ${filter} jobs at the moment`
              }
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/create')}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl transition-colors"
              >
                Start Creating
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onView={() => handleViewJob(job)}
                onCancel={() => handleCancelJob(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
