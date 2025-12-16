import React from "react";
import Chip from "@mui/material/Chip";
import { StyledTableRow, StyledTableCell } from "../../UI/StyledComponents/StyledComponents";

export default function AvailabilityRow({ productsInfo }) {
  return (
    <StyledTableRow>
      <StyledTableCell component="th" scope="row">
        <strong>Наличие</strong>
      </StyledTableCell>
      {productsInfo.map((product, index) => (
        <StyledTableCell key={index} align="center">
          {product.isAvailable ? (
            <Chip label="В наличии" color="success" size="small" />
          ) : (
            <Chip label="Нет в наличии" color="error" size="small" />
          )}
        </StyledTableCell>
      ))}
    </StyledTableRow>
  );
}
