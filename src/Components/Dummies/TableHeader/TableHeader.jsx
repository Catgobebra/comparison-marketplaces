import React from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { StyledTableCell } from "../../UI/StyledComponents/StyledComponents";

export default function TableHeader({
  firstColumnWidth,
  productColumnWidth,
  productsInfo,
}) {
  return (
    <TableHead>
      <TableRow>
        <StyledTableCell sx={{ width: firstColumnWidth }}>
          Характеристика
        </StyledTableCell>
        {productsInfo.map((product, index) => (
          <StyledTableCell
            key={index}
            align="center"
            sx={{ width: productColumnWidth }}
          >
            {product.productName || `Товар ${index + 1}`}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
