import { useState } from 'react';
import { X, Copy, CheckCircle, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createReferralLink, createShareMessage, shareVia, SHARE_EARN_CONFIG } from '@/lib/referral';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: 'product' | 'reel' | 'user' | 'shop';
  itemId: string;
  itemName: string;
  currentUserId: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  itemType,
  itemId,
  itemName,
  currentUserId,
}: ShareModalProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  if (!isOpen) return null;

  // Create referral link
  const referralLink = createReferralLink(currentUserId, itemType, itemId);
  const shareMessage = createShareMessage(itemType, itemName, referralLink.referralUrl);

  // Calculate potential earnings
  const potentialEarnings = SHARE_EARN_CONFIG[`${itemType}Share`] || 0;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(referralLink.referralUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'twitter' | 'telegram') => {
    shareVia(platform, referralLink.referralUrl, shareMessage);
    onClose();
  };

  const shareOptions = [
    {
      platform: 'whatsapp' as const,
      name: 'WhatsApp',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      ),
      color: 'text-[#25D366]',
      bgColor: 'bg-[#25D366]/20 hover:bg-[#25D366]/30',
    },
    {
      platform: 'facebook' as const,
      name: 'Facebook',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'text-[#1877F2]',
      bgColor: 'bg-[#1877F2]/20 hover:bg-[#1877F2]/30',
    },
    {
      platform: 'twitter' as const,
      name: 'X (Twitter)',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'text-white',
      bgColor: 'bg-black/40 hover:bg-black/60',
    },
    {
      platform: 'telegram' as const,
      name: 'Telegram',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      color: 'text-[#0088CC]',
      bgColor: 'bg-[#0088CC]/20 hover:bg-[#0088CC]/30',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-modal-backdrop"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-modal max-w-md mx-auto">
        <div className="card-gem p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-lg">Share & Earn</h3>
              <p className="text-white/60 text-sm">
                Share {itemName} and earn when people engage
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Earnings Info */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Earn TSH {potentialEarnings.toLocaleString()}</span>
            </div>
            <p className="text-white/80 text-sm">
              {itemType === 'product' && 'Earn when someone purchases through your link'}
              {itemType === 'reel' && 'Earn when your shared reel gets viewed'}
              {itemType === 'user' && 'Earn when someone signs up through your link'}
              {itemType === 'shop' && 'Earn when someone follows the shop through your link'}
            </p>
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">Your Referral Link</label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white/80 text-sm truncate">
                {referralLink.referralUrl}
              </div>
              <button 
                onClick={handleCopyLink}
                className={cn(
                  "px-4 py-2 rounded-lg transition-all flex items-center space-x-2",
                  linkCopied 
                    ? "bg-green-500/20 text-green-400" 
                    : "bg-white/10 hover:bg-white/20 text-white"
                )}
              >
                {linkCopied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <label className="text-white/80 text-sm font-medium">Share on Social Media</label>
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.platform}
                  onClick={() => handleShare(option.platform)}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-all",
                    option.bgColor,
                    option.color
                  )}
                >
                  {option.icon}
                  <span className="font-medium text-sm">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Referral Code */}
          <div className="text-center">
            <p className="text-white/60 text-xs">
              Referral Code: <span className="font-mono text-accent-400">{referralLink.referralCode}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
