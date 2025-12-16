import React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { StyledTableRow, StyledTableCell } from "../../UI/StyledComponents/StyledComponents";
import ReliabilityChip from '../../UI/ReliabilityChip/ReliabilityChip';

export default function RatingRow({ productsInfo }) {
  return (
    <StyledTableRow>
      <StyledTableCell component="th" scope="row">
        <strong>Рейтинг</strong>
      </StyledTableCell>
      {productsInfo.map((product, index) => (
        <StyledTableCell key={index} align="center">
          {product.averageRating
            ? (() => {
                return (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Rating
                      name="half-rating-read"
                      value={product.averageRating}
                      precision={0.01}
                      readOnly
                    />
                    <ReliabilityChip averageRating={product.averageRating} reviewsCount={product.reviewsCount}/>
                    <Typography variant="caption" color="text.secondary">
                      {product.averageRating.toFixed(1)} ({product.reviewsCount}
                      )
                    </Typography>
                  </Box>
                );
              })()
            : "—"}
        </StyledTableCell>
      ))}
    </StyledTableRow>
  );
}
