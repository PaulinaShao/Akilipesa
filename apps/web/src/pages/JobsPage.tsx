import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Eye, RotateCcw, X } from 'lucide-react';
import { useUserJobs, useJob, JobUtils } from '../modules/jobs';
import { useAppStore } from '../store';

interface JobDetailsModalProps {
  jobId: string | null;
  onClose: () => void;
}

function JobDetailsModal({ jobId, onClose }: JobDetailsModalProps) {
  const { job, cancelJob, retry } = useJob(jobId || undefined);

  if (!jobId || !job) return null;

  const handleDownload = () => {
    if (job.outputs?.url) {
      window.open(job.outputs.url, '_blank');
    }
  };

  const handleShare = async () => {
    const shareUrl = JobUtils.getShareableUrl(job);
    if (shareUrl && navigator.share) {
      try {
        await navigator.share({
          title: `Check out my ${JobUtils.getJobTypeName(job.type)}`,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 z-50 max-w-lg mx-auto">
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-white/20 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{JobUtils.getStatusIcon(job.status)}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{JobUtils.getJobTypeName(job.type)}</h3>
                  <p className={`text-sm ${JobUtils.getStatusColor(job.status)}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Progress */}
            {job.status === 'processing' && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">Progress</span>
                  <span className="text-white">{job.progress || 0}%</span>
                </div>
                <div className="w-full bg-zinc-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-violet-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${job.progress || 0}%` }}
                  />
                </div>
              </div>
            )}

            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Prompt</label>
              <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-3">
                <p className="text-white text-sm">{job.inputs.prompt || 'No prompt provided'}</p>
              </div>
            </div>

            {/* Result */}
            {job.status === 'completed' && job.outputs?.url && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Result</label>
                <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-3">
                  {job.type === 'image' ? (
                    <img 
                      src={job.outputs.url} 
                      alt="Generated content"
                      className="w-full rounded-lg"
                    />
                  ) : job.type === 'video' ? (
                    <video 
                      src={job.outputs.url} 
                      controls
                      className="w-full rounded-lg"
                    />
                  ) : job.type === 'music' || job.type === 'voice' ? (
                    <audio 
                      src={job.outputs.url} 
                      controls
                      className="w-full"
                    />
                  ) : (
                    <a 
                      href={job.outputs.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:text-violet-300 underline"
                    >
                      View Result
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Error */}
            {job.status === 'failed' && job.error && (
              <div>
                <label className="block text-sm font-medium text-red-300 mb-2">Error</label>
                <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{job.error}</p>
                </div>
              </div>
            )}

            {/* Metadata */}
            {job.outputs?.metadata && (
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Details</label>
                <div className="bg-zinc-800 border border-zinc-600 rounded-lg p-3 space-y-1">
                  {JobUtils.parseMetadata(job.outputs.metadata).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-zinc-400">{item.key}:</span>
                      <span className="text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="text-xs text-zinc-500 space-y-1">
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{job.createdAt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{JobUtils.formatDuration(job.createdAt, job.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              {job.status === 'completed' && job.outputs?.url && (
                <>
                  <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </>
              )}

              {JobUtils.canCancel(job.status) && (
                <button
                  onClick={cancelJob}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}

              {JobUtils.canRetry(job.status) && (
                <button
                  onClick={retry}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function JobsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppStore();
  const { jobs, isLoading } = useUserJobs();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Check if we came here with a specific job ID
  useEffect(() => {
    const jobId = location.state?.jobId;
    if (jobId) {
      setSelectedJobId(jobId);
    }
  }, [location.state]);

  if (!user) {
    return (
      <div className="h-screen-safe bg-gradient-to-br from-[#0b0c14] to-[#2b1769] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Sign in Required</h2>
          <p className="text-zinc-400 mb-4">You need to sign in to view your jobs</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen-safe bg-gradient-to-br from-[#0b0c14] to-[#2b1769] overflow-y-auto">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">My Jobs</h1>
            <p className="text-zinc-400 text-sm">AI generation history</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-1/3" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎨</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Jobs Yet</h3>
            <p className="text-zinc-400 mb-6">Start creating with AI to see your jobs here</p>
            <button
              onClick={() => navigate('/create')}
              className="px-6 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors"
            >
              Create with AI
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/30 rounded-xl p-4 transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{JobUtils.getStatusIcon(job.status)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-semibold truncate">
                        {JobUtils.getJobTypeName(job.type)}
                      </h3>
                      <span className={`text-sm ${JobUtils.getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    
                    <p className="text-zinc-400 text-sm truncate mb-2">
                      {job.inputs.prompt || 'No prompt'}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>{job.createdAt.toLocaleDateString()}</span>
                      <span>{JobUtils.formatDuration(job.createdAt, job.updatedAt)}</span>
                    </div>
                  </div>

                  {job.status === 'processing' && (
                    <div className="w-16">
                      <div className="w-full bg-zinc-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-violet-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${job.progress || 0}%` }}
                        />
                      </div>
                      <div className="text-center text-xs text-zinc-400 mt-1">
                        {job.progress || 0}%
                      </div>
                    </div>
                  )}

                  {job.status === 'completed' && job.outputs?.url && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(job.outputs!.url, '_blank');
                        }}
                        className="p-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        jobId={selectedJobId}
        onClose={() => setSelectedJobId(null)}
      />
    </div>
  );
}
