import React from "react";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import SwitchTheme from "../SwitchTheme";

import { FormControl, OutlinedInput, InputAdornment } from "@mui/material";

export default function AddProductForm({
  value,
  onChange,
  onAdd,
  showFab,
  onAddFromTab,
}) {
  return (
    <>
      <FormControl sx={{ width: "100%" }} /* className={styles.inputUrl} */>
        <OutlinedInput
          placeholder="Вставьте URL-адрес продукта"
          value={value}
          onChange={onChange}
          endAdornment={
            <InputAdornment
              position="end"
              sx={{
                margin: 0,
                padding: 0,
                height: "38px",
                fontSize: "10px",
                maxHeight: "none",
                alignSelf: "stretch",
                display: "flex",
                alignItems: "stretch",
                "& .MuiButton-root": {
                  borderRadius: "0 10px 10px 0",
                  margin: 0,
                },
              }}
            >
              <Button
                variant="contained"
                sx={{
                  height: "100%",
                  width: "51px",
                  fontSize: "10px",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: "10px",
                  borderBottomRightRadius: "10px",
                  mx: "-1px",
                  mr: "-9px",
                }}
                onClick={() => onAdd(value)}
              >
                Добавить
              </Button>
            </InputAdornment>
          }
          sx={{
            padding: 0,
            height: "38px",
            "& .MuiOutlinedInput-input": {
              padding: "12px 14px",
              borderRadius: "10px 0 0 10px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderRight: "divider",
              borderRadius: "10px",
            },
            "&::placeholder": {
              fontSize: "8px",
            },
            "& .MuiOutlinedInput-root": {
              padding: 0,
              display: "flex",
              alignItems: "stretch",
              borderRadius: "10px",
            },
          }}
        />
      </FormControl>
      {showFab && (
        <Fab
          onClick={onAddFromTab}
          color="primary"
          aria-label="add"
          /* className={styles.fab} */
        >
          <AddIcon />
        </Fab>
      )}
      <SwitchTheme />
    </>
  );
}
