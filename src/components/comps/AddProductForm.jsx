import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

export default function AddProductForm({
  value,
  onChange,
  onAdd,
  showFab,
  onAddFromTab,
}) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <TextField
        id="filled-search"
        label="Введите ссылку на товар"
        type="search"
        variant="filled"
        value={value}
        onChange={onChange}
      />
      <Button variant="contained" onClick={() => onAdd(value)}>
        Добавить
      </Button>
      {showFab && (
        <Fab
          onClick={onAddFromTab}
          style={{ minWidth: "56px" }}
          color="primary"
          aria-label="add"
        >
          <AddIcon />
        </Fab>
      )}
    </div>
  );
}
