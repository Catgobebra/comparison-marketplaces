import { useDispatch, useSelector } from "react-redux";
import { addProductToCategory, removeProductFromCategory } from "../redux-state/slices/filterProducts";

export function useFavorite(productArticle) {
  const dispatch = useDispatch();
  const categories = useSelector((s) => s.filterProducts?.filterProducts);
  
  const isFavorite = categories["Избранное"]?.includes(productArticle) || false;

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeProductFromCategory({
        productId: productArticle,
        categoryName: 2
      }));
    } else {
      dispatch(addProductToCategory({
        productId: productArticle,
        categoryName: 2
      }));
    }
  };

  return { isFavorite, toggleFavorite };
}