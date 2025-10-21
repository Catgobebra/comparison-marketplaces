import React from "react";
import { StyledTableRow, StyledTableCell } from "./styledComponents";

export default function AdditionalInfoRows({ productsInfo }) {
  return (
    <>
      <StyledTableRow>
        <StyledTableCell component="th" scope="row">
          <strong>Артикул (SKU)</strong>
        </StyledTableCell>
        {productsInfo.map((product, index) => (
          <StyledTableCell key={index} align="center">
            {product.article || "—"}
          </StyledTableCell>
        ))}
      </StyledTableRow>

      <StyledTableRow>
        <StyledTableCell component="th" scope="row">
          <strong>Бренд</strong>
        </StyledTableCell>
        {productsInfo.map((product, index) => (
          <StyledTableCell key={index} align="center">
            {product.brand || "—"}
          </StyledTableCell>
        ))}
      </StyledTableRow>

      <StyledTableRow>
        <StyledTableCell component="th" scope="row">
          <strong>Продавец</strong>
        </StyledTableCell>
        {productsInfo.map((product, index) => (
          <StyledTableCell key={index} align="center">
            {product.sellerName || "—"}
          </StyledTableCell>
        ))}
      </StyledTableRow>

      <StyledTableRow>
        <StyledTableCell component="th" scope="row">
          <strong>Ссылка на товар</strong>
        </StyledTableCell>
        {productsInfo.map((product, index) => (
          <StyledTableCell key={index} align="center">
            {product.productUrl ? (
              <a
                href={product.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.8em" }}
              >
                Перейти к товару
              </a>
            ) : (
              "—"
            )}
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </>
  );
}
