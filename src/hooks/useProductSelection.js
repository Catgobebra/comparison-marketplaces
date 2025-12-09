import { useDispatch, useSelector } from "react-redux";
import { addToSelected, removeFromSelected } from "../redux/slices/products";

export function useProductSelection(productId) {
  const dispatch = useDispatch();
  const isSelected = useSelector((s) => 
    s.products.products.find(p => p.id === productId)?.isSelected
  );

  const toggleSelection = () => {
    if (isSelected) {
      dispatch(removeFromSelected({ categoryId: productId }));
    } else {
      dispatch(addToSelected({ categoryId: productId }));
    }
  };

  return { isSelected, toggleSelection };
}