import React from "react";
import ProductListItem from "../../comps/ProductList/ProductListItem";
import Grid from '@mui/material/Grid';

export default function ProductList({ products,currentCategory }) {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }} sx={{ width: "100%"}}>
      {products.map((p, i) => (
        <ProductListItem 
          key={p.id} 
          productId={p.id} 
          product={p}
          currentCategory={currentCategory}
        />
      ))}
    </Grid>
  );
}