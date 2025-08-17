// Utilities for handling call initiation and incoming call management

export interface CallInitiationParams {
  targetId: string;
  callType: 'audio' | 'video';
  targetName?: string;
  targetAvatar?: string;
}

export interface IncomingCallData {
  caller: {
    id: string;
    name: string;
    avatar: string;
    username: string;
  };
  callType: 'audio' | 'video';
}

// Global call state management
let incomingCallHandler: ((call: IncomingCallData | null) => void) | null = null;

export function setIncomingCallHandler(handler: (call: IncomingCallData | null) => void) {
  incomingCallHandler = handler;
}

export function showIncomingCall(callData: IncomingCallData) {
  if (incomingCallHandler) {
    incomingCallHandler(callData);
  }
}

export function hideIncomingCall() {
  if (incomingCallHandler) {
    incomingCallHandler(null);
  }
}

/**
 * Initiate a call - this should only be called when user explicitly taps call button
 */
export async function initiateCall(params: CallInitiationParams): Promise<void> {
  try {
    console.log('Initiating call to:', params.targetId, 'type:', params.callType);
    
    // For now, simulate an incoming call for demo purposes
    // In a real app, this would send a call request to the target user
    showIncomingCall({
      caller: {
        id: params.targetId,
        name: params.targetName || 'Unknown User',
        avatar: params.targetAvatar || '',
        username: params.targetName?.toLowerCase().replace(' ', '_') || 'user'
      },
      callType: params.callType
    });
  } catch (error) {
    console.error('Failed to initiate call:', error);
    throw error;
  }
}

/**
 * Handle accepting a call
 */
export function acceptCall(callData: IncomingCallData) {
  hideIncomingCall();
  // Navigate to call screen
  window.location.href = `/call/new?type=${callData.callType}&target=${callData.caller.id}`;
}

/**
 * Handle declining a call
 */
export function declineCall() {
  hideIncomingCall();
}

/**
 * Handle sending a message instead of accepting call
 */
export function messageInsteadOfCall(callData: IncomingCallData) {
  hideIncomingCall();
  // Navigate to chat
  window.location.href = `/chat/ai`;
}
