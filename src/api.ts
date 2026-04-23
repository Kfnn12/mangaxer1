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

export const GENRES = [
  "action", "adventure", "animated", "anime", "cartoon", "comedy", "comic", "completed", "cooking", "detective", "doujinshi", "drama", "ecchi", "fantasy", "gender-bender", "harem", "historical", "horror", "isekai", "josei", "magic", "manga", "manhua", "manhwa", "martial-arts", "mature", "mecha", "military", "mystery", "one-shot", "psychological", "reincarnation", "romance", "school-life", "sci-fi", "seinen", "shoujo", "shoujo-ai", "shounen", "shounen-ai", "slice-of-life", "smut", "sports", "super-power", "supernatural", "thriller", "tragedy", "webtoon"
];

export interface MangaDetails {
  id: string;
  title: string;
  image: string;
  description: string;
  rating?: string;
  details: Record<string, string>;
  chapters: { title: string, url: string, date: string }[];
  related?: MangaItem[];
}

export const api = {
  getHome: async (): Promise<HomeData> => {
    const res = await fetch('/api/manga/home');
    if (!res.ok) throw new Error("Failed to fetch home data");
    const json = await res.json();
    return { trending: json.trending, latest: json.latest };
  },

  search: async (query: string, sort: string = 'default'): Promise<SearchData> => {
    let url = `/api/manga/search?q=${encodeURIComponent(query)}`;
    if (sort !== 'default') url += `&sort=${sort}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to search manga");
    const json = await res.json();
    return { results: json.results };
  },

  getGenre: async (genre: string, page: number = 1, sort: string = 'default', status: string = 'all'): Promise<SearchData> => {
    let url = `/api/manga/genre?genre=${encodeURIComponent(genre)}&page=${page}`;
    if (sort !== 'default') url += `&sort=${sort}`;
    if (status !== 'all') url += `&status=${status}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch genre ${genre}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || `Failed to fetch genre ${genre}`);
    return { results: json.results };
  },

  getAZList: async (letter: string): Promise<SearchData> => {
    const res = await fetch(`/api/manga/az?k=${encodeURIComponent(letter)}`);
    if (!res.ok) throw new Error("Failed to fetch A-Z list");
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to fetch A-Z list");
    return { results: json.results };
  },

  getLatest: async (page: number = 1): Promise<SearchData> => {
    const res = await fetch(`/api/manga/latest?page=${page}`);
    if (!res.ok) throw new Error("Failed to fetch latest updates");
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Failed to fetch latest updates");
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
