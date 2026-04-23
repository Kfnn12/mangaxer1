import * as cheerio from 'cheerio';

async function testAll() {
  const chars = ["All", "#", "0-9"];
  for (const char of chars) {
    const query = char === "All" ? "" : char === "#" ? "other" : char;
    const res = await fetch(`http://localhost:3000/api/manga/az?k=${encodeURIComponent(char)}`);
    const json = await res.json();
    console.log(`char: ${char}, results: ${json.results ? json.results.length : 0}, error: ${json.error}`);
  }
}
testAll();
