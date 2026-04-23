import * as cheerio from "cheerio";

async function testFilter() {
  const url = "https://manganow.to/filter";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  console.log("Title:", $('title').text());
  
  // Look for filter forms or inputs
  const inputs = [];
  $('select').each((_, el) => {
    inputs.push($(el).attr('name'));
  });
  console.log("Selects:", inputs);
  
  const mangaItems = $('.manga-poster').length;
  console.log("Manga count:", mangaItems);
}
testFilter();
