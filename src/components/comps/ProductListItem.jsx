import React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Rating from '@mui/material/Rating';

import styles from './ProductListItem.module.sass';

import ReliabilityChip from './ReliabilityChip';

export default function ProductListItem({ product, onDelete }) {
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

  return (
    <Card
      className={styles.card}
    >
      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
        <IconButton 
          aria-label="delete" 
          onClick={() => onDelete(product)}
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
          color="primary"
        >
          <FavoriteBorderIcon />
        </IconButton>
      </Box>

      <CardContent style={{display : 'flex', 
      alignItems : 'center',
      justifyContent : 'center',
      flexDirection: 'column',
      gap : '1px'}}>
         <a
          href={linkProduct}
          target="_blank"
          rel="noopener noreferrer"
          >
            <img src={srcImageItem} alt="" />
          </a>
        <Box sx={{ width: '100%', textAlign: 'left', mt: 1 }}>
          <Typography sx={{ fontSize: '17px' }}>
            Цена: <Box component="span" sx={{ fontWeight: 'bold' }}>{cost} ₽</Box>
          </Typography>
          <Typography sx={{ fontSize: '15px', textTransform : 'uppercase', height : '45px'}}>{title}</Typography>
          <Typography sx={{ fontSize: '15px',display: 'flex', alignItems: 'center'}}>
            <Rating name="size-large" defaultValue={1} max={1} readOnly size="large" /><Box component="span" sx={{ fontWeight: 'bold' }}>{rating.toFixed(1)}</Box>({ratingStat}) <ReliabilityChip sx={{fontSize: '10px',marginLeft:'2px'}} averageRating={rating} reviewsCount={ratingStat} />
          </Typography>
        </Box>
        <Button className={styles.compareButton}>Сравнить продукт</Button>
      </CardContent> 
    </Card>
  );
}
