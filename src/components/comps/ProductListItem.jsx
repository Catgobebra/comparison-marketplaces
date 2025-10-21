import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";

import styles from './ProductListItem.module.sass';

export default function ProductListItem({ product, onDelete }) {
  const title = product?.productName
    ? product.productName.length > 30
      ? product.productName.slice(0, 30) + "..."
      : product.productName
    : "Неизвестный товар";
  const cost = product?.originalPrice ?? "Неизвестно";
  const rating = product?.averageRating ?? "Неизвестно";
  const srcImageItem = product?.imageUrl ?? "";

  return (
    <ListItem
      className={styles.card}
      disableGutters
      secondaryAction={
        <IconButton aria-label="delete" onClick={() => onDelete(product)}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <img src={srcImageItem} alt="" />
      <InventoryIcon color="action" />
      <ListItemText primary={title} />
      <ListItemText primary={cost} />
      <ListItemText primary={rating} />
    </ListItem>
  );
}
