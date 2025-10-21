import React from "react";
import Chip from "@mui/material/Chip";
import { StyledTableRow, StyledTableCell } from "./styledComponents";
import { getPriceInfo } from "../../utils/tableLogic";

export default function PriceRow({ productsInfo }) {
  return (
    <StyledTableRow>
      <StyledTableCell component="th" scope="row">
        <strong>Цена</strong>
      </StyledTableCell>
      {productsInfo.map((product, index) => {
        const priceInfo = getPriceInfo(product);
        return (
          <StyledTableCell key={index} align="center">
            {priceInfo.max > priceInfo.min && priceInfo.min > 0 ? (
              <>
                <Chip
                  style={{ textDecoration: "line-through", margin: 2 }}
                  label={`${priceInfo.max}₽`}
                  size="small"
                />
                <Chip
                  label={`${priceInfo.min}₽`}
                  color="success"
                  size="small"
                />
              </>
            ) : priceInfo.min > 0 ? (
              <Chip label={`${priceInfo.min}₽`} color="primary" />
            ) : (
              "—"
            )}
          </StyledTableCell>
        );
      })}
    </StyledTableRow>
  );
}
