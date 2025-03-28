import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Usar a API de busca do Google (você precisará configurar uma chave de API)
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const GOOGLE_CX = process.env.GOOGLE_CX;

    if (!GOOGLE_API_KEY || !GOOGLE_CX) {
      throw new Error('Google API configuration is missing');
    }

    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(query)}`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch search results');
    }

    // Extrair os snippets relevantes dos resultados
    const results = data.items?.map((item: any) => {
      return item.snippet || '';
    }) || [];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
} 