import { db } from '@/lib/firebase/firebase';
import { DocumentData, collection, getDocs, query } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const collectionName = request.nextUrl.searchParams.get('collectionName');

    if (!collectionName) {
      return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
    }

    const q = query(collection(db, collectionName));
    const docSnapshots = await getDocs(q);
    const documents: DocumentData = [];

    docSnapshots.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('There was an error fetching products', error);
  }
}
