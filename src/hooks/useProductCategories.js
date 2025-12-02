import { useDispatch, useSelector } from "react-redux";
import { 
  addProductToCategory, 
  removeProductFromCategory,
  removeProductFromAll 
} from "../redux-state/slices/filterProducts";
import { removeProduct } from "../redux-state/slices/products";

export function useProductCategories() {
  const dispatch = useDispatch();
  const categories = useSelector((s) => s.filterProducts?.filterProducts);

  const handleDeleteProduct = (productId) => {
    dispatch(removeProduct({ categoryId: productId }));
    dispatch(removeProductFromAll({ productId: productId }));
  };

  const handleAddToCategory = (productId, categoryId) => {
    dispatch(addProductToCategory({ productId, categoryId }));
  };

  const handleRemoveFromCategory = (productId, categoryId) => {
    dispatch(removeProductFromCategory({ productId, categoryId }));
  };

  const isProductInCategory = (productid, categoryId) => {
    return categories[categoryId-1]?.productList.includes(productid) || false;
  };

  return {
    handleDeleteProduct,
    handleAddToCategory,
    handleRemoveFromCategory,
    isProductInCategory,
    categories
  };
}