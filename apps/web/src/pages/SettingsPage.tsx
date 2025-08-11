import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Shield, 
  Bell, 
  Eye, 
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Lock,
  Smartphone,
  Mail,
  Camera,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfile {
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  verified: boolean;
}

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  postInteractions: boolean;
  newFollowers: boolean;
  mentions: boolean;
  liveStreamAlerts: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  allowDirectMessages: boolean;
  allowTagging: boolean;
  showOnlineStatus: boolean;
}

const mockUserProfile: UserProfile = {
  name: 'Paulina Shao',
  username: 'paulina_shao',
  email: 'paulina@example.com',
  phone: '+255 123 456 789',
  bio: 'Content creator & entrepreneur 🚀\nBuilding with AI in Tanzania 🇹🇿',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
  verified: true,
};

const mockNotificationSettings: NotificationSettings = {
  pushNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  marketingEmails: true,
  postInteractions: true,
  newFollowers: true,
  mentions: true,
  liveStreamAlerts: true,
};

const mockPrivacySettings: PrivacySettings = {
  profileVisibility: 'public',
  showEmail: false,
  showPhone: false,
  allowDirectMessages: true,
  allowTagging: true,
  showOnlineStatus: true,
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(mockNotificationSettings);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(mockPrivacySettings);
  const [selectedTab, setSelectedTab] = useState<'profile' | 'notifications' | 'privacy' | 'account'>('profile');
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    // Handle logout logic
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log('Delete account requested');
  };

  const handleSaveProfile = () => {
    console.log('Profile saved:', userProfile);
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { 
          label: 'Edit Profile', 
          icon: User, 
          action: () => setSelectedTab('profile'),
          badge: null 
        },
        { 
          label: 'Notifications', 
          icon: Bell, 
          action: () => setSelectedTab('notifications'),
          badge: null 
        },
        { 
          label: 'Privacy & Security', 
          icon: Shield, 
          action: () => setSelectedTab('privacy'),
          badge: null 
        },
        { 
          label: 'Payment Methods', 
          icon: CreditCard, 
          action: () => navigate('/billing'),
          badge: null 
        },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { 
          label: 'Dark Mode', 
          icon: darkMode ? Moon : Sun, 
          action: () => setDarkMode(!darkMode),
          badge: null,
          toggle: true,
          enabled: darkMode
        },
        { 
          label: 'Language', 
          icon: Globe, 
          action: () => navigate('/settings/language'),
          badge: 'English' 
        },
      ]
    },
    {
      title: 'Support',
      items: [
        { 
          label: 'Help Center', 
          icon: HelpCircle, 
          action: () => navigate('/help'),
          badge: null 
        },
        { 
          label: 'Contact Support', 
          icon: Mail, 
          action: () => navigate('/support'),
          badge: null 
        },
      ]
    },
    {
      title: 'Account',
      items: [
        { 
          label: 'Account Settings', 
          icon: Lock, 
          action: () => setSelectedTab('account'),
          badge: null 
        },
        { 
          label: 'Log Out', 
          icon: LogOut, 
          action: handleLogout,
          badge: null,
          danger: true 
        },
      ]
    }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'account', label: 'Account' },
  ];

  return (
    <div className="h-screen-safe bg-gem-dark overflow-y-auto">
      {/* Header */}
      <div className="safe-top p-4 border-b border-white/10 sticky top-0 bg-gem-dark/95 backdrop-blur-sm z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Settings</h1>
            <p className="text-sm text-white/60">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      {selectedTab === 'profile' ? (
        <div className="p-4 space-y-6">
          {/* Profile Picture */}
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-24 h-24 rounded-full border-4 border-accent-500/50"
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-accent-500 rounded-full flex-center">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Display Name</label>
              <input
                type="text"
                value={userProfile.name}
                onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:border-accent-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Username</label>
              <input
                type="text"
                value={userProfile.username}
                onChange={(e) => setUserProfile(prev => ({ ...prev, username: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:border-accent-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Bio</label>
              <textarea
                value={userProfile.bio}
                onChange={(e) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:border-accent-400 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Email</label>
              <input
                type="email"
                value={userProfile.email}
                onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:border-accent-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-white/80 text-sm font-medium block mb-2">Phone</label>
              <input
                type="tel"
                value={userProfile.phone}
                onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:border-accent-400 focus:outline-none"
              />
            </div>

            <button 
              onClick={handleSaveProfile}
              className="w-full btn-gem py-3"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : selectedTab === 'notifications' ? (
        <div className="p-4 space-y-6">
          <div className="space-y-4">
            <div className="card-gem p-4">
              <h3 className="text-white font-semibold mb-4">Push Notifications</h3>
              <div className="space-y-3">
                {Object.entries(notificationSettings).filter(([key]) => 
                  ['pushNotifications', 'postInteractions', 'newFollowers', 'mentions', 'liveStreamAlerts'].includes(key)
                ).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-white/80 text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <button
                      onClick={() => handleNotificationChange(key as keyof NotificationSettings)}
                      className={cn(
                        'w-12 h-6 rounded-full transition-colors relative',
                        value ? 'bg-accent-500' : 'bg-white/20'
                      )}
                    >
                      <div className={cn(
                        'w-4 h-4 bg-white rounded-full absolute top-1 transition-transform',
                        value ? 'translate-x-7' : 'translate-x-1'
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-gem p-4">
              <h3 className="text-white font-semibold mb-4">Communication</h3>
              <div className="space-y-3">
                {Object.entries(notificationSettings).filter(([key]) => 
                  ['emailNotifications', 'smsNotifications', 'marketingEmails'].includes(key)
                ).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-white/80 text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <button
                      onClick={() => handleNotificationChange(key as keyof NotificationSettings)}
                      className={cn(
                        'w-12 h-6 rounded-full transition-colors relative',
                        value ? 'bg-accent-500' : 'bg-white/20'
                      )}
                    >
                      <div className={cn(
                        'w-4 h-4 bg-white rounded-full absolute top-1 transition-transform',
                        value ? 'translate-x-7' : 'translate-x-1'
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : selectedTab === 'privacy' ? (
        <div className="p-4 space-y-6">
          <div className="card-gem p-4">
            <h3 className="text-white font-semibold mb-4">Profile Visibility</h3>
            <div className="space-y-3">
              {(['public', 'friends', 'private'] as const).map((visibility) => (
                <button
                  key={visibility}
                  onClick={() => handlePrivacyChange('profileVisibility', visibility)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg transition-colors',
                    privacySettings.profileVisibility === visibility
                      ? 'bg-accent-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  )}
                >
                  <div className="font-medium capitalize">{visibility}</div>
                  <div className="text-sm opacity-70">
                    {visibility === 'public' && 'Anyone can see your profile'}
                    {visibility === 'friends' && 'Only friends can see your profile'}
                    {visibility === 'private' && 'Only you can see your profile'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card-gem p-4">
            <h3 className="text-white font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Show Email</span>
                <button
                  onClick={() => handlePrivacyChange('showEmail', !privacySettings.showEmail)}
                  className={cn(
                    'w-12 h-6 rounded-full transition-colors relative',
                    privacySettings.showEmail ? 'bg-accent-500' : 'bg-white/20'
                  )}
                >
                  <div className={cn(
                    'w-4 h-4 bg-white rounded-full absolute top-1 transition-transform',
                    privacySettings.showEmail ? 'translate-x-7' : 'translate-x-1'
                  )} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Show Phone</span>
                <button
                  onClick={() => handlePrivacyChange('showPhone', !privacySettings.showPhone)}
                  className={cn(
                    'w-12 h-6 rounded-full transition-colors relative',
                    privacySettings.showPhone ? 'bg-accent-500' : 'bg-white/20'
                  )}
                >
                  <div className={cn(
                    'w-4 h-4 bg-white rounded-full absolute top-1 transition-transform',
                    privacySettings.showPhone ? 'translate-x-7' : 'translate-x-1'
                  )} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : selectedTab === 'account' ? (
        <div className="p-4 space-y-6">
          <div className="card-gem p-4">
            <h3 className="text-white font-semibold mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-white/60" />
                  <div>
                    <div className="text-white font-medium">Change Password</div>
                    <div className="text-white/60 text-sm">Update your account password</div>
                  </div>
                </div>
              </button>

              <button className="w-full text-left p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-white/60" />
                  <div>
                    <div className="text-white font-medium">Two-Factor Authentication</div>
                    <div className="text-white/60 text-sm">Add extra security to your account</div>
                  </div>
                </div>
              </button>

              <button 
                onClick={handleDeleteAccount}
                className="w-full text-left p-3 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Trash2 className="w-5 h-5 text-red-400" />
                  <div>
                    <div className="text-red-400 font-medium">Delete Account</div>
                    <div className="text-red-400/70 text-sm">Permanently delete your account</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4">
          {settingsSections.map((section) => (
            <div key={section.title} className="mb-8">
              <h2 className="text-white/60 text-sm font-medium mb-4 uppercase tracking-wide">
                {section.title}
              </h2>
              <div className="card-gem overflow-hidden">
                {section.items.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className={cn(
                        'w-full flex items-center justify-between p-4 text-left transition-colors',
                        index !== section.items.length - 1 && 'border-b border-white/10',
                        item.danger ? 'hover:bg-red-500/10' : 'hover:bg-white/5'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={cn(
                          'w-5 h-5',
                          item.danger ? 'text-red-400' : 'text-white/60'
                        )} />
                        <span className={cn(
                          'font-medium',
                          item.danger ? 'text-red-400' : 'text-white'
                        )}>
                          {item.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {item.toggle ? (
                          <div className={cn(
                            'w-12 h-6 rounded-full transition-colors relative',
                            item.enabled ? 'bg-accent-500' : 'bg-white/20'
                          )}>
                            <div className={cn(
                              'w-4 h-4 bg-white rounded-full absolute top-1 transition-transform',
                              item.enabled ? 'translate-x-7' : 'translate-x-1'
                            )} />
                          </div>
                        ) : (
                          <>
                            {item.badge && (
                              <span className="text-white/60 text-sm">{item.badge}</span>
                            )}
                            <ChevronRight className="w-4 h-4 text-white/40" />
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
