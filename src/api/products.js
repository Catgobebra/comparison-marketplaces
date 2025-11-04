export async function getProductBySku(sku) {
  const res = await fetch(`http://localhost:5000/api/Products/by-sku/${sku}`, {
    headers: { accept: "text/plain" }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getProductByUrl(url) {
  const encodedUrl = encodeURIComponent(url);
  const apiUrl = `http://localhost:5000/api/Products/by-url?url=${encodedUrl}`;
  
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: { 
      "accept": "text/plain"
    }
  });
  
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function compareProducts(products) {
  const res = await fetch(`http://localhost:5000/api/Products/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(products)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
