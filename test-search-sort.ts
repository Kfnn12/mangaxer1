import * as cheerio from "cheerio";

async function testSearchSort() {
  const url = "https://manganow.to/filter?keyword=hero&sort=score&status=completed";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log("Title:", $('title').text());
  console.log("First item:", $('.manga-name').first().text().trim());
}

async function testSearchDirect() {
  const url = "https://manganow.to/search?keyword=hero&sort=score&status=completed";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log("Search Direct Title:", $('title').text());
  console.log("Search Direct First item:", $('.manga-name').first().text().trim());
}

testSearchSort();
testSearchDirect();
