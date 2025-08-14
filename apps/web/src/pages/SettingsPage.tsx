import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronRight,
  User,
  Shield,
  Bell,
  CreditCard,
  HelpCircle,
  FileText,
  LogOut,
  Settings,
  Eye,
  Heart,
  Share,
  Download,
  Globe,
  Lock,
  Moon,
  Sun,
  Smartphone,
  Mail,
  MessageCircle,
  Phone,
  Crown,
  Star,
  DollarSign,
  Link as LinkIcon,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LogoutConfirmation } from '@/components/ConfirmationModal';

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description?: string;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description?: string;
  action: 'navigate' | 'toggle' | 'modal';
  path?: string;
  value?: boolean;
  badge?: string;
  color?: string;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  const settingsSections: SettingsSection[] = [
    {
      id: 'account',
      title: 'Account',
      icon: User,
      description: 'Manage your profile and account settings',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          icon: User,
          description: 'Update your profile information',
          action: 'navigate',
          path: '/profile/edit'
        },
        {
          id: 'subscription',
          title: 'Subscription',
          icon: Crown,
          description: 'Manage your premium plan',
          action: 'navigate',
          path: '/subscription',
          badge: 'Premium',
          color: 'text-yellow-600'
        },
        {
          id: 'billing',
          title: 'Billing & Payments',
          icon: CreditCard,
          description: 'Payment methods and billing history',
          action: 'navigate',
          path: '/billing'
        },
        {
          id: 'earnings',
          title: 'Earnings Dashboard',
          icon: DollarSign,
          description: 'View your earnings and payouts',
          action: 'navigate',
          path: '/earnings'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Control your privacy and security settings',
      items: [
        {
          id: 'privacy-settings',
          title: 'Privacy Settings',
          icon: Lock,
          description: 'Control who can see your content',
          action: 'navigate',
          path: '/settings/privacy'
        },
        {
          id: 'private-profile',
          title: 'Private Profile',
          icon: Eye,
          description: 'Make your profile private',
          action: 'toggle',
          value: privateProfile
        },
        {
          id: 'blocked-users',
          title: 'Blocked Users',
          icon: User,
          description: 'Manage blocked accounts',
          action: 'navigate',
          path: '/settings/blocked'
        },
        {
          id: 'data-download',
          title: 'Download My Data',
          icon: Download,
          description: 'Request a copy of your data',
          action: 'navigate',
          path: '/settings/data'
        }
      ]
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Manage your notification preferences',
      items: [
        {
          id: 'push-notifications',
          title: 'Push Notifications',
          icon: Smartphone,
          description: 'Receive notifications on your device',
          action: 'toggle',
          value: notifications
        },
        {
          id: 'email-notifications',
          title: 'Email Notifications',
          icon: Mail,
          description: 'Receive updates via email',
          action: 'navigate',
          path: '/settings/email-notifications'
        },
        {
          id: 'live-notifications',
          title: 'Live Stream Alerts',
          icon: MessageCircle,
          description: 'Get notified when creators go live',
          action: 'navigate',
          path: '/settings/live-notifications'
        }
      ]
    },
    {
      id: 'content',
      title: 'Content & Sharing',
      icon: Share,
      description: 'Manage content and sharing preferences',
      items: [
        {
          id: 'watermark-settings',
          title: 'Watermark Settings',
          icon: Star,
          description: 'Customize your content watermark',
          action: 'navigate',
          path: '/settings/watermark'
        },
        {
          id: 'linked-accounts',
          title: 'Linked Social Accounts',
          icon: LinkIcon,
          description: 'Connect Instagram, YouTube, TikTok',
          action: 'navigate',
          path: '/settings/linked-accounts'
        },
        {
          id: 'auto-share',
          title: 'Auto-Share Settings',
          icon: Globe,
          description: 'Automatically share to other platforms',
          action: 'navigate',
          path: '/settings/auto-share'
        },
        {
          id: 'saved-content',
          title: 'Saved Content',
          icon: Heart,
          description: 'Manage your saved posts and videos',
          action: 'navigate',
          path: '/saved'
        }
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Settings,
      description: 'Customize the app appearance',
      items: [
        {
          id: 'dark-mode',
          title: 'Dark Mode',
          icon: darkMode ? Moon : Sun,
          description: 'Switch between light and dark theme',
          action: 'toggle',
          value: darkMode
        },
        {
          id: 'language',
          title: 'Language',
          icon: Globe,
          description: 'English',
          action: 'navigate',
          path: '/settings/language'
        }
      ]
    },
    {
      id: 'support',
      title: 'Support & Legal',
      icon: HelpCircle,
      description: 'Get help and view legal information',
      items: [
        {
          id: 'help-center',
          title: 'Help Center',
          icon: HelpCircle,
          description: 'Get help and support',
          action: 'navigate',
          path: '/help'
        },
        {
          id: 'contact-support',
          title: 'Contact Support',
          icon: MessageCircle,
          description: 'Get in touch with our team',
          action: 'navigate',
          path: '/support'
        },
        {
          id: 'terms',
          title: 'Terms of Service',
          icon: FileText,
          description: 'Read our terms and conditions',
          action: 'navigate',
          path: '/terms'
        },
        {
          id: 'privacy-policy',
          title: 'Privacy Policy',
          icon: Shield,
          description: 'View our privacy policy',
          action: 'navigate',
          path: '/privacy'
        }
      ]
    },
    {
      id: 'danger',
      title: 'Account Management',
      icon: AlertTriangle,
      description: 'Dangerous actions and account deletion',
      items: [
        {
          id: 'deactivate',
          title: 'Deactivate Account',
          icon: User,
          description: 'Temporarily deactivate your account',
          action: 'navigate',
          path: '/settings/deactivate',
          color: 'text-orange-600'
        },
        {
          id: 'delete-account',
          title: 'Delete Account',
          icon: Trash2,
          description: 'Permanently delete your account',
          action: 'navigate',
          path: '/settings/delete',
          color: 'text-red-600'
        }
      ]
    }
  ];

  const handleItemAction = (item: SettingsItem) => {
    switch (item.action) {
      case 'navigate':
        if (item.path) {
          navigate(item.path);
        }
        break;
      case 'toggle':
        if (item.id === 'dark-mode') {
          setDarkMode(!darkMode);
        } else if (item.id === 'push-notifications') {
          setNotifications(!notifications);
        } else if (item.id === 'private-profile') {
          setPrivateProfile(!privateProfile);
        }
        break;
      case 'modal':
        // Handle modal actions
        break;
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    // Perform logout
    console.log('Logging out...');
    navigate('/login');
  };

  return (
    <div className="h-screen-safe bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 safe-top">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <h1 className="text-xl font-bold">Settings</h1>
          
          <div className="w-10" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Summary */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <img
              src="https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face"
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Paulina Shao</h2>
              <p className="text-gray-600">@paulina_shao</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                  Premium
                </span>
                <span className="text-sm text-gray-500">Member since 2024</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile/edit')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors"
            >
              Edit
            </button>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="p-4 space-y-6">
          {settingsSections.map((section) => (
            <div key={section.id} className="space-y-3">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{section.title}</h3>
                  {section.description && (
                    <p className="text-sm text-gray-600">{section.description}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemAction(item)}
                    className={cn(
                      'w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left',
                      section.id === 'danger' && 'hover:bg-red-50'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      section.id === 'danger' ? 'bg-red-100' : 'bg-gray-100'
                    )}>
                      <item.icon className={cn(
                        'w-5 h-5',
                        item.color || (section.id === 'danger' ? 'text-red-600' : 'text-gray-600')
                      )} />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={cn(
                        'font-medium',
                        item.color
                      )}>
                        {item.title}
                        {item.badge && (
                          <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </h4>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                    </div>

                    {item.action === 'toggle' ? (
                      <div className={cn(
                        'w-12 h-6 rounded-full transition-colors',
                        item.value ? 'bg-primary' : 'bg-gray-300'
                      )}>
                        <div className={cn(
                          'w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5',
                          item.value ? 'translate-x-6' : 'translate-x-0.5'
                        )} />
                      </div>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 hover:bg-red-50 rounded-xl transition-colors text-left"
            >
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium text-red-600">Log Out</h4>
                <p className="text-sm text-gray-600">Sign out of your account</p>
              </div>
              
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* App Info */}
          <div className="pt-6 text-center text-sm text-gray-500">
            <p>AkiliPesa v1.0.0</p>
            <p>© 2024 AkiliPesa. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Logout Confirmation */}
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        onConfirm={confirmLogout}
        title="Log Out"
        message="Are you sure you want to log out of your account?"
        confirmText="Log Out"
      />
    </div>
  );
}
