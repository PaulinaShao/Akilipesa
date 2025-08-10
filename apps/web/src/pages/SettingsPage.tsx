import { useState } from 'react';
import { User, Bell, Globe, Shield, CreditCard, LogOut, Save, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/Card';
import NumberInputTZ from '@/components/NumberInputTZ';
import { getMockUser } from '@/lib/mock-data';
import { useToast } from '@/hooks/useToast';
import { cn, isValidEmail, isValidTanzanianPhone } from '@/lib/utils';

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  language: 'en' | 'sw';
  notifications: {
    email: boolean;
    sms: boolean;
    callReminders: boolean;
    jobUpdates: boolean;
  };
  privacy: {
    profileVisible: boolean;
    dataSharing: boolean;
    analytics: boolean;
  };
}

export default function SettingsPage() {
  const [user] = useState(getMockUser());
  const [settings, setSettings] = useState<UserSettings>({
    name: user.name,
    email: user.email,
    phone: user.phone,
    language: 'en',
    notifications: {
      email: true,
      sms: true,
      callReminders: true,
      jobUpdates: true,
    },
    privacy: {
      profileVisible: true,
      dataSharing: false,
      analytics: true,
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'billing'>('profile');
  const { addToast } = useToast();

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'privacy', name: 'Privacy', icon: <Shield className="w-5 h-5" /> },
    { id: 'billing', name: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
  ];

  const handleSave = async () => {
    if (!isValidEmail(settings.email)) {
      addToast({
        type: 'error',
        title: 'Invalid Email',
        description: 'Please enter a valid email address',
      });
      return;
    }

    if (!isValidTanzanianPhone(settings.phone)) {
      addToast({
        type: 'error',
        title: 'Invalid Phone Number',
        description: 'Please enter a valid Tanzanian phone number',
      });
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsEditing(false);
      addToast({
        type: 'success',
        title: 'Settings Saved',
        description: 'Your settings have been updated successfully',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        description: 'Unable to save settings. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    addToast({
      type: 'info',
      title: 'Signed Out',
      description: 'You have been signed out successfully',
    });
    // In a real app, this would sign out the user
    window.location.href = '/';
  };

  return (
    <div className="container-responsive section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-2 mb-2">Account Settings</h1>
          <p className="text-slate-600">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        'w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors',
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                          : 'text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      {tab.icon}
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="heading-3">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="btn-secondary"
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="btn-primary flex items-center space-x-2"
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Save</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className={cn('input', !isEditing && 'bg-slate-50')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className={cn('input', !isEditing && 'bg-slate-50')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <NumberInputTZ
                          value={settings.phone.replace('+', '')}
                          onChange={(value) => setSettings(prev => ({ ...prev, phone: `+${value}` }))}
                        />
                      ) : (
                        <input
                          type="text"
                          value={settings.phone}
                          disabled
                          className="input bg-slate-50"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value as 'en' | 'sw' }))}
                        disabled={!isEditing}
                        className={cn('input', !isEditing && 'bg-slate-50')}
                      >
                        <option value="en">English</option>
                        <option value="sw">Kiswahili</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <h2 className="heading-3">Notification Preferences</h2>
                  <p className="text-slate-600">Choose how you want to be notified about updates</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(settings.notifications).map(([key, enabled]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-slate-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {key === 'email' && 'Receive important updates via email'}
                            {key === 'sms' && 'Get SMS notifications for urgent matters'}
                            {key === 'callReminders' && 'Reminders for scheduled AI calls'}
                            {key === 'jobUpdates' && 'Updates when your AI jobs are completed'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                [key]: e.target.checked,
                              },
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'privacy' && (
              <Card>
                <CardHeader>
                  <h2 className="heading-3">Privacy & Security</h2>
                  <p className="text-slate-600">Control your privacy and data sharing preferences</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(settings.privacy).map(([key, enabled]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-slate-900 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <p className="text-sm text-slate-600">
                            {key === 'profileVisible' && 'Allow others to see your profile information'}
                            {key === 'dataSharing' && 'Share anonymous usage data to improve services'}
                            {key === 'analytics' && 'Enable analytics to personalize your experience'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              privacy: {
                                ...prev.privacy,
                                [key]: e.target.checked,
                              },
                            }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'billing' && (
              <Card>
                <CardHeader>
                  <h2 className="heading-3">Billing Information</h2>
                  <p className="text-slate-600">Manage your subscription and payment methods</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-900 mb-1">Current Plan</h4>
                        <p className="text-2xl font-bold text-primary-600 capitalize">{user.plan}</p>
                        <p className="text-sm text-slate-600">{user.credits} credits remaining</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-900 mb-1">Next Billing</h4>
                        <p className="text-slate-600">No recurring billing</p>
                        <p className="text-sm text-slate-600">Pay-as-you-go plan</p>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <button className="btn-primary w-full mb-4">
                        View Billing History
                      </button>
                      <button className="btn-secondary w-full">
                        Download Invoice
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sign Out Section */}
            <Card className="mt-8 border-danger/20 bg-danger/5">
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">Sign Out</h3>
                    <p className="text-sm text-slate-600">
                      Sign out of your AkiliPesa account on this device
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary text-danger border-danger hover:bg-danger hover:text-white flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
