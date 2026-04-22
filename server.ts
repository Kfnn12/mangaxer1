import express from "express";
import { createServer as createViteServer } from "vite";
import * as cheerio from "cheerio";
import cors from "cors";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // In-memory ratings store
  const globalRatings: Record<string, { sum: number, count: number }> = {};

  // Helper to parse manga items
  function parseMangaItems($: cheerio.CheerioAPI, elements: cheerio.Cheerio<cheerio.Element>) {
    const list: any[] = [];
    elements.each((_, el) => {
      const container = $(el);
      const link = container.find('.manga-name a').attr('href') || container.find('a.link-mask').attr('href') || container.find('a.manga-poster').attr('href');
      const title = container.find('img.manga-poster-img').attr('alt') || container.find('.manga-name').text().trim() || container.find('h3.manga-name').text().trim();
      const image = container.find('img.manga-poster-img').attr('src') || container.find('img.manga-poster-img').attr('data-src') || container.find('img').attr('src');
      
      let rating = "";
      const starIcon = container.find('i.fa-star');
      if (starIcon.length > 0) {
        rating = starIcon.parent().text().trim();
      }

      let latestChapter = "";
      const chapLink = container.find('.mp-desc a[href*="chapter-"] strong');
      if (chapLink.length > 0) {
        latestChapter = chapLink.text().replace(/\s+/g, ' ').trim();
      }

      const genres: string[] = [];
      container.find('.fd-infor a').each((_, g) => {
        genres.push($(g).text().trim());
      });

      if (title && link) {
        // Construct standard ID
        const parts = link.split('/');
        const id = parts[parts.length - 1]; // e.g. solo-leveling

        if (globalRatings[id]) {
           rating = (globalRatings[id].sum / globalRatings[id].count).toFixed(1);
        }

        list.push({
          id,
          title,
          url: link.startsWith('http') ? link : `https://manganow.to${link}`,
          image,
          rating,
          latestChapter,
          genres
        });
      }
    });
    return list;
  }

  // Rating Route
  app.post("/api/manga/:id/rate", (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: "Rating must be a number between 1 and 5" });
    }
    
    if (!globalRatings[id]) {
      globalRatings[id] = { sum: 0, count: 0 };
    }
    
    globalRatings[id].sum += rating;
    globalRatings[id].count += 1;
    
    res.json({ 
      success: true, 
      average: (globalRatings[id].sum / globalRatings[id].count).toFixed(1),
      count: globalRatings[id].count 
    });
  });

  // API Routes
  app.get("/api/manga/home", async (req, res) => {
    try {
      const response = await fetch("https://manganow.to/home");
      const html = await response.text();
      const $ = cheerio.load(html);

      // Trending items (often top 10)
      const trendingElements = $('#trending-home .item');
      const trending = parseMangaItems($, trendingElements);

      // Other sections, e.g. latest updates
      // The site probably has sections like 'Latest Updates'
      const updateElements = $('.manga-list .item').length > 0 
        ? $('.manga-list .item') 
        : $('.manga-poster').parent().not('#trending-home .item');

      const latest = parseMangaItems($, updateElements);

      res.json({ success: true, trending, latest });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Basic search API
  app.get("/api/manga/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ success: false, error: "Query 'q' is required" });
      }

      const response = await fetch(`https://manganow.to/search?keyword=${encodeURIComponent(query)}`);
      const html = await response.text();
      const $ = cheerio.load(html);

      const items = parseMangaItems($, $('.manga-poster').parent());

      res.json({ success: true, results: items });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Chapter pages API
  app.get("/api/manga/chapter", async (req, res) => {
    try {
      const url = req.query.url as string;
      if (!url) {
        return res.status(400).json({ success: false, error: "URL query parameter 'url' is required" });
      }

      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const readingId = $('#wrapper').attr('data-reading-id');
      if (!readingId) {
        return res.status(404).json({ success: false, error: "Reading ID not found on chapter page" });
      }

      const quality = (req.query.quality as string) || 'high';
      const endpoint = `https://manganow.to/ajax/image/list/${readingId}?mode=vertical&quality=${quality}`;
      const ajaxRes = await fetch(endpoint, {
          headers: {
              "Accept": "application/json",
              "X-Requested-With": "XMLHttpRequest",
              "Referer": url
          }
      });

      if (!ajaxRes.ok) {
          return res.status(500).json({ success: false, error: 'Failed to fetch images list' });
      }

      const ajaxJson = await ajaxRes.json();
      if (!ajaxJson.html) {
          return res.status(500).json({ success: false, error: 'Invalid response from image server' });
      }

      const $html = cheerio.load(ajaxJson.html);
      const images: string[] = [];

      $html('.iv-card').each((i, el) => {
          let imgUrl = $(el).attr('data-url');
          if (imgUrl) {
              imgUrl = imgUrl.trim();
              if (!imgUrl.includes('logo.png') && !imgUrl.includes('manganow.jpg') && imgUrl !== '') {
                 images.push(imgUrl);
              }
          }
      });

      res.json({ success: true, pages: images });
    } catch (error: any) {
      console.error('Error fetching chapter pages:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Manga Details API
  app.get("/api/manga/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await fetch(`https://manganow.to/manga/${id}`);
      
      if (response.status === 404) {
        return res.status(404).json({ success: false, error: "Manga not found" });
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const title = $('.anisc-detail h2.manga-name').text().trim() || $('.manga-name').first().text().trim();
      const image = $('.anisc-poster img').attr('src') || $('.manga-poster-img').first().attr('src');
      
      const description = $('.manga-name + .sort-desc .text').text().trim() || $('.description').text().trim();
      
      const details: Record<string, string> = {};
      $('.anisc-info .item').each((_, el) => {
        const key = $(el).find('.item-head').text().replace(':', '').trim();
        const value = $(el).find('.name').text().trim() || $(el).text().replace($(el).find('.item-head').text(), '').trim();
        if (key) {
           details[key] = value;
        }
      });
      
      let rating = "";
      if (globalRatings[id]) {
          rating = (globalRatings[id].sum / globalRatings[id].count).toFixed(1);
      } else {
          const starIcon = $('.anisc-info i.fa-star');
          if (starIcon.length > 0) {
              rating = starIcon.parent().text().trim();
          }
      }

      const chapters: { title: string, url: string, date: string }[] = [];
      $('#chapters-list .item').each((_, el) => {
        const linkEl = $(el).find('a');
        const chapterTitle = linkEl.attr('title') || linkEl.text().trim();
        const chapterUrl = linkEl.attr('href') || '';
        const date = $(el).find('.time').text().trim();
        
        if (chapterTitle && chapterUrl) {
          chapters.push({
            title: chapterTitle,
            url: chapterUrl.startsWith('http') ? chapterUrl : `https://manganow.to${chapterUrl}`,
            date
          });
        }
      });

      res.json({
        success: true,
        data: {
          id,
          title,
          image,
          description,
          rating,
          details,
          chapters
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
