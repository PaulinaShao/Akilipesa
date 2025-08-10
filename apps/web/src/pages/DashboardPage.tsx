import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Plus, Activity, CreditCard, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/Card';
import JobCard from '@/components/JobCard';
import { getMockJobs, getMockCalls, getMockUser, Job, Call } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [user] = useState(getMockUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRecentJobs(getMockJobs().slice(0, 3));
      setRecentCalls(getMockCalls().slice(0, 3));
      setIsLoading(false);
    };

    loadData();
  }, []);

  const quickActions = [
    {
      title: 'Start AI Call',
      description: 'Get instant financial advice',
      icon: <Phone className="w-8 h-8 text-accent-500" />,
      href: '/calls',
      color: 'bg-accent-50 border-accent-200',
    },
    {
      title: 'Create Job',
      description: 'Generate content with AI',
      icon: <Plus className="w-8 h-8 text-primary-600" />,
      href: '/jobs',
      color: 'bg-primary-50 border-primary-200',
    },
    {
      title: 'View Billing',
      description: 'Manage credits and payments',
      icon: <CreditCard className="w-8 h-8 text-glow-400" />,
      href: '/billing',
      color: 'bg-blue-50 border-blue-200',
    },
  ];

  const stats = [
    {
      title: 'Available Credits',
      value: user.credits.toString(),
      icon: <CreditCard className="w-6 h-6 text-primary-600" />,
      change: '+12 this week',
      positive: true,
    },
    {
      title: 'Total Calls',
      value: '23',
      icon: <Phone className="w-6 h-6 text-accent-500" />,
      change: '+3 this week',
      positive: true,
    },
    {
      title: 'Jobs Created',
      value: '15',
      icon: <Activity className="w-6 h-6 text-glow-400" />,
      change: '+5 this month',
      positive: true,
    },
    {
      title: 'Account Plan',
      value: user.plan.charAt(0).toUpperCase() + user.plan.slice(1),
      icon: <TrendingUp className="w-6 h-6 text-success" />,
      change: 'Active',
      positive: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="container-responsive section-padding">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-slate-200 rounded-tanzanite"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-slate-200 rounded-tanzanite"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive section-padding">
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-2 mb-2">Welcome back, {user.name}!</h1>
        <p className="text-slate-600">Here's what's happening with your AkiliPesa account today.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.href}>
            <Card className={`hover:shadow-tanzanite cursor-pointer transition-all duration-200 ${action.color}`} hover={true}>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-slate-600">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <Card key={index} variant="glow">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className={`text-xs ${stat.positive ? 'text-success' : 'text-danger'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Jobs */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-3">Recent Jobs</h2>
            <Link to="/jobs" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {recentJobs.length > 0 ? (
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent>
                <div className="text-center py-8">
                  <Plus className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="font-medium text-slate-900 mb-2">No jobs yet</h3>
                  <p className="text-slate-600 mb-4">Create your first AI job to get started</p>
                  <Link to="/jobs" className="btn-primary">
                    Create Job
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="heading-3">Recent Activity</h2>
            <Link to="/calls" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          <Card>
            <CardContent>
              {recentCalls.length > 0 ? (
                <div className="space-y-4">
                  {recentCalls.map((call) => (
                    <div key={call.id} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${call.status === 'active' ? 'bg-success' : 'bg-slate-400'}`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">
                          {call.status === 'active' ? 'Active Call' : 'Completed Call'}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {formatDate(call.startTime)}
                        </p>
                        {call.duration && (
                          <p className="text-xs text-slate-500">
                            Duration: {Math.round(call.duration / 60)} minutes
                          </p>
                        )}
                      </div>
                      <Clock className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Phone className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="font-medium text-slate-900 mb-2">No calls yet</h3>
                  <p className="text-slate-600 mb-4">Start your first AI call for financial advice</p>
                  <Link to="/calls" className="btn-primary">
                    Start Call
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
