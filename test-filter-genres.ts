import * as cheerio from "cheerio";

async function testFilterGenres() {
  const url = "https://manganow.to/filter";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const genreCheckboxes = [];
  $('.custom-checkbox').each((_, el) => {
    const val = $(el).find('input').attr('value');
    const label = $(el).find('label').text().trim();
    if(val) genreCheckboxes.push({val, label});
  });
  console.log("Genres:", genreCheckboxes.slice(0, 10));
}
testFilterGenres();
