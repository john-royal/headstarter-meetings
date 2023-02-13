import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';

interface User {
  id: string;
  email: string;
}

interface Auth {
  user?: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext({} as Auth);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      if (user != null) {
        getDoc(doc(db, 'users', user.uid)).then((profile) => {
          setUser(profile.data() as User);
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    setUser(undefined); // prevents redirect to sign-in page
    const result = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getDoc(doc(db, 'users', result.user.uid));
    setUser(profile.data() as User);
  };

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  const createAccount = async (email: string, password: string) => {
    setUser(undefined); // prevents redirect to sign-in page
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = { id: result.user.uid, email: result.user.email! };
    await setDoc(doc(db, 'users', result.user.uid), user);
    setUser(user);
  };

  const state = {
    user,
    signIn,
    signOut,
    createAccount,
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth(): Auth {
  return useContext(AuthContext);
}
