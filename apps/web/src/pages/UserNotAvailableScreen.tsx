import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  PhoneOff, 
  MessageCircle, 
  UserX, 
  Clock, 
  ArrowLeft,
  Heart,
  Bell,
  BellOff,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UserData {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline?: boolean;
  lastSeen?: string;
}

type UnavailableReason = 'offline' | 'busy' | 'declined' | 'no-response' | 'blocked';

export default function UserNotAvailableScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const userData = location.state?.targetUser as UserData || {
    id: '1',
    name: 'Amina Hassan',
    username: 'amina_tz',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9d38aad?w=150&h=150&fit=crop&crop=face',
    isOnline: false,
    lastSeen: '2 hours ago'
  };

  const reason = location.state?.reason as UnavailableReason || 'no-response';
  const callType = location.state?.callType as 'audio' | 'video' || 'video';

  const [isRetrying, setIsRetrying] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const getReasonData = (reason: UnavailableReason) => {
    switch (reason) {
      case 'offline':
        return {
          title: 'User is Offline',
          message: `${userData.name} is currently offline. Last seen ${userData.lastSeen}.`,
          icon: UserX,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          canRetry: false,
          canMessage: true,
          canNotify: true
        };
      case 'busy':
        return {
          title: 'User is Busy',
          message: `${userData.name} is currently in another call or unavailable.`,
          icon: PhoneOff,
          color: 'text-orange-500',
          bgColor: 'bg-orange-100',
          canRetry: true,
          canMessage: true,
          canNotify: true
        };
      case 'declined':
        return {
          title: 'Call Declined',
          message: `${userData.name} declined your call request.`,
          icon: PhoneOff,
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          canRetry: false,
          canMessage: true,
          canNotify: false
        };
      case 'no-response':
        return {
          title: 'No Response',
          message: `${userData.name} didn't respond to your call request.`,
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100',
          canRetry: true,
          canMessage: true,
          canNotify: true
        };
      case 'blocked':
        return {
          title: 'Unable to Connect',
          message: 'This user is currently unavailable for calls.',
          icon: UserX,
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          canRetry: false,
          canMessage: false,
          canNotify: false
        };
      default:
        return {
          title: 'Call Failed',
          message: 'Unable to connect to this user right now.',
          icon: PhoneOff,
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          canRetry: true,
          canMessage: true,
          canNotify: false
        };
    }
  };

  const reasonData = getReasonData(reason);

  const handleRetry = async () => {
    if (!reasonData.canRetry) return;
    
    setIsRetrying(true);
    
    // Simulate retry attempt
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo, randomly succeed or fail
    const success = Math.random() > 0.7;
    
    if (success) {
      navigate(`/call/retry-${userData.id}`, {
        state: {
          type: callType,
          targetUser: userData,
          retry: true
        }
      });
    } else {
      setIsRetrying(false);
      // Could show different reason or stay on same screen
    }
  };

  const handleMessage = () => {
    navigate(`/inbox/${userData.id}`, {
      state: { user: userData }
    });
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // In a real app, this would set up push notifications for when user comes online
    console.log('Notification preference:', !notificationsEnabled);
  };

  const handleBack = () => {
    navigate('/reels');
  };

  const handleViewProfile = () => {
    navigate(`/profile/${userData.id}`);
  };

  const IconComponent = reasonData.icon;

  return (
    <div className="h-screen-safe bg-white">
      {/* Header */}
      <div className="safe-top flex items-center justify-between p-4 border-b border-gray-100">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <h1 className="font-semibold">Call Status</h1>
        
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {/* User Avatar */}
        <div className="relative mb-6">
          <img
            src={userData.avatar}
            alt={userData.name}
            className="w-32 h-32 rounded-full border-4 border-gray-100"
          />
          
          {/* Status Indicator */}
          <div className={cn(
            'absolute -bottom-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center',
            reasonData.bgColor
          )}>
            <IconComponent className={cn('w-6 h-6', reasonData.color)} />
          </div>
        </div>

        {/* Status Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-2">{reasonData.title}</h2>
          <p className="text-gray-600 max-w-sm">{reasonData.message}</p>
        </motion.div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          {reasonData.canRetry && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Retrying...</span>
                </>
              ) : (
                <span>Try Again</span>
              )}
            </button>
          )}

          {reasonData.canMessage && (
            <button
              onClick={handleMessage}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Message</span>
            </button>
          )}

          {reasonData.canNotify && (
            <button
              onClick={handleToggleNotifications}
              className={cn(
                'w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2',
                notificationsEnabled
                  ? 'bg-green-50 hover:bg-green-100 text-green-700'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              )}
            >
              {notificationsEnabled ? (
                <>
                  <Bell className="w-5 h-5" />
                  <span>Notifications On</span>
                </>
              ) : (
                <>
                  <BellOff className="w-5 h-5" />
                  <span>Notify When Available</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Additional Actions */}
        <div className="mt-8 flex items-center space-x-6">
          <button
            onClick={handleViewProfile}
            className="flex flex-col items-center space-y-1 p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <UserX className="w-6 h-6 text-gray-600" />
            </div>
            <span className="text-xs text-gray-600">View Profile</span>
          </button>

          <button className="flex flex-col items-center space-y-1 p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-xs text-gray-600">Follow</span>
          </button>
        </div>

        {/* Suggestion */}
        {reason === 'offline' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 p-4 bg-blue-50 rounded-xl max-w-sm"
          >
            <p className="text-sm text-blue-700">
              💡 Tip: Send a message to schedule a call for later!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
