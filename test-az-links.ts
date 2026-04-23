import * as cheerio from 'cheerio';

async function verify() {
  const t1 = await fetch("https://manganow.to/az-list");
  const html = await t1.text();
  const $ = cheerio.load(html);
  
  const azLinks = $('a[href*="/az-list"]').map((i, el) => $(el).attr('href')).get();
  
  console.log("AZ Links:", [...new Set(azLinks)]);
}
verify();
