import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";

export default function ProductListItem({ product, onDelete }) {
  const title = product?.productName
    ? product.productName.length > 30
      ? product.productName.slice(0, 30) + "..."
      : product.productName
    : "Неизвестный товар";

  return (
    <ListItem
      disableGutters
      secondaryAction={
        <IconButton aria-label="delete" onClick={() => onDelete(product)}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <InventoryIcon color="action" />
      <ListItemText primary={title} />
    </ListItem>
  );
}
