import React from "react";
import { StyledTableRow, StyledTableCell } from "./styledComponents";

export default function ImagesRow({ productsInfo }) {
  return (
    <StyledTableRow>
      <StyledTableCell component="th" scope="row">
        <strong>Изображение товара</strong>
      </StyledTableCell>
      {productsInfo.map((product, index) => (
        <StyledTableCell key={index} align="center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.productName}
              style={{ maxWidth: 200, maxHeight: 200, margin: 5 }}
            />
          ) : (
            "—"
          )}
        </StyledTableCell>
      ))}
    </StyledTableRow>
  );
}
