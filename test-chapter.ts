import * as cheerio from 'cheerio';

async function run() {
  const url = "https://manganow.to/home?page=2";
  const res = await fetch(url);
  const text = await res.text();
  const $ = cheerio.load(text);
  
  const updateElements = $('.manga-list .item').length > 0 
    ? $('.manga-list .item') 
    : $('.manga-poster').parent().not('#trending-home .item');

  console.log("Found on page 2:", updateElements.length, updateElements.first().find('.manga-name').text().trim());
}
run();
