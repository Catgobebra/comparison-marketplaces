import React from "react";
import Chip from "@mui/material/Chip";

import {
  ratingConfidenceInterval,
  getStatusRank,
} from "../../utils/tableLogic";

export default function ReliabilityChip({ averageRating, reviewsCount,sx }) {
  const [low, high] = ratingConfidenceInterval(averageRating, reviewsCount);
  const reliability = getStatusRank(low, high);
    const chipColor =
    reliability === "высокая"
    ? "success"
    : reliability === "средняя"
    ? "warning"
    : "error";
  return (
    <Chip
    label={`Надежность: ${reliability}`}
    color={chipColor}
    size="small"
    variant="outlined"
    sx={sx}
    />
  );
}
