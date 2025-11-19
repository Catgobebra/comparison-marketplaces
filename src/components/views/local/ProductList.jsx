import React from "react";
import ProductListItem from "../../comps/ProductListItem";
import Grid from '@mui/material/Grid';

export default function ProductList({ products, onDelete,onAddInCategory,onDeleteInCategory,currentCategory }) {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ width: "100%"}}>
      {products.map((p, i) => (
        <ProductListItem key={p.article || i} product={p} onDelete={onDelete} onAddInCategory={onAddInCategory} onDeleteInCategory={onDeleteInCategory} currentCategory={currentCategory}/>
      ))}
    </Grid>
  );
}
