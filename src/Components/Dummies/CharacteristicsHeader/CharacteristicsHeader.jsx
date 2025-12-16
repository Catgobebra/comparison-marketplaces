import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { StyledTableRow, StyledTableCell } from "../../UI/StyledComponents/StyledComponents";

export default function CharacteristicsHeader({
  characteristicsExpanded,
  toggleExpanded,
}) {
  return (
    <StyledTableRow>
      <StyledTableCell
        component="th"
        scope="row"
        colSpan={999}
        sx={{
          fontWeight: "bold",
          fontSize: "1.1em",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            aria-label="expand characteristics"
            size="small"
            onClick={toggleExpanded}
            sx={{ mr: 1 }}
          >
            {characteristicsExpanded ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
          Общие характеристики
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  );
}
