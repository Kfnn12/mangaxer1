import * as cheerio from 'cheerio';

async function testLinks() {
  const res = await fetch(`https://manganow.to/home`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const links = $('a').map((i, el) => $(el).attr('href')).get();
  const uniqueLinks = [...new Set(links)];
  const navLinks = uniqueLinks.filter(l => l && l.startsWith('/') && !l.startsWith('/manga/'));
  console.log("Nav links:", navLinks);
}
testLinks();
