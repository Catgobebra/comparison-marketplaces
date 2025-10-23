import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import styles from './AddProductForm.module.sass';

import { FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material';

export default function AddProductForm({
  value,
  onChange,
  onAdd,
  showFab,
  onAddFromTab,
}) {
  return (
    <>
    <FormControl sx={{ width: '100%' }} className={styles.inputUrl}>
    <OutlinedInput
      placeholder="Вставьте URL-адрес продукта"
      endAdornment={
        <InputAdornment 
          position="end"
          sx={{ 
            margin: 0,
            padding: 0,
            maxHeight: 'none', 
            alignSelf: 'stretch', 
            display: 'flex',
            alignItems: 'stretch',
            '& .MuiButton-root': {
              borderRadius: '0 4px 4px 0',
              margin: 0
            }
          }}
        >
          <Button 
            variant="contained" 
            sx={{ 
              px: 3,
              margin: '-1px 0 -1px 0'
            }}
            onClick={() => onAdd(value)}
          >
            Добавить
          </Button>
        </InputAdornment>
      }
      sx={{
        padding: 0,
        '& .MuiOutlinedInput-input': {
          padding: '12px 14px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderRight: 'none',
        },
        '& .MuiOutlinedInput-root': {
          padding: 0,
          display: 'flex',
          alignItems: 'stretch',
        }
      }}
    />
  </FormControl>
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
          color="primary"
          aria-label="add"
          className={styles.fab}
        >
          <AddIcon />
        </Fab>
      )}
    </>
  );
}
