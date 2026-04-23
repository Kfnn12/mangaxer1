import * as cheerio from "cheerio";

async function checkRelated() {
  const url = "https://manganow.to/manga/berserk";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  // Look for sections that might be "Related" or "Recommended"
  console.log("Headings:");
  $('h2, h3, h4').each((_, el) => {
     console.log($(el).text().trim());
  });

}
checkRelated();
