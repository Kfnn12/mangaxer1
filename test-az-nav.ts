import * as cheerio from 'cheerio';

async function verify() {
  const t1 = await fetch("https://manganow.to/az-list");
  const html = await t1.text();
  const $ = cheerio.load(html);
  
  const azNav = $('.word-list li a').map((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      return { text, href };
  }).get();
  
  console.log("AZ Nav options:", azNav);
}
verify();
