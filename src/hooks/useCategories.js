import { useDispatch, useSelector } from "react-redux";
import { useState} from "react";
import { addProductToCategory, removeProductFromCategory } from "../redux/slices/filterProducts";

export function useCategories() {
  const dispatch = useDispatch();
  const categories = useSelector((s) => s.filterProducts?.filterProducts);
  const allCategory = categories.find((x) => x.name === "Всё")
  const [currentCategory, setCurrentCategory] = useState(allCategory);

  const addToCategory = (productId, categoryId) => 
  {
    dispatch(addProductToCategory({categoryId : categoryId, productId: productId }));
  }

  const removeFromCategory = (productId, categoryName) => 
    dispatch(removeProductFromCategory({ productId, categoryName }));

  return {
    categories,
    currentCategory,
    setCurrentCategory,
    addToCategory,
    removeFromCategory
  };
}