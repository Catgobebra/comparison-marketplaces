import React from "react";
import List from "@mui/material/List";
import ProductListItem from "../../comps/ProductListItem";

export default function ProductList({ products, onDelete }) {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {products.map((p, i) => (
        <ProductListItem key={p.article || i} product={p} onDelete={onDelete} />
      ))}
    </List>
  );
}
