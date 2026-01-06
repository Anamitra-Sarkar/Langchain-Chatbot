import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Mock search results
    const results = generateMockSearchResults(query);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

function generateMockSearchResults(query: string) {
  return [
    {
      title: `${query} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${query.replace(/ /g, '_')}`,
      snippet: `Learn about ${query}. This is a mock search result for development purposes. In production, this would use the Tavily API or another search service.`,
      source: 'Mock Search',
    },
    {
      title: `${query} - Documentation`,
      url: `https://docs.example.com/${query.toLowerCase().replace(/ /g, '-')}`,
      snippet: `Official documentation for ${query}. Find guides, tutorials, and API references.`,
      source: 'Mock Search',
    },
    {
      title: `How to use ${query}`,
      url: `https://example.com/guides/${query.toLowerCase().replace(/ /g, '-')}`,
      snippet: `A comprehensive guide to ${query}. Learn best practices and advanced techniques.`,
      source: 'Mock Search',
    },
  ];
}
