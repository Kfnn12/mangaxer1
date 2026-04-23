async function testAll() {
  const chars = ["All", "#", "0-9", "A", "Z"];
  for (const char of chars) {
    const res = await fetch(`http://localhost:3000/api/manga/az?k=${encodeURIComponent(char)}`);
    const json = await res.json();
    console.log(`char: ${char}, results: ${json.results ? json.results.length : 0}, first: ${json.results?.[0]?.title}`);
  }
}
testAll();
