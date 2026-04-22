export interface MangaItem {
  id: string;
  title: string;
  url: string;
  image: string;
  rating?: string;
  latestChapter?: string;
  genres: string[];
}

export interface HomeData {
  trending: MangaItem[];
  latest: MangaItem[];
}

export interface SearchData {
  results: MangaItem[];
}

export interface MangaDetails {
  id: string;
  title: string;
  image: string;
  description: string;
  rating?: string;
  details: Record<string, string>;
  chapters: { title: string, url: string, date: string }[];
}

export const api = {
  getHome: async (): Promise<HomeData> => {
    const res = await fetch('/api/manga/home');
    if (!res.ok) throw new Error("Failed to fetch home data");
    const json = await res.json();
    return { trending: json.trending, latest: json.latest };
  },

  search: async (query: string): Promise<SearchData> => {
    const res = await fetch(`/api/manga/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Failed to search manga");
    const json = await res.json();
    return { results: json.results };
  },

  getDetails: async (id: string): Promise<MangaDetails> => {
    const res = await fetch(`/api/manga/${id}`);
    if (!res.ok) throw new Error("Failed to fetch manga details");
    const json = await res.json();
    return json.data;
  },
  
  rateManga: async (id: string, rating: number): Promise<{ average: string, count: number }> => {
    const res = await fetch(`/api/manga/${id}/rate`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ rating })
    });
    if (!res.ok) throw new Error("Failed to submit rating");
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to submit rating");
    return { average: json.average, count: json.count };
  },

  getChapterPages: async (url: string, quality: string = 'high'): Promise<string[]> => {
    const res = await fetch(`/api/manga/chapter?url=${encodeURIComponent(url)}&quality=${quality}`);
    if (!res.ok) throw new Error('Failed to fetch chapter pages');
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch chapter pages');
    return json.pages;
  }
};
