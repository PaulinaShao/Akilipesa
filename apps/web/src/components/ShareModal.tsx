import { useState } from 'react';
import { 
  X, 
  Copy, 
  MessageCircle, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Send,
  QrCode,
  Link
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileUrl?: string;
  username: string;
}

const shareOptions = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-500',
    action: 'whatsapp'
  },
  {
    id: 'copy',
    name: 'Copy Link',
    icon: Copy,
    color: 'bg-gray-500',
    action: 'copy'
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    color: 'bg-blue-500',
    action: 'email'
  },
  {
    id: 'sms',
    name: 'SMS',
    icon: Send,
    color: 'bg-purple-500',
    action: 'sms'
  },
  {
    id: 'qr',
    name: 'QR Code',
    icon: QrCode,
    color: 'bg-indigo-500',
    action: 'qr'
  },
  {
    id: 'direct',
    name: 'Direct Link',
    icon: Link,
    color: 'bg-orange-500',
    action: 'direct'
  }
];

export default function ShareModal({ isOpen, onClose, profileUrl, username }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const shareUrl = profileUrl || `https://akilipesa.com/profile/${username}`;
  const shareText = `Check out @${username}'s profile on AkiliPesa!`;

  const handleShare = async (action: string) => {
    switch (action) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
        break;
      
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;
      
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`, '_blank');
        break;
      
      case 'qr':
        setShowQR(true);
        break;
      
      case 'direct':
        if (navigator.share) {
          navigator.share({
            title: shareText,
            url: shareUrl,
          });
        } else {
          handleShare('copy');
        }
        break;
    }
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Share Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {!showQR ? (
          <>
            {/* Profile Preview */}
            <div className="bg-white/10 rounded-2xl p-4 mb-6">
              <div className="text-center">
                <h3 className="text-white font-semibold">@{username}</h3>
                <p className="text-white/60 text-sm">AkiliPesa Profile</p>
                <div className="mt-2 p-2 bg-white/10 rounded-lg">
                  <p className="text-xs text-white/80 font-mono break-all">{shareUrl}</p>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {shareOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleShare(option.action)}
                    className="flex flex-col items-center space-y-2 p-4 hover:bg-white/10 rounded-2xl transition-colors"
                  >
                    <div className={cn('w-12 h-12 rounded-full flex-center', option.color)}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs text-white font-medium">{option.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Copy */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-sm"
              />
              <button
                onClick={() => handleShare('copy')}
                className={cn(
                  'px-4 py-3 rounded-lg font-medium text-sm transition-colors',
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-primary hover:bg-primary/90 text-white'
                )}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </>
        ) : (
          /* QR Code View */
          <div className="text-center">
            <div className="bg-white rounded-2xl p-6 mb-4 mx-auto inline-block">
              <div className="w-48 h-48 bg-gradient-to-br from-primary to-secondary rounded-lg flex-center">
                <div className="text-white font-bold text-lg">QR Code</div>
              </div>
            </div>
            <p className="text-white/80 text-sm mb-4">
              Scan this QR code to view the profile
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="btn-gem-outline px-6 py-2"
            >
              Back to Sharing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
