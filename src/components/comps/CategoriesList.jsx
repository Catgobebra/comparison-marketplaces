import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Box,
  IconButton,
  Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import useCategories  from "../../hooks/useCategories";

export default function CategoriesList({currentCategory, onCategoryChange}) {
  const { categories, isLoading, addCategory, removeCategory, reservedCategories } = useCategories();
  const [inputValue, setInputValue] = useState('');

  const handleInputBlur = () => {
    if (inputValue.trim()) {
      addCategory(inputValue);
      setInputValue('');
    }
  };

  const handleCategoryClick = (categoryName) => {
    onCategoryChange(categoryName);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (addCategory(inputValue)) {
        setInputValue('');
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ width: "88px", display: "flex", justifyContent: "center", p: 2 }}>
        <Typography variant="body2">Загрузка...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "88px", height: "100%", overflowY: "scroll" }}>
      <List dense sx={{ width: "100%" }}>
        {Object.keys(categories).map((categoryName) => (
          <ListItem key={categoryName} disablePadding sx={{ position: "relative" }}>
            <ListItemButton sx={{ minHeight: 48 }}
            onClick={() => handleCategoryClick(categoryName)}>
              <ListItemText 
                primary={categoryName} 
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  noWrap: true,
                  title: categoryName
                }}
              />
              
              {!reservedCategories.includes(categoryName) && (
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    right: 1,
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.6,
                    "&:hover": { opacity: 1 }
                  }}
                  onClick={() => removeCategory(categoryName)}
                  aria-label={`Удалить категорию ${categoryName}`}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </ListItemButton>
          </ListItem>
        ))}
        
        <ListItem disablePadding>
          <Box sx={{ p: 1, width: "100%" }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Новая категория"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleInputBlur}
              onKeyPress={handleInputKeyPress}
              inputProps={{ maxLength: 20 }}
              sx={{
                "& .MuiInputBase-root": { height: 32 },
                "& .MuiOutlinedInput-input": { 
                  fontSize: "0.875rem",
                  padding: "6px 8px"
                }
              }}
            />
          </Box>
        </ListItem>
      </List>
    </Box>
  );
}