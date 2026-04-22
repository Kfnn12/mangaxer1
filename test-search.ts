import * as cheerio from 'cheerio';

function parseMangaItems($: cheerio.CheerioAPI, elements: cheerio.Cheerio<cheerio.Element>) {
  const list: any[] = [];
  elements.each((_, el) => {
    const container = $(el);
    const link = container.find('.manga-name a').attr('href') || container.find('a.link-mask').attr('href') || container.find('a.manga-poster').attr('href');
    const title = container.find('img.manga-poster-img').attr('alt') || container.find('.manga-name').text().trim() || container.find('h3.manga-name').text().trim();
    const image = container.find('img.manga-poster-img').attr('src') || container.find('img.manga-poster-img').attr('data-src') || container.find('img').attr('src');
    
    if (title && link) {
        list.push({ link, title, image });
    }
  });
  return list;
}

async function testSearch() {
  const query = "solo leveling";
  const res = await fetch(`http://localhost:3000/api/manga/search?q=${encodeURIComponent(query)}`);
  const json = await res.json();

  console.log("Returned array size via API:", json.results.length);
}
testSearch();
