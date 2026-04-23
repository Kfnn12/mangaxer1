import * as cheerio from "cheerio";

async function testGenreSort() {
  const url = "https://manganow.to/genre/action?sort=score&status=completed";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log("Title:", $('title').text());
  console.log("First item:", $('.manga-name').first().text().trim());
}
testGenreSort();
