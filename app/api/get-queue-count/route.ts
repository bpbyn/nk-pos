import { getDocument } from '@/lib/firebase/service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const collectionName = request.nextUrl.searchParams.get('collectionName');
  const documentId = request.nextUrl.searchParams.get('documentId');
  try {
    // if (!collectionName) {
    //   return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
    // }

    // if (!documentId) {
    //   return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    // }

    const document = await getDocument(collectionName ?? 'counter', documentId ?? 'queue');

    return NextResponse.json(document);
  } catch (error) {
    console.error('There was an error fetching counter queue', error);
  }
}
