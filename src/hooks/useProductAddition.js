import { useState } from "react";
import { MarketplaceParser } from "../utils/parseMarketplace";
import { useProducts } from "./useProducts";
import { useSnackbar } from "./useSnackbar";

export function useProductAddition(getProduct) {
  const [currentLink, setCurrentLink] = useState("");
  const {addProduct, products } = useProducts();
  const { setSnackbarState } = useSnackbar();

  const handleInputChange = (e) => setCurrentLink(e.target.value);

  const addProductByUrl = async (url) => {
    if (!MarketplaceParser.isValidUrl(url)) {
      setSnackbarState({
        open: true,
        severity: "error",
        message: "Неверная ссылка на товар",
      });
      return;
    }

    const sku = MarketplaceParser.parseSku(url);
    
    if (products.some(p => p.productItem.article === sku)) {
      setSnackbarState({
        open: true,
        severity: "warning",
        message: "Этот товар уже добавлен",
      });
      return;
    }

    try {
      const productData = await getProduct(sku,true).unwrap();
      addProduct({product: productData,
      marketplace: MarketplaceParser.getMarketplace(url)});
      setSnackbarState({
        open: true,
        severity: "success",
        message: "Товар успешно добавлен",
      });
    } catch (error) {
      setSnackbarState({
        open: true,
        severity: "error",
        message: "Ошибка при добавлении товара",
      });
    }
  };

  const handleAddFromInput = () => {
    addProductByUrl(currentLink);
    setCurrentLink("");
  };

  const handleAddFromTab = (currentUrl) => {
    addProductByUrl(currentUrl);
  };

  return {
    currentLink,
    handleInputChange,
    handleAddFromInput,
    handleAddFromTab,
  };
}