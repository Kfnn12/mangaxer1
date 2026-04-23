import * as cheerio from "cheerio";

async function checkRelatedMangaItems() {
  const url = "https://manganow.to/manga/berserk";
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const relatedElements = $('.manga-poster');
  console.log(`Found ${relatedElements.length} .manga-poster elements`);
  
  // Let's identify the specific container for "You May Also Like"
  const section = $('h2:contains("You May Also Like")').parent();
  if (section.length) {
     console.log("Section found!");
     const items = section.parent().find('.manga-poster');
     console.log(`Found ${items.length} posters in this section`);
  } else {
     // Wait, the structure might be different
     $('h2, h3, h4').each((_, el) => {
        if($(el).text().trim() === "You May Also Like") {
           console.log("Found explicitly!");
           console.log("Parent:", $(el).parent().prop('tagName'));
           console.log("Grandparent:", $(el).parent().parent().prop('tagName'));
        }
     });
  }
}
checkRelatedMangaItems();
