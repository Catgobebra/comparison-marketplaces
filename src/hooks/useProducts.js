import { useDispatch, useSelector } from "react-redux";
import { addProduct, removeProduct } from '../redux/slices/products';
import { useCategories } from './useCategories';


export function useProducts(data) {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.products?.products);
  const {addToCategory} = useCategories()

  const handleAddProduct = (product) => {
    dispatch(addProduct(product));
    const maxId = products.reduce(
        (max, category) => Math.max(max, category.id),
        0
      );
    const newId = maxId + 1;
    addToCategory(newId,1)
  }

  const handleRemoveProduct = (productId) => dispatch(removeProduct(productId));

  return {
    products,
    addProduct: handleAddProduct,
    removeProduct: handleRemoveProduct,
    productData: data
  };
}