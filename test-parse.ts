import * as cheerio from "cheerio";

async function testFetch() {
  const t = await fetch("http://localhost:3000/api/manga/latest");
  const j = await t.json();
  console.log("Images:", j.results.map((r: any) => r.image).slice(0, 5));
}

testFetch();
