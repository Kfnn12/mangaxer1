import * as cheerio from "cheerio";

async function testFilterKeyword() {
  const url = "https://manganow.to/filter?keyword=dragon&sort=score";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log("Title:", $('title').text());
  console.log("Items:");
  $('.manga-name').each((i, el) => {
    if(i < 5) console.log($(el).text().trim());
  });
}
testFilterKeyword();
