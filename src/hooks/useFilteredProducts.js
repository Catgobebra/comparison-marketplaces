import { useMemo } from "react";

export function useFilteredProducts(products, categories, currentCategory) {
  return useMemo(() => {
    const articlesInCategory = categories.find(x => x.id === currentCategory)
    .productList || [];
    const articlesSet = new Set(articlesInCategory);
  
    return products.filter(product => articlesSet.has(product.id));
  }, [products, categories, currentCategory]);
}