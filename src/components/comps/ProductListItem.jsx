import React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from '@mui/icons-material/Clear'
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Rating from '@mui/material/Rating';
import { useDrag } from 'react-dnd';

import styles from './ProductListItem.module.sass';
import ReliabilityChip from './ReliabilityChip';
import useProducts from "../../hooks/useProducts";
import useCategories from "../../hooks/useCategories";
import { ItemTypes } from './ItemTypes';

export default function ProductListItem({ product, onDelete,currentCategory }) {
  const {
    remove,
    addToSelected,
    selectedProducts,
    removeFromSelected
  } = useProducts();

  const { 
    categories,
    addProductToCategory,
    removeProductFromCategory,
    toggleProductInCategory 
  } = useCategories();
  
  const title = product?.productName
    ? product.productName.length > 30
      ? product.productName.slice(0, 30) + "..."
      : product.productName
    : "Неизвестный товар";
  const cost = product?.currentPrice ?? "Неизвестно";
  const rating = product?.averageRating ?? 0;
  const ratingStat = product?.reviewsCount ?? 0;
  const srcImageItem = product?.imageUrl ?? "";
  const linkProduct = product?.productUrl ?? "";
  const isSelected = selectedProducts?.some(p => p.article === product.article) || false;
  
  const isFavorite = categories["Избранное"]?.includes(product.article) || false;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PRODUCT,
    item: { 
      id: product.article,
      name: product.productName 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [product]);

  const opacity = isDragging ? 0.5 : 1;

  const handleCompareClick = async () => {
    if (isSelected) {
      await removeFromSelected(product);
    } else {
      await addToSelected(product);
    }
  };

  const handleFavoriteClick = async () => {
    await toggleProductInCategory(product.article, 'Избранное');
  };

  const handleDelete = async () => {
    await remove(product);
  };

  return (
    <Card 
      className={styles.card} 
      ref={drag}
      style={{ 
        opacity,
        cursor: 'move',
        transition: 'opacity 0.2s'
      }}
    >
      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
        <IconButton 
          aria-label="delete" 
          onClick={handleDelete}
          size="small"
          color="primary"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
  
      <Box sx={{ position: "absolute", top: 48, right: 8, zIndex: 1 }}>
        <IconButton 
          aria-label="favorite" 
          size="small"
          color={isFavorite ? "error" : "primary"}
          onClick={() => isFavorite ? removeProductFromCategory(product.article,'Избранное') : addProductToCategory(product.article,'Избранное') }
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      {(currentCategory !== "Всё" && currentCategory !== "Избранное") &&
      <Box sx={{ position: "absolute", top: 81, right: 8, zIndex: 1 }}>
        <IconButton 
          aria-label="delete-category" 
          size="small"
          color="primary"
          onClick={() => removeProductFromCategory(product.article,currentCategory)}
        >
        <ClearIcon />
        </IconButton>
      </Box>}

      <CardContent style={{
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1px'
      }}>
        <a href={linkProduct} target="_blank" rel="noopener noreferrer">
          <img src={srcImageItem} alt={title} />
        </a>
        <Box sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
          <Typography sx={{ fontSize: '17px' }}>
            Цена: <Box component="span" sx={{ fontWeight: 'bold' }}>{cost} ₽</Box>
          </Typography>
          <Typography sx={{ fontSize: '15px', textTransform: 'uppercase', height: '45px' }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: '15px', display: 'flex', alignItems: 'center' }}>
            <Rating name="size-large" defaultValue={1} max={1} readOnly size="large" />
            <Box component="span" sx={{ fontWeight: 'bold' }}>{rating.toFixed(1)}</Box>
            ({ratingStat}) 
            <ReliabilityChip sx={{fontSize: '10px', marginLeft: '2px'}} averageRating={rating} reviewsCount={ratingStat} />
          </Typography>
        </Box>
        <Button 
          color={isSelected ? "secondary" : "primary"} 
          className={styles.compareButton} 
          onClick={handleCompareClick}
        >
          {isSelected ? "Убрать из сравнения" : "Сравнить продукт"}
        </Button>
      </CardContent> 
    </Card>
  );
}