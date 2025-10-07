/* global chrome */
import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import Badge from '@mui/material/Badge';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useState, useEffect } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import {changeProducts} from '../redux-state/reducers/products'

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function Main(){

    const navigate = useNavigate();

    const dispatch = useDispatch()
    const products = useSelector(state => state.products.products)

    const [currentLink, setCurrentLink] = useState('');

    const isOzonProduct = /https:\/\/www\.ozon\.ru\/product\/.+/i
    const isCurrentSkuOzon = /\/product\/[^\/]+\-(\d{9,})(?:\/|\?|$)/i

    const [currentUrl, setCurrentUrl] = useState('');
    const [isProduct, setIsProduct] = useState(false);
    const [showFab, setShowFab] = useState(false);

    const [load, setLoad] = React.useState(false);
    
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
            const url = tabs[0].url;
            setCurrentUrl(url);
            
            const isOzon = isOzonProduct.test(url);
            setIsProduct(isOzon);
            
            if (isOzon) {
                const sku = url.match(isCurrentSkuOzon)?.[1];
                const isAlreadyAdded = sku && products.some(product => product.article === sku);
                setShowFab(!isAlreadyAdded);
            } else {
                setShowFab(false);
            }
        }
        });
    }, [products]);


    useEffect(() => {
    chrome.storage.local.get(["myStoredArray"]).then((result) => {
        console.log('Загружено:', result.myStoredArray);
        if (result.myStoredArray && result.myStoredArray.length > 0) {
        dispatch(changeProducts(result.myStoredArray));
        }
    });

    }, [dispatch]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar(prev => ({...prev, open: false}));
    };

    const getProductsInfo = async (arg) => {
        try {
            setLoad(true)
            const promises = [arg].map(sku => 
                fetch(`http://localhost:5018/api/Products/by-sku/${sku}`, {
                    method: 'GET',
                    headers: {
                        'accept': 'text/plain'
                    }
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
            );

            const results = await Promise.all(promises);
            
            console.log('Products info:', results);

            const newProducts = [...products, ...results];
            dispatch(changeProducts(newProducts));

            chrome.storage.local.set({ myStoredArray: newProducts }).then(() => {});
            
            /* chrome.tabs.create({
            url: 'http://localhost:3000/comparison',
                active: true
            }); */
            /* navigate('/comparison', {
                state: { productsInfo: results }
            }); */
            
            
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            setSnackbar({
                open: true,
                severity: "warning",
                message: "Ошибка при получении данных о товарах"
            });
        }
        finally {
            setLoad(false)
        }
    }

    const checkProduct = (url) => {
        return isOzonProduct.test(url) && isCurrentSkuOzon.test(url);
    }
    
    const addProduct = (currentState,currentSetState) => {
        const isAlreadyAdded = products.some(product => product.article === currentState.match(isCurrentSkuOzon)[1]);
        const isValidProduct = checkProduct(currentState);

        if (isValidProduct && !isAlreadyAdded) {
            //currentState.match(isCurrentSkuOzon)[1]
            getProductsInfo(currentState.match(isCurrentSkuOzon)[1])
            setShowFab(false);
            //const newProducts = [...products, currentState.match(isCurrentSkuOzon)[1]];
            //dispatch(changeProducts(newProducts));

            //chrome.storage.local.set({ myStoredArray: newProducts }).then(() => {});
          /*   setSnackbar({
                open: true,
                severity: "success",
                message: "Товар успешно добавлен"
            });
        } else {
            setSnackbar({
                open: true,
                severity: "error",
                message: "Неверная или пустая ссылка"
            }); */
        }

        currentSetState('');
    }

    const handleDelete = (productToDelete) => {
        const newProducts = products.filter(product => product !== productToDelete);
        dispatch(changeProducts(newProducts));
        chrome.storage.local.set({ myStoredArray: newProducts }).then(() => {});
        const sku = currentUrl.match(isCurrentSkuOzon)?.[1];
        if (sku && productToDelete.article === sku) {
            setShowFab(true);
        }
    };

    const handleInputChange = (event) => {
        setCurrentLink(event.target.value); 
    };
    
    return(
        <>
        <Container maxWidth="lg" style={{ minWidth : '400px', display: 'flex', alignItems : 'center', justifyContent : 'center', flexDirection : 'column'}}>
         <Box style={{padding : '10px'}}>
            <Box style={{display: 'flex', gap: 20, position : 'relative', marginTop: '50px'}}>
            <Badge badgeContent={products.length} color="primary" style={{position : 'absolute', top : '-50px', right : '0'}}>
            <ShoppingBasketIcon color="action" />
            </Badge>
            <TextField
            id="filled-search"
            label="Введите ссылку на товар"
            type="search"
            variant="filled"
            value={currentLink}
            onChange={handleInputChange}
            />
            <Button variant="contained" onClick={() => addProduct(currentLink,setCurrentLink)}>Добавить</Button>
            {(showFab && isProduct) &&
                (<Fab onClick={() => addProduct(currentUrl,setCurrentUrl)} style={{minWidth: '56px'}} color="primary" aria-label="add">
                <AddIcon/>
                </Fab>)
            }
            <Snackbar open={snackbar.open} autoHideDuration={2000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={snackbar.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {snackbar.message}
            </Alert>
            </Snackbar>
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
                <InventoryIcon color="action" />
                <ListItemText primary={`${value.productName.length > 30 ? value.productName.slice(0,30)+'...' : value.productName}`} />
                </ListItem>
                ))}
                </List>
            </Box>
            <Button variant="contained">
                Перейти
            </Button>
         </Box>
        </Container>
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={load}
        >
            <CircularProgress color="inherit" />
        </Backdrop>

        </>
    )
}

export default Main