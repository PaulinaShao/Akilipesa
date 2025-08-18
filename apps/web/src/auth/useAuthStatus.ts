import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";

export function useAuthStatus() {
  const [user, setUser] = useState<User | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  return { user, loading: user === undefined, isAuthed: !!user };
}
