import React from "react";
import TextField from "@mui/material/TextField";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Checkbox from "@mui/material/Checkbox";
import { DraggableTableRow, StyledTableCell } from "./styledComponents";

export default function CharacteristicRow({
  characteristic,
  rowIndex,
  firstColumnWidth,
  productColumnWidth,
  draggedRow,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  isSelected,
  onToggleSelect,
  onWeightChange,
  characteristicsExpanded,
}) {
  const labelId = `enhanced-table-checkbox-${rowIndex}`;
  const isDraggable = characteristic.isBestFlags.some(x => x);
  
  return (
    <DraggableTableRow
      key={characteristic.name}
      isdragging={(draggedRow === rowIndex).toString()}
      draggable={isDraggable}
      onDragStart={isDraggable ? (e) => onDragStart(e, rowIndex) : undefined}
      onDragOver={isDraggable ? (e) => onDragOver(e, rowIndex) : undefined}
      onDragLeave={isDraggable ? onDragLeave : undefined}
      onDrop={isDraggable ? (e) => onDrop(e, rowIndex) : undefined}
      onDragEnd={isDraggable ? onDragEnd : undefined}
      style={{
        maxHeight: characteristicsExpanded ? "1000px" : "0",
        opacity: characteristicsExpanded ? 1 : 0,
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        display: characteristicsExpanded ? "table-row" : "none",
        cursor: isDraggable ? "grab" : "default", 
      }}
    >
      <StyledTableCell
        component="th"
        scope="row"
        sx={{ width: firstColumnWidth, position: "relative" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {isDraggable ? (
            <>
              <Checkbox
                color="primary"
                checked={isSelected}
                inputProps={{ "aria-labelledby": labelId }}
                onClick={(event) => onToggleSelect(event, characteristic.name)}
              />
              <TextField
                id={`weight-${rowIndex}`}
                label="Вес"
                value={characteristic.manualWeight || 1}
                variant="standard"
                style={{ width: 50 }}
                onChange={(event) => onWeightChange(event, rowIndex)}
                inputProps={{ min: "0.1", max: "10", step: "0.1" }}
              />
              <DragIndicatorIcon
                sx={{
                  cursor: "grab",
                  color: "action.active",
                  "&:hover": { color: "primary.main" },
                  marginRight: 8,
                }}
              />
            </>
          ) : (
            <div style={{ marginLeft: "72px" }}></div> 
          )}
          {characteristic.name}
        </div>
      </StyledTableCell>
      {characteristic.values.map((value, index) => (
        <StyledTableCell
          key={index}
          align="center"
          sx={{
            width: productColumnWidth,
            color: characteristic.isBestFlags[index]
              ? "success.light"
              : "inherit",
            textShadow: characteristic.isBestFlags[index]
              ? "0px 2px 3px rgba(76, 175, 80, 1);"
              : "",
            fontWeight: characteristic.isBestFlags[index] ? "bold" : "normal",
          }}
        >
          {value}
        </StyledTableCell>
      ))}
    </DraggableTableRow>
  );
}