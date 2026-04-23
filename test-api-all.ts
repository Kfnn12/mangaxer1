async function fetchAll() {
  const t = await fetch("http://localhost:3000/api/manga/az?k=All");
  const j = await t.json();
  console.log("Success:", j.success, "Error:", j.error);
}
fetchAll();
