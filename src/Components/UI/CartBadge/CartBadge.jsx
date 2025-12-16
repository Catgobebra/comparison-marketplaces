import React from "react";
import Badge from "@mui/material/Badge";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

export default function CartBadge({ count }) {
  return (
    <Badge
      badgeContent={count}
      color="primary"
      style={{ position: "absolute", top: "-50px", right: "0" }}
    >
      <ShoppingBasketIcon color="action" />
    </Badge>
  );
}
