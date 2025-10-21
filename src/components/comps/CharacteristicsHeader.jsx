import React from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { StyledTableRow, StyledTableCell } from "./styledComponents";

export default function CharacteristicsHeader({
  displayCharacteristics,
  selectedCharacteristics,
  onSelectAll,
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
          backgroundColor: "grey.200",
          fontWeight: "bold",
          fontSize: "1.1em",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            color="primary"
            indeterminate={
              selectedCharacteristics.length > 0 &&
              selectedCharacteristics.length < displayCharacteristics.length
            }
            checked={
              displayCharacteristics.length > 0 &&
              selectedCharacteristics.length === displayCharacteristics.length
            }
            onChange={onSelectAll}
          />
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
