import { useState, useEffect } from 'react';
import { Plus, Upload, Music, Video, User, MessageSquare, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/Card';
import JobCard from '@/components/JobCard';
import { getMockJobs, createMockJob, Job } from '@/lib/mock-data';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

type JobType = 'udio' | 'runway' | 'deepmotion' | 'tts';

interface CreateJobForm {
  type: JobType;
  prompt: string;
  file?: File;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all');
  const [createForm, setCreateForm] = useState<CreateJobForm>({
    type: 'udio',
    prompt: '',
  });
  const { addToast } = useToast();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setJobs(getMockJobs());
    setIsLoading(false);
  };

  const jobTypes = [
    {
      type: 'udio' as JobType,
      name: 'Music Generation',
      icon: <Music className="w-8 h-8 text-purple-500" />,
      description: 'Create custom music and audio content',
      placeholder: 'Describe the music you want to create (e.g., "Upbeat Afrobeat song with traditional drums")',
    },
    {
      type: 'runway' as JobType,
      name: 'Video Generation',
      icon: <Video className="w-8 h-8 text-blue-500" />,
      description: 'Generate videos from text descriptions',
      placeholder: 'Describe the video you want to create (e.g., "Time-lapse of Tanzanian sunset over Serengeti")',
    },
    {
      type: 'deepmotion' as JobType,
      name: 'Motion Capture',
      icon: <User className="w-8 h-8 text-green-500" />,
      description: 'Create animated characters and movements',
      placeholder: 'Describe the animation you want (e.g., "Dancing character performing traditional Tanzanian dance")',
    },
    {
      type: 'tts' as JobType,
      name: 'Text to Speech',
      icon: <MessageSquare className="w-8 h-8 text-orange-500" />,
      description: 'Convert text to natural-sounding speech',
      placeholder: 'Enter the text you want to convert to speech (Swahili and English supported)',
    },
  ];

  const handleCreateJob = async () => {
    if (!createForm.prompt.trim()) {
      addToast({
        type: 'error',
        title: 'Missing Prompt',
        description: 'Please provide a description for your job',
      });
      return;
    }

    setIsCreating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newJob = createMockJob(createForm.type, createForm.prompt);
      setJobs(prev => [newJob, ...prev]);
      
      setCreateForm({ type: 'udio', prompt: '' });
      setShowCreateForm(false);
      
      addToast({
        type: 'success',
        title: 'Job Created',
        description: 'Your AI job has been submitted and will be processed shortly',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to Create Job',
        description: 'Unable to create job. Please try again.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJobDownload = (job: Job) => {
    addToast({
      type: 'info',
      title: 'Download Started',
      description: `Downloading ${job.title}...`,
    });
  };

  const handleJobRetry = (job: Job) => {
    const retryJob = createMockJob(job.type, job.prompt || '');
    setJobs(prev => [retryJob, ...prev]);
    
    addToast({
      type: 'info',
      title: 'Job Retried',
      description: 'A new job has been created with the same parameters',
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.prompt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="container-responsive section-padding">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-200 rounded-tanzanite"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive section-padding">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="heading-2 mb-2">AI Content Generation</h1>
          <p className="text-slate-600">Create music, videos, animations, and voice content with AI</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Job</span>
        </button>
      </div>

      {/* Create Job Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="heading-3">Create New AI Job</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Job Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Select Job Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobTypes.map((jobType) => (
                      <button
                        key={jobType.type}
                        onClick={() => setCreateForm(prev => ({ ...prev, type: jobType.type }))}
                        className={cn(
                          'p-4 rounded-lg border-2 transition-all text-left',
                          createForm.type === jobType.type
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-slate-200 hover:border-slate-300'
                        )}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          {jobType.icon}
                          <span className="font-medium">{jobType.name}</span>
                        </div>
                        <p className="text-sm text-slate-600">{jobType.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={createForm.prompt}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, prompt: e.target.value }))}
                    placeholder={jobTypes.find(j => j.type === createForm.type)?.placeholder}
                    rows={4}
                    className="input resize-none"
                  />
                </div>

                {/* File Upload (for some job types) */}
                {(createForm.type === 'deepmotion' || createForm.type === 'tts') && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Upload File (Optional)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600 mb-2">
                        {createForm.type === 'tts' ? 'Upload text file' : 'Upload reference file'}
                      </p>
                      <input
                        type="file"
                        accept={createForm.type === 'tts' ? '.txt,.doc,.docx' : '.mp4,.mov,.avi'}
                        className="hidden"
                        id="file-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setCreateForm(prev => ({ ...prev, file }));
                          }
                        }}
                      />
                      <label htmlFor="file-upload" className="btn-secondary text-sm cursor-pointer">
                        Select File
                      </label>
                    </div>
                    {createForm.file && (
                      <p className="text-sm text-slate-600 mt-2">
                        Selected: {createForm.file.name}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="btn-secondary"
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateJob}
                    disabled={isCreating || !createForm.prompt.trim()}
                    className="btn-primary"
                  >
                    {isCreating ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      'Create Job'
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs..."
            className="input pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="input min-w-[120px]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDownload={handleJobDownload}
              onRetry={handleJobRetry}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <Plus className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="heading-3 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'No matching jobs' : 'No jobs yet'}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create your first AI job to get started with content generation'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary"
                >
                  Create Your First Job
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
