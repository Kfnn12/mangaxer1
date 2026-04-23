import * as cheerio from 'cheerio';

async function verify() {
  const t1 = await fetch("https://manganow.to/az-list");
  console.log("No query:", cheerio.load(await t1.text())('.manga-poster').length);

  const t2 = await fetch("https://manganow.to/az-list?keyword=other");
  console.log("other query:", cheerio.load(await t2.text())('.manga-poster').length);

  const t3 = await fetch("https://manganow.to/az-list?keyword=0-9");
  console.log("0-9 query:", cheerio.load(await t3.text())('.manga-poster').length);
}
verify();
