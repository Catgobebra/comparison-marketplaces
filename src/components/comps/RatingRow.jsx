import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import { StyledTableRow, StyledTableCell } from "./styledComponents";
import {
  ratingConfidenceInterval,
  getStatusRank,
} from "../../utils/tableLogic";

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
                const [low, high] = ratingConfidenceInterval(
                  product.averageRating,
                  product.reviewsCount
                );
                const reliability = getStatusRank(low, high);
                const chipColor =
                  reliability === "высокая"
                    ? "success"
                    : reliability === "средняя"
                    ? "warning"
                    : "error";
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
                    <Chip
                      label={`Надежность: ${reliability}`}
                      color={chipColor}
                      size="small"
                      variant="outlined"
                    />
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
