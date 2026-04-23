import * as cheerio from "cheerio";
import fs from 'fs';

async function dumpFilter() {
  const url = "https://manganow.to/filter";
  const res = await fetch(url);
  const html = await res.text();
  fs.writeFileSync('filter.html', html);
  console.log("Dumped to filter.html");
}
dumpFilter();
