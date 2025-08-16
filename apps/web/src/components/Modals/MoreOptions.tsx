import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Flag, 
  UserX, 
  Link, 
  Download, 
  Settings, 
  HelpCircle, 
  Shield, 
  // Eye,
  EyeOff,
  // Volume2,
  // VolumeX,
  Bookmark,
  BookmarkX,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface MoreOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentCreator: string;
  contentType?: 'reel' | 'live' | 'post';
  isFollowing?: boolean;
  isSaved?: boolean;
  onReport?: () => void;
  onBlock?: () => void;
  onSave?: () => void;
  onDownload?: () => void;
}

interface MoreOption {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  variant?: 'default' | 'warning' | 'danger';
  divider?: boolean;
}

export default function MoreOptions({
  isOpen,
  onClose,
  contentId,
  contentCreator,
  contentType = 'reel',
  // isFollowing = false,
  isSaved = false,
  onReport,
  onBlock,
  onSave,
  onDownload
}: MoreOptionsProps) {
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const handleReport = () => {
    setShowReportModal(true);
  };

  const handleSubmitReport = () => {
    console.log('Reporting content:', { contentId, reason: reportReason });
    if (onReport) onReport();
    setShowReportModal(false);
    onClose();
  };

  const handleBlock = () => {
    console.log('Blocking user:', contentCreator);
    if (onBlock) onBlock();
    onClose();
  };

  const handleSave = () => {
    console.log('Saving content:', contentId);
    if (onSave) onSave();
    onClose();
  };

  const handleDownload = () => {
    console.log('Downloading content:', contentId);
    if (onDownload) onDownload();
    onClose();
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/${contentType}/${contentId}`;
    try {
      await navigator.clipboard.writeText(url);
      console.log('Link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
    onClose();
  };

  const handleNotInterested = () => {
    console.log('Not interested in content:', contentId);
    onClose();
  };

  const moreOptions: MoreOption[] = [
    {
      id: 'save',
      label: isSaved ? 'Remove from Saved' : 'Save',
      icon: isSaved ? BookmarkX : Bookmark,
      action: handleSave
    },
    {
      id: 'download',
      label: 'Download',
      icon: Download,
      action: handleDownload
    },
    {
      id: 'copy-link',
      label: 'Copy Link',
      icon: Link,
      action: handleCopyLink
    },
    {
      id: 'not-interested',
      label: 'Not Interested',
      icon: EyeOff,
      action: handleNotInterested,
      divider: true
    },
    {
      id: 'report',
      label: 'Report',
      icon: Flag,
      action: handleReport,
      variant: 'warning'
    },
    {
      id: 'block',
      label: `Block @${contentCreator}`,
      icon: UserX,
      action: handleBlock,
      variant: 'danger'
    }
  ];

  const reportReasons = [
    'Spam or misleading',
    'Inappropriate content',
    'Harassment or bullying',
    'Violence or dangerous behavior',
    'Intellectual property violation',
    'Other'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full bg-white rounded-t-3xl max-h-[80vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-6" />

            {/* Header */}
            <div className="px-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">More Options</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Options List */}
            <div className="py-4">
              {moreOptions.map((option, index) => (
                <div key={option.id}>
                  <button
                    onClick={option.action}
                    className={cn(
                      'w-full flex items-center space-x-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left',
                      option.variant === 'warning' && 'text-orange-600',
                      option.variant === 'danger' && 'text-red-600'
                    )}
                  >
                    <option.icon className="w-6 h-6 flex-shrink-0" />
                    <span className="font-medium">{option.label}</span>
                  </button>
                  {option.divider && (
                    <div className="mx-6 my-2 border-t border-gray-200" />
                  )}
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/settings')}
                  className="flex flex-col items-center space-y-1 p-2 hover:bg-white rounded-xl transition-colors"
                >
                  <Settings className="w-6 h-6 text-gray-600" />
                  <span className="text-xs text-gray-600">Settings</span>
                </button>
                <button
                  onClick={() => navigate('/help')}
                  className="flex flex-col items-center space-y-1 p-2 hover:bg-white rounded-xl transition-colors"
                >
                  <HelpCircle className="w-6 h-6 text-gray-600" />
                  <span className="text-xs text-gray-600">Help</span>
                </button>
                <button
                  onClick={() => navigate('/privacy')}
                  className="flex flex-col items-center space-y-1 p-2 hover:bg-white rounded-xl transition-colors"
                >
                  <Shield className="w-6 h-6 text-gray-600" />
                  <span className="text-xs text-gray-600">Privacy</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Report Modal */}
          <AnimatePresence>
            {showReportModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 flex items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-3xl p-6 w-full max-w-sm"
                >
                  <div className="text-center mb-6">
                    <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold mb-2">Report Content</h3>
                    <p className="text-gray-600">
                      Help us understand what's wrong with this content
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {reportReasons.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => setReportReason(reason)}
                        className={cn(
                          'w-full p-3 text-left rounded-xl border-2 transition-colors',
                          reportReason === reason
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowReportModal(false)}
                      className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReport}
                      disabled={!reportReason}
                      className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Report
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
