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

async function testHome() {
  const res = await fetch(`https://manganow.to/home`);
  const html = await res.text();
  const $ = cheerio.load(html);

  // Trending items (often top 10)
  const trendingElements = $('#trending-home .item');
  const trending = parseMangaItems($, trendingElements);
  console.log("Trending:", trending.length);

  // Latest updates
  let updateElements = $('.manga_list-sbs .item, .manga-list .item, .film_list-wrap .item');
  if (updateElements.length === 0) {
      updateElements = $('.manga-poster').closest('.item').not('#trending-home .item');
  }

  const latest = parseMangaItems($, updateElements);
  console.log("Latest:", latest.length);
  if (latest.length > 0) {
      console.log(latest.slice(0, 3));
  }
}
testHome();
