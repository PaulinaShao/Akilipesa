import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Clock, Users, Zap } from 'lucide-react';

export const TrialPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0c14] to-[#2b1769] text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to="/reels" 
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Guest Trial Policy</h1>
            <p className="text-zinc-400">Understanding your trial experience</p>
          </div>
        </div>

        {/* Trial Overview */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-violet-500" />
            <h2 className="text-xl font-semibold">What's Included in Your Trial</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="font-medium mb-2 text-green-400">✓ Free Browsing</h3>
              <p className="text-sm text-zinc-400">
                Unlimited access to browse reels, discover content, and explore the platform
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="font-medium mb-2 text-blue-400">⏱ Limited Actions</h3>
              <p className="text-sm text-zinc-400">
                Daily quotas for calls, AI chat, and reactions to help you experience key features
              </p>
            </div>
            
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="font-medium mb-2 text-violet-400">🚀 Easy Upgrade</h3>
              <p className="text-sm text-zinc-400">
                Simple sign-up process to unlock unlimited access to all platform features
              </p>
            </div>
          </div>
        </div>

        {/* Daily Quotas */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold">Daily Trial Quotas</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <h3 className="font-medium">Voice & Video Calls</h3>
                <p className="text-sm text-zinc-400">Short calls to experience our calling feature</p>
              </div>
              <span className="bg-violet-500/20 text-violet-400 px-3 py-1 rounded-full text-sm font-medium">
                1 call (90 seconds)
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <h3 className="font-medium">AI Chat Messages</h3>
                <p className="text-sm text-zinc-400">Chat with our AI assistant for trading insights</p>
              </div>
              <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                3 messages
              </span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium">Reactions & Saves</h3>
                <p className="text-sm text-zinc-400">Like, heart, and save content you enjoy</p>
              </div>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                5 reactions
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <p className="text-sm text-orange-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Quotas reset daily at midnight (East Africa Time)
            </p>
          </div>
        </div>

        {/* Security & Fair Use */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold">Security & Fair Use</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Device & IP Tracking</h3>
              <p className="text-sm text-zinc-400">
                Trial quotas are tracked per device and IP address to ensure fair usage. 
                We use privacy-safe hashing for IP addresses.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Anti-Abuse Protection</h3>
              <p className="text-sm text-zinc-400">
                reCAPTCHA Enterprise helps us verify legitimate users and prevent automated abuse. 
                Some actions may require completing a quick verification.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Quality Assurance</h3>
              <p className="text-sm text-zinc-400">
                Trial calls are limited in duration and quality to manage infrastructure costs. 
                Full members enjoy HD quality and extended call times.
              </p>
            </div>
          </div>
        </div>

        {/* Upgrade Benefits */}
        <div className="bg-gradient-to-r from-violet-500/20 to-blue-500/20 border border-violet-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-violet-400" />
            <h2 className="text-xl font-semibold">Unlock Full Access</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <h3 className="font-medium text-violet-400">Unlimited Features</h3>
              <ul className="text-sm text-zinc-300 space-y-1">
                <li>• Unlimited calls of any duration</li>
                <li>• Unlimited AI conversations</li>
                <li>• Unlimited reactions and follows</li>
                <li>• HD video and crystal-clear audio</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-green-400">Exclusive Benefits</h3>
              <ul className="text-sm text-zinc-300 space-y-1">
                <li>• Earn rewards from activities</li>
                <li>• Create and sell content</li>
                <li>• Access to premium features</li>
                <li>• Priority customer support</li>
              </ul>
            </div>
          </div>
          
          <Link
            to="/reels"
            className="inline-block bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            Start Your Journey
          </Link>
        </div>

        {/* Contact */}
        <div className="text-center">
          <p className="text-zinc-400 text-sm">
            Questions about our trial policy?{' '}
            <Link to="/support" className="text-violet-400 hover:text-violet-300">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
