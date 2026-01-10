import React from "react";
import ProductListItem from "../../Widgets/ProductListItem/ProductListItem";
import Grid from '@mui/material/Grid';

export default function ProductList({ products,currentCategory }) {
  return (
    <Grid container spacing={2}>
      {products.map((p, i) => (
        <Grid item key={p.id} xs={12} sm={6}>
          <ProductListItem 
            key={p.id} 
            productId={p.id} 
            product={p}
            currentCategory={currentCategory}
          />
        </Grid>
      ))}
    </Grid>
  );
}