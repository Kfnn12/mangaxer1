import * as cheerio from 'cheerio';

async function testAZ() {
  const char = "A";
  const res = await fetch(`https://manganow.to/az-list?keyword=${char}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  console.log("Found manga posters:", $('.manga-poster').length);
}
testAZ();
