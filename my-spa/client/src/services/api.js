export async function fetchQuotes() {
  const res = await fetch('/api/quotes');
  if (!res.ok) throw new Error(`Quote fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchIndices() {
  const res = await fetch('/api/indices');
  if (!res.ok) throw new Error(`Indices fetch failed: ${res.status}`);
  return res.json();
}
