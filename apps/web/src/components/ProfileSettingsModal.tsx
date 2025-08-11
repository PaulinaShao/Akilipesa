import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Settings,
  Edit3,
  Bell,
  Shield,
  Eye,
  UserX,
  Flag,
  Copy,
  Share,
  Download,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOwnProfile?: boolean;
  username: string;
}

const ownProfileOptions = [
  {
    id: 'edit',
    label: 'Edit Profile',
    icon: Edit3,
    action: 'edit',
    color: 'text-white'
  },
  {
    id: 'settings',
    label: 'Account Settings',
    icon: Settings,
    action: 'settings',
    color: 'text-white'
  },
  {
    id: 'notifications',
    label: 'Notification Settings',
    icon: Bell,
    action: 'notifications',
    color: 'text-white'
  },
  {
    id: 'privacy',
    label: 'Privacy & Security',
    icon: Shield,
    action: 'privacy',
    color: 'text-white'
  },
  {
    id: 'visibility',
    label: 'Profile Visibility',
    icon: Eye,
    action: 'visibility',
    color: 'text-white'
  },
  {
    id: 'archive',
    label: 'Archive Posts',
    icon: Archive,
    action: 'archive',
    color: 'text-white'
  },
  {
    id: 'download',
    label: 'Download Data',
    icon: Download,
    action: 'download',
    color: 'text-white'
  }
];

const otherProfileOptions = [
  {
    id: 'share',
    label: 'Share Profile',
    icon: Share,
    action: 'share',
    color: 'text-white'
  },
  {
    id: 'copy',
    label: 'Copy Profile Link',
    icon: Copy,
    action: 'copy',
    color: 'text-white'
  },
  {
    id: 'notifications',
    label: 'Turn on Notifications',
    icon: Bell,
    action: 'notifications',
    color: 'text-white'
  },
  {
    id: 'block',
    label: 'Block User',
    icon: Block,
    action: 'block',
    color: 'text-red-400'
  },
  {
    id: 'report',
    label: 'Report Profile',
    icon: Flag,
    action: 'report',
    color: 'text-red-400'
  }
];

export default function ProfileSettingsModal({ 
  isOpen, 
  onClose, 
  isOwnProfile = true, 
  username 
}: ProfileSettingsModalProps) {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);

  if (!isOpen) return null;

  const options = isOwnProfile ? ownProfileOptions : otherProfileOptions;

  const handleAction = (action: string) => {
    switch (action) {
      case 'edit':
        navigate('/settings');
        onClose();
        break;
      
      case 'settings':
        navigate('/settings');
        onClose();
        break;
      
      case 'notifications':
        navigate('/settings');
        onClose();
        break;
      
      case 'privacy':
        navigate('/settings');
        onClose();
        break;
      
      case 'visibility':
        // Handle profile visibility settings
        console.log('Profile visibility settings');
        break;
      
      case 'archive':
        // Handle archive posts
        console.log('Archive posts');
        break;
      
      case 'download':
        // Handle data download
        console.log('Download user data');
        break;
      
      case 'share':
        // Handle share profile
        console.log('Share profile');
        break;
      
      case 'copy':
        // Handle copy profile link
        navigator.clipboard.writeText(`https://akilipesa.com/profile/${username}`);
        break;
      
      case 'block':
        setShowConfirmDialog('block');
        break;
      
      case 'report':
        setShowConfirmDialog('report');
        break;
    }
  };

  const handleConfirmAction = (action: string) => {
    switch (action) {
      case 'block':
        console.log('User blocked');
        break;
      case 'report':
        console.log('Profile reported');
        break;
    }
    setShowConfirmDialog(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gem-dark border border-white/20 rounded-t-3xl p-6 safe-bottom">
        {!showConfirmDialog ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {isOwnProfile ? 'Profile Settings' : 'Profile Options'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="bg-white/10 rounded-2xl p-4 mb-6">
              <div className="text-center">
                <h3 className="text-white font-semibold">@{username}</h3>
                <p className="text-white/60 text-sm">
                  {isOwnProfile ? 'Your Profile' : 'User Profile'}
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {options.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleAction(option.action)}
                    className={cn(
                      'w-full flex items-center space-x-4 p-4 hover:bg-white/10 rounded-2xl transition-colors text-left',
                      option.color === 'text-red-400' && 'hover:bg-red-500/10'
                    )}
                  >
                    <IconComponent className={cn('w-5 h-5', option.color)} />
                    <span className={cn('font-medium', option.color)}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          /* Confirmation Dialog */
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex-center mx-auto mb-4">
              {showConfirmDialog === 'block' ? (
                <Block className="w-8 h-8 text-red-400" />
              ) : (
                <Flag className="w-8 h-8 text-red-400" />
              )}
            </div>
            
            <h3 className="text-white font-bold text-lg mb-2">
              {showConfirmDialog === 'block' ? 'Block User' : 'Report Profile'}
            </h3>
            
            <p className="text-white/80 text-sm mb-6">
              {showConfirmDialog === 'block' 
                ? `Are you sure you want to block @${username}? They won't be able to see your profile or contact you.`
                : `Are you sure you want to report @${username}? This will help us review their content for community guidelines violations.`
              }
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDialog(null)}
                className="flex-1 btn-gem-outline py-3"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmAction(showConfirmDialog)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {showConfirmDialog === 'block' ? 'Block' : 'Report'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
