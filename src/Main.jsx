import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import Badge from '@mui/material/Badge';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function Main(){

    const [products,setProducts] = useState([])
    const [currentLink, setCurrentLink] = useState('');

    const webLink = "https://learn.javascript.ru/regexp-introduction" 
    const isOzonProduct = /https:\/\/www\.ozon\.ru\/product\/.+/gi.test(webLink);
    
    const addProduct = () => {
        setProducts([...products,currentLink])
        setCurrentLink('')
    }

    const handleDelete = (productToDelete) => {
        setProducts(products.filter(product => product !== productToDelete));
    };

    const handleInputChange = (event) => {
        setCurrentLink(event.target.value); 
    };

    return(
        <>
        <Container maxWidth="lg" style={{display: 'flex', alignItems : 'center', justifyContent : 'center', flexDirection : 'column'}}>
         <Box style={{padding : '100px'}}>
            <Box style={{display: 'flex', gap: 20, position : 'relative'}}>
            <Badge badgeContent={products.length} color="primary" style={{position : 'absolute', top : '-50px', right : '0'}}>
            <InventoryIcon color="action" />
            </Badge>
            <TextField
            id="filled-search"
            label="Введите ссылку на товар"
            type="search"
            variant="filled"
            value={currentLink}
            onChange={handleInputChange}
            />
            <Button variant="contained" onClick={addProduct}>Добавить</Button>
            {isOzonProduct &&
            <Fab color="primary" aria-label="add">
            <AddIcon />
            </Fab>
            }
            </Box>
            <Box>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {products.map((value,index) => (
                <ListItem
                key={index}
                disableGutters
                secondaryAction={
                    <IconButton 
                    aria-label="delete"
                    onClick={() => handleDelete(value)} 
                    >
                    <DeleteIcon />
                    </IconButton>
                }
                >
                <ListItemText primary={`${value}`} />
                </ListItem>
                ))}
                </List>
            </Box>
            <Button variant="contained">Перейти</Button>
         </Box>
        </Container>
        </>
    )
}

export default Main