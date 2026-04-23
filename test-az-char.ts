import * as cheerio from 'cheerio';

async function check() {
  const q1 = await fetch("https://manganow.to/az-list?keyword=%23");
  console.log("#:", cheerio.load(await q1.text())('.manga-poster').length);

  const q2 = await fetch("https://manganow.to/az-list?keyword=other");
  console.log("other:", cheerio.load(await q2.text())('.manga-poster').length);

  const q3 = await fetch("https://manganow.to/az-list?keyword=0-9");
  console.log("0-9:", cheerio.load(await q3.text())('.manga-poster').length);
  
  const qAll = await fetch("https://manganow.to/az-list?keyword=All");
  console.log("All:", cheerio.load(await qAll.text())('.manga-poster').length);
}
check();
