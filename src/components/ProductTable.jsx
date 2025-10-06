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
import Rating from '@mui/material/Rating';

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

function ProductTable() {
    const location = useLocation();
    const { productsInfo = [] } = location.state || {};

    console.log(productsInfo);

    if (!productsInfo || productsInfo.length === 0) {
        return (
            <div style={{ padding: '20px' }}>
                <h2>Нет данных для отображения</h2>
                <p>Вернитесь на главную страницу и добавьте товары для сравнения.</p>
            </div>
        );
    }

    const allCharacteristics = Array.from(
        new Set(
            productsInfo.flatMap(product => 
                product.characteristics?.flatMap(group => 
                    group.characteristics?.map(char => char.name) || []
                ) || []
            )
        )
    );

    const findCharacteristicValue = (product, characteristicName) => {
        if (!product.characteristics) return '—';
        
        for (const group of product.characteristics) {
            const foundChar = group.characteristics?.find(c => c.name === characteristicName);
            if (foundChar) {
                return foundChar.value;
            }
        }
        return '—';
    };

    const getPriceInfo = (product) => {
        const prices = [
            product.currentPrice || 0,
            product.cardPrice || 0,
            product.originalPrice || 0
        ].filter(price => price > 0);
        
        if (prices.length === 0) return { min: 0, max: 0 };
        
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    };

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
                                    {product.productName || `Товар ${index + 1}`}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Основная информация о товарах */}
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Название</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.productName || '—'}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                        
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Цена</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => {
                                const priceInfo = getPriceInfo(product);
                                return (
                                    <StyledTableCell key={index} align="center">
                                        {priceInfo.max > priceInfo.min && priceInfo.min > 0 ? (
                                            <>
                                                <Chip 
                                                    style={{ textDecoration: 'line-through', margin: '2px' }} 
                                                    label={`${priceInfo.max}₽`} 
                                                    size="small"
                                                />
                                                <Chip 
                                                    label={`${priceInfo.min}₽`} 
                                                    color="success" 
                                                    size="small"
                                                />
                                            </>
                                        ) : priceInfo.min > 0 ? (
                                            <Chip label={`${priceInfo.min}₽`} color="primary" />
                                        ) : (
                                            '—'
                                        )}
                                    </StyledTableCell>
                                );
                            })}
                        </StyledTableRow>
                        
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Рейтинг</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.averageRating ? (
                                        <Rating 
                                            name="half-rating-read" 
                                            value={product.averageRating} 
                                            precision={0.1} 
                                            readOnly 
                                        />
                                    ) : (
                                        '—'
                                    )}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                        
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Количество отзывов</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.reviewsCount || '—'}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                        
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Наличие</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.isAvailable ? 
                                        <Chip label="В наличии" color="success" size="small" /> : 
                                        <Chip label="Нет в наличии" color="error" size="small" />
                                    }
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>

                        {/* Характеристики */}
                        {allCharacteristics.length > 0 ? (
                            allCharacteristics.map(characteristic => (
                                <StyledTableRow key={characteristic}>
                                    <StyledTableCell component="th" scope="row">
                                        <strong>{characteristic}</strong>
                                    </StyledTableCell>
                                    {productsInfo.map((product, index) => (
                                        <StyledTableCell key={index} align="center">
                                            {findCharacteristicValue(product, characteristic)}
                                        </StyledTableCell>
                                    ))}
                                </StyledTableRow>
                            ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={productsInfo.length + 1} align="center">
                                    Нет характеристик для отображения
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                        
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Артикул (SKU)</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.article || '—'}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                        
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Бренд</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.brand || '—'}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                        
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Продавец</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.sellerName || '—'}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                        
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Ссылка на товар</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.productUrl ? (
                                        <a 
                                            href={product.productUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ fontSize: '0.8em' }}
                                        >
                                            Перейти к товару
                                        </a>
                                    ) : (
                                        '—'
                                    )}
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                        
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row">
                                <strong>Изображение товара</strong>
                            </StyledTableCell>
                            {productsInfo.map((product, index) => (
                                <StyledTableCell key={index} align="center">
                                    {product.imageUrl ? (
                                        <img 
                                            src={product.imageUrl} 
                                            alt={product.productName}
                                            style={{ 
                                                maxWidth: '200px', 
                                                maxHeight: '200px',
                                                margin: '5px'
                                            }}
                                        />
                                    ) : (
                                        '—'
                                    )}
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