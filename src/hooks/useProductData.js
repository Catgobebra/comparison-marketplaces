export function useProductData(product) {
  const productItem = product?.productItem || {};
  
  const title = productItem?.productName
    ? productItem.productName.length > 30
      ? productItem.productName.slice(0, 30) + "..."
      : productItem.productName
    : "Неизвестный товар";

  const cost = productItem?.currentPrice ?? "Неизвестно";
  const rating = productItem?.averageRating ?? 0;
  const ratingStat = productItem?.reviewsCount ?? 0;
  const srcImageItem = productItem?.imageUrl ?? "";
  const linkProduct = productItem?.productUrl ?? "";

  return {
    productItem,
    title,
    cost,
    rating,
    ratingStat,
    srcImageItem,
    linkProduct
  };
}