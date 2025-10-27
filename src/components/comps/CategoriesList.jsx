import React from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import styles from './CategoriesList.module.sass';

export default function CategoriesList() {
  return (
    <List sx={{width: "88px"}}>
        <ListItem component="div" disablePadding>
            <ListItemButton>
                <ListItemText className={styles.listElement} primary="Избранное" />
            </ListItemButton>
        </ListItem>
        <ListItem component="div" disablePadding>
            <ListItemButton>
                <ListItemText className={styles.listElement} primary="Новый год" />
            </ListItemButton>
        </ListItem>
        <ListItem component="div" disablePadding>
            <ListItemButton>
                <ListItemText className={styles.listElement} primary="Подарок парню" />
            </ListItemButton>
        </ListItem>
    </List>
  );
}
