import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import firebaseConfig from './config';

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(firebaseApp);
