import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLazyGetCompareProductsQuery } from "../redux/api";
import { setProduct } from "../redux/slices/compareProducts";

export function useProductComparison() {
  const products = useSelector((state) => state.products.products).filter(
    (x) => x.isSelected
  );
  const newUnicProducts = products.map((x) => [x.id, x.productItem.article]);
  const compareProducts = useSelector(
    (state) => state.compareProducts.lastCompare
  );
  const newUnicCompareProducts = compareProducts.map((x) => [
    x?.id,
    x.productItem?.article,
  ]);
  let newProducts = products.map((x) => x.productItem);
  const shouldSkip =
    newProducts.length <= 1 ||
    JSON.stringify(newUnicCompareProducts) === JSON.stringify(newUnicProducts);

  const [getCompare, { data, isLoading, isFetching, error }] =
    useLazyGetCompareProductsQuery();
  const dispatch = useDispatch();

  const [sProductsInfo, setsProductsInfo] = useState([]);

  useEffect(() => {
    if (
      JSON.stringify(newUnicCompareProducts) === JSON.stringify(newUnicProducts)
    ) {
      const newCompareProduct = compareProducts.map((x) => x.productItem);
      setsProductsInfo(
        compareProducts.length > 0 ? newCompareProduct : products
      );
    } else if (data) {
      setsProductsInfo(data);
      dispatch(
        setProduct({
          currentCompare: products.map((x, index) => ({
            id: x.id,
            productItem: data[index],
            marketplaceName: x.marketplaceName,
            isSelected: x.isSelected,
          })),
        })
      );
    }
    console.log("+");
  }, [data, dispatch]);

  const onReload = async (resetCharacteristics) => {
    resetCharacteristics();
    await getCompare(newProducts);
    console.log(newProducts);
  };

  useEffect(() => {
    if (!shouldSkip && newProducts) {
      getCompare(newProducts);
    }
    console.log(shouldSkip, newProducts);
  }, [getCompare]);

  return {
    isLoading,
    isFetching,
    error,
    onReload,
    newProducts,
    products,
    compareProducts,
    newUnicProducts,
    newUnicCompareProducts,
    shouldSkip,
    sProductsInfo,
    setsProductsInfo,
  };
}
