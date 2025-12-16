import React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from '@mui/icons-material/Clear';
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Rating from '@mui/material/Rating';

import styles from './ProductListItem.module.sass';
import ReliabilityChip from '../../UI/ReliabilityChip/ReliabilityChip';

import { useProductData } from "../../../Hooks/useProductData";
import { useProductDrag } from "../../../Hooks/useProductDrag";
import { useProductSelection } from "../../../Hooks/useProductSelection";
import { useProductCategories } from "../../../Hooks/useProductCategories";

export default function ProductListItem({ product, productId,currentCategory }) {
  const { productItem, title, cost, rating, ratingStat, srcImageItem, linkProduct } = 
    useProductData(product);

  console.log(product)
  const colorsZ = {
    'ozon' : '#0040b3',
    'wb' : '#5f02a9',
    'ya-market' : '#978002'
  }
  const ProductColor = colorsZ[product.marketplaceName]//!

  const { isSelected, toggleSelection } = useProductSelection(productId);
  const { isDragging, drag } = useProductDrag(product);
  const { 
    handleDeleteProduct, 
    handleAddToCategory,
    handleRemoveFromCategory,
    isProductInCategory 
  } = useProductCategories();
  
  const isFavorite = isProductInCategory(product.id, 2);
  const showRemoveFromCategory = !currentCategory.isSystem;
  const opacity = isDragging ? 0.5 : 1;

  const handleToggleFavorite = () => {
    if (isFavorite) {
      handleRemoveFromCategory(product.id, 2);
    } else {
      handleAddToCategory(product.id, 2);
    }
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
          onClick={() => handleDeleteProduct(productId)}
          size="small"
          sx={{'color' : ProductColor}}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
  
      <Box sx={{ position: "absolute", top: 48, right: 8, zIndex: 1 }}>
        <IconButton 
          aria-label="favorite" 
          size="small"
          color={isFavorite ? "error" : "inherit"}
          sx={{
            color: isFavorite ? undefined : ProductColor
          }}
          onClick={handleToggleFavorite}
        >
          {isFavorite ? <FavoriteIcon  /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>

      {showRemoveFromCategory && (
        <Box sx={{ position: "absolute", top: 81, right: 8, zIndex: 1 }}>
          <IconButton 
            aria-label="delete-category" 
            size="small"
            sx={{ color: ProductColor }}
            onClick={() => handleRemoveFromCategory(product.id, currentCategory.id)}
          >
            <ClearIcon />
          </IconButton>
        </Box>
      )}

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
            <ReliabilityChip 
              sx={{fontSize: '10px', marginLeft: '2px'}} 
              averageRating={rating} 
              reviewsCount={ratingStat} 
            />
          </Typography>
        </Box>
        <Button 
          //color={isSelected ? "secondary" : "primary"}
          sx={{backgroundColor : ProductColor,opacity : isSelected ? 0.6 : 1}} 
          className={styles.compareButton} 
          onClick={toggleSelection}
        >
          {isSelected ? "Убрать из сравнения" : "Сравнить продукт"}
        </Button>
      </CardContent> 
    </Card>
  );
}