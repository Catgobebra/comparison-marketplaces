import React from "react";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { DraggableTableRow, StyledTableCell } from "./styledComponents";

const CharacteristicRow = React.memo(function CharacteristicRow({
  characteristic,
  firstColumnWidth,
  productColumnWidth,
  findCharacteristic,
  moveCharacteristic,
  isSelected,
  onToggleSelect,
  onWeightChange,
  characteristicsExpanded,
}) {
  const originalIndex = findCharacteristic(characteristic.name).index;
  
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CHARACTERISTIC,
      item: { id: characteristic.name, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCharacteristic(droppedId, originalIndex);
        }
      },
    }),
    [characteristic.name, originalIndex, moveCharacteristic],
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.CHARACTERISTIC,
      hover({ id: draggedId }) {
        if (draggedId !== characteristic.name) {
          const { index: overIndex } = findCharacteristic(characteristic.name);
          moveCharacteristic(draggedId, overIndex);
        }
      },
    }),
    [findCharacteristic, moveCharacteristic],
  );

  const isCanDraggable = characteristic.isBestFlags.some(x => x);
  const isDraggable = isCanDraggable && isSelected;
  const opacity = isDragging ? 0 : 1;
  
  const labelId = `enhanced-table-checkbox-${characteristic.name}`;
  
  return (
    <DraggableTableRow
      ref={isDraggable ? (node) => drag(drop(node)) : undefined}
      isdragging={isDragging.toString()}
      style={{
        opacity,
        maxHeight: characteristicsExpanded ? "1000px" : "0",
        overflow: "hidden",
        transition: "all 0.3s ease-in-out",
        display: characteristicsExpanded ? "table-row" : "none",
        cursor: isDraggable ? "move" : "default",
      }}
    >
      <StyledTableCell
        component="th"
        scope="row"
        sx={{ width: firstColumnWidth, position: "relative" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {isCanDraggable ? (
            <>
              <Checkbox
                color="primary"
                checked={isSelected}
                onChange={(event) => onToggleSelect(event, characteristic.name)}
                inputProps={{ "aria-labelledby": labelId }}
              />
              <input 
              id={`weight-${characteristic.name}`} 
              type="number" 
              value={characteristic.manualWeight ?? 1} 
              onChange={(event) => onWeightChange(event, characteristic.name)}
              max="1" 
              min="0" 
              placeholder="Вес"
              step="0.1"
              style={{ width: 50, marginRight: 8 }}
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
});

export default CharacteristicRow;