import * as cheerio from "cheerio";

async function testImages() {
  const response = await fetch(`https://manganow.to/latest-updated?page=1`);
  const html = await response.text();
  const $ = cheerio.load(html);

  const images = $('.manga-poster-img').map((i, el) => $(el).attr('src')).get();
  console.log("Images:", images.slice(0, 5));
}
testImages();
