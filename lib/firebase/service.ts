import { DocumentData, collection, getDocs, query } from '@firebase/firestore';

import { db } from './firebase';

export const getDocuments = async (collectionName: string) => {
  const q = query(collection(db, collectionName));
  const docSnapshots = await getDocs(q);
  const documents: DocumentData = [];

  docSnapshots.forEach((doc) => {
    documents.push(doc.data());
  });

  return documents;
};
