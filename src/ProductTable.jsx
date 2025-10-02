import * as React from 'react';
import { useLocation } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ReviewsIcon from '@mui/icons-material/Reviews';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function ProductTable(){
    const location = useLocation();
    
     const { productsInfo = [] } = location.state || {};
    
    /*const productsInfo = [{
      "sku": "2429929359",
      "name": "Haклейкa на карту \"Ворон с черепом\"",
      "cardPrice": 165,
      "price": 184,
      "originalPrice": 300,
      "rating": 4.9,
      "reviewsCount": 53010,
      "url": "https://www.ozon.ru/product/2429929359",
      "isAvailable": true,
      "characteristics": [
        {
          "name": "Тип",
          "value": "Игровой"
        },
        {
          "name": "Материал",
          "value": "Пластик"
        }
      ],
      "imageUrls": [
        "https://ir-9.ozone.ru/s3/multimedia-1-3/wc1000/7685161563.jpg"
      ],
      "brand": null
    }];*/

    if (!productsInfo || productsInfo.length === 0) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>Нет данных для отображения</h2>
                <p>Вернитесь на главную страницу и добавьте товары для сравнения.</p>
            </div>
        );
    }

    const allCharacteristics = Array.from(
      new Set(productsInfo.flatMap(product => 
        product.characteristics?.map(char => char.name) || []
      ))
    );

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Сравнение товаров
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="comparison table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Характеристика</StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.name}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Название</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.productName}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Цена</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    <Chip style={{textDecoration: 'line-through'}} label={`${Math.max(product.currentPrice || -Infinity,product.cardPrice || -Infinity,product.originalPrice || -Infinity)}₽`} />
                                    <Chip label={`${Math.min(product.currentPrice || Infinity,product.cardPrice || Infinity,product.originalPrice || Infinity)}₽`} color="success"/>
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                        
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Рейтинг</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.averageRating}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                        
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Количество отзывов</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.reviewsCount}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                        
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Наличие</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.isAvailable ? 'В наличии' : 'Нет в наличии'}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>

                        {allCharacteristics.map(characteristic => (
                            <StyledTableRow key={characteristic}>
                                <StyledTableCell component="th" scope="row">
                                    <strong>{characteristic}</strong>
                                </StyledTableCell>
                                {productsInfo.map((product, index) => {
                                    const char = product.characteristics?.find(c => c.name === characteristic);
                                    return (
                                        <StyledTableCell key={index} align="center">
                                            {char ? char.value : '—'}
                                        </StyledTableCell>
                                    );
                                })}
                            </StyledTableRow>
                        ))}
                        
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Артикул (SKU)</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.article}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                        
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Ссылка</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    <a 
                                        href={product.productUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ fontSize: '0.8em' }}
                                    >
                                        Перейти к товару
                                    </a>
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Изображение товара</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    <img 
                                    key={index}
                                    src={product.imageUrl} 
                                    alt={product.productName}
                                    style={{ 
                                        maxWidth: '200px', 
                                        maxHeight: '200px',
                                        margin: '5px'
                                    }}
                                />
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default ProductTable;