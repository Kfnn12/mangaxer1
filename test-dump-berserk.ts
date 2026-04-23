import * as cheerio from "cheerio";

async function dumpBerserk() {
  const url = "https://manganow.to/manga/berserk";
  const res = await fetch(url);
  const html = await res.text();
  const index = html.indexOf("You May Also Like");
  if (index > -1) {
    console.log(html.slice(index - 500, index + 2000));
  } else {
    console.log("NOT FOUND");
  }
}
dumpBerserk();
