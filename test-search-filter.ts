import * as cheerio from "cheerio";

async function testSearchFilter() {
  const url1 = "https://manganow.to/search?keyword=naruto&status=completed";
  const res1 = await fetch(url1);
  const html1 = await res1.text();
  const $1 = cheerio.load(html1);
  console.log("Naruto (completed):", $1('.manga-name').length, $1('.manga-name').first().text().trim());

  const url2 = "https://manganow.to/search?keyword=naruto&status=ongoing";
  const res2 = await fetch(url2);
  const html2 = await res2.text();
  const $2 = cheerio.load(html2);
  console.log("Naruto (ongoing):", $2('.manga-name').length, $2('.manga-name').first().text().trim());
}
testSearchFilter();
