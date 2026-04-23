import * as cheerio from "cheerio";

async function testFilterForm() {
  const url = "https://manganow.to/filter";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  $('select').each((_, el) => {
    const name = $(el).attr('name');
    const options = [];
    $(el).find('option').each((_, opt) => {
      options.push({ val: $(opt).attr('value'), text: $(opt).text().trim() });
    });
    console.log(`Select ${name}:`, options);
  });
  
  // also check how genres are passed, sometimes it's checkboxes
  const genres = [];
  $('input[name="genres"]').each((_, el) => {
     genres.push($(el).attr('value'));
  });
  console.log("Genres via input[name=genres]:", genres.slice(0, 5));
  
  const keyword = $('input[name="keyword"]').attr('name');
  console.log("Keyword input:", keyword);
}
testFilterForm();
