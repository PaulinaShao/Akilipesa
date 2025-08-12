interface PostLoginIntent {
  action: string;
  href: string;
}

export function requireAuth(action: string, onOk: () => void) {
  // Get user from localStorage or current state
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (user && !user.id.includes('guest') && !user.id.includes('demo')) {
    return onOk();
  }
  
  // Store intent for post-login return
  const intent: PostLoginIntent = {
    action,
    href: window.location.pathname + window.location.search
  };
  
  sessionStorage.setItem('postLoginIntent', JSON.stringify(intent));
  
  // Navigate to login with reason
  window.location.href = `/login?reason=${encodeURIComponent(action)}`;
}

export function getPostLoginIntent(): PostLoginIntent | null {
  try {
    const intent = sessionStorage.getItem('postLoginIntent');
    return intent ? JSON.parse(intent) : null;
  } catch {
    return null;
  }
}

export function clearPostLoginIntent() {
  sessionStorage.removeItem('postLoginIntent');
}

export function handlePostLogin() {
  const intent = getPostLoginIntent();
  clearPostLoginIntent();
  
  if (intent?.href) {
    window.location.href = intent.href;
  } else {
    window.location.href = '/reels';
  }
}
