'use client';

import { auth, db } from '@/lib/firebase/firebase';
import { addDocument } from '@/lib/firebase/service';
import useOrderStore from '@/lib/store';
import { User, userRole } from '@/lib/types';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  User as GoogleUser,
  UserCredential,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ReactNode, createContext, useEffect, useState } from 'react';

export interface IAuth {
  user?: GoogleUser | null;
  signInGoogle: () => Promise<UserCredential>;
  signInFacebook: () => Promise<UserCredential>;
  loading: boolean;
  logOut: () => Promise<void>;
}

export const AuthContext = createContext<IAuth | undefined>(undefined);

export default function GameProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<GoogleUser | null>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addNewUser = async (user: User) => {
    try {
      await addDocument('users', user);
    } catch (e) {
      console.error('Error adding new user', e);
    }
  };

  const signInGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const googleUser = await signInWithPopup(auth, provider);

    // add user to database if doesn't exist
    const additionalUserInfo = getAdditionalUserInfo(googleUser);
    if (additionalUserInfo?.isNewUser) {
      const user: User = {
        userId: googleUser.user.uid,
        name: googleUser.user.displayName ?? '',
        email: googleUser.user.email ?? '',
        role: userRole.user,
        createdAt: googleUser.user.metadata.creationTime ?? '',
      };
      addNewUser(user);
      useOrderStore.setState({ user });
    } else {
      // check if user exists in the database. store it in local storage if yes.
      const users = query(collection(db, 'users'), where('userId', '==', googleUser.user.uid));
      const querySnapshot = await getDocs(users);

      if (querySnapshot.size > 0) {
        const user = querySnapshot.docs[0].data() as User;
        useOrderStore.setState({ user });
      } else {
        console.error('No User Found in Database');
      }
    }

    setLoading(false);
    return googleUser;
  };

  const signInFacebook = async () => {
    const provider = new FacebookAuthProvider();
    const fbUser = await signInWithPopup(auth, provider);
    setLoading(false);
    return fbUser;
  };

  const logOut = async () => {
    await signOut(auth);
    setLoading(false);
    localStorage.removeItem('cart');
  };

  const authContext = {
    user,
    loading,
    signInGoogle,
    signInFacebook,
    logOut,
  };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}
