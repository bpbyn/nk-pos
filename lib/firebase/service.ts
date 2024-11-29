import { DocumentData, collection, deleteDoc, getDocs, query } from '@firebase/firestore';
import { addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

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

export const getDocument = async (collectionName: string, documentId: string) => {
  const documentRef = doc(db, collectionName, documentId);
  const document = await getDoc(documentRef);

  return document.data();
};

export const addDocument = async <T extends DocumentData>(collectionName: string, document: T) => {
  try {
    await addDoc(collection(db, collectionName), document);
  } catch (e) {
    console.error('Failed to add document', e);
  }
};

export const updateDocument = async <T extends DocumentData>(
  path: string,
  pathSegments: string,
  document: T
) => {
  const documentRef = doc(db, path, pathSegments);
  await updateDoc(documentRef, document);
};

export const updateCounter = async (counterValue: number) => {
  const documentRef = doc(db, 'counter', 'queue');

  return await updateDoc(documentRef, {
    date: new Date().valueOf(),
    queueCount: counterValue,
  });
};

export const deleteDocument = async (path: string, pathSegments: string) => {
  try {
    const documentRef = doc(db, path, pathSegments);
    await deleteDoc(documentRef);
  } catch (e) {
    console.error('Failed to delete document', e);
  }
};

// still experimenting if I should add this into route handlers..
// export const placeOrder = async (order: Order, queueCount: number) => {
//   try {
//     await updateCounter(queueCount);
//     await addDoc(collection(db, 'ordersV2'), order);
//   } catch (e) {
//     console.error('Place order failed', e);
//   }
// };
