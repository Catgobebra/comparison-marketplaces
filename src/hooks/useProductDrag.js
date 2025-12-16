import { useDrag } from 'react-dnd';
import { ItemTypes } from '../Constants/ItemTypes';

export function useProductDrag(product) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PRODUCT,
    item: { 
      id: product.id,
      name: product.productItem.productName 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [product]);

  return { isDragging, drag };
}