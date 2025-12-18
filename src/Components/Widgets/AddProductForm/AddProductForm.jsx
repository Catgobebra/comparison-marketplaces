import React from "react";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import SwitchTheme from "../../UI/SwitchTheme/SwitchTheme";

import { FormControl, OutlinedInput, InputAdornment } from "@mui/material";

import * as styles from './styles'

export default function AddProductForm({
  value,
  onChange,
  onAdd,
  showFab,
  onAddFromTab,
}) {
  return (
    <>
      <FormControl 
      sx={styles.inputUrl} >
        <OutlinedInput
          placeholder="Вставьте URL-адрес продукта"
          value={value}
          onChange={onChange}
          endAdornment={
            <InputAdornment
              position="end"
              sx={styles.inputAdornement}
            >
              <Button
                variant="contained"
                sx={styles.inputButton}
                onClick={() => onAdd(value)}
              >
                Добавить
              </Button>
            </InputAdornment>
          }
          sx={styles.outlineInput}
        />
      </FormControl>
      {showFab && (
        <Fab
          onClick={onAddFromTab}
          color="primary"
          aria-label="add"
          sx={styles.fab}
        >
          <AddIcon />
        </Fab>
      )}
      <SwitchTheme />
    </>
  );
}
