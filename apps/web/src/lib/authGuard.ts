interface PostLoginIntent {
  action: string;
  href: string;
}

function getUserFromStorage(): any | null {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

function isValidAuthenticatedUser(user: any): boolean {
  return user &&
         typeof user.id === 'string' &&
         !user.id.includes('guest') &&
         !user.id.includes('demo') &&
         !user.id.includes('offline');
}

export function requireAuth(action: string, onOk: () => void) {
  const user = getUserFromStorage();

  if (isValidAuthenticatedUser(user)) {
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

  if (intent?.href && intent.href !== '/login') {
    // Small delay to ensure authentication state is fully updated
    setTimeout(() => {
      window.location.href = intent.href;
    }, 100);
  } else {
    setTimeout(() => {
      window.location.href = '/reels';
    }, 100);
  }
}
