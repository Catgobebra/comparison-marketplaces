/* global chrome */
import React from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { useDispatch, useSelector } from "react-redux";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import TableHeader from "../comps/TableHeader";
import ImagesRow from "../comps/ImagesRow";
import PriceRow from "../comps/PriceRow";
import RatingRow from "../comps/RatingRow";
import AvailabilityRow from "../comps/AvailabilityRow";
import CharacteristicsHeader from "../comps/CharacteristicsHeader";
import CharacteristicRow from "../comps/CharacteristicRow";
import AdditionalInfoRows from "../comps/AdditionalInfoRows";

import { getPriceInfo } from "../../utils/tableLogic";

import {setProduct} from "../../redux/slices/compareProducts"

import SwitchTheme from "../comps/SwitchTheme";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css'

import {useColorScheme } from '@mui/material/styles';

import { getCostWeight } from "../../utils/tableLogic";
import { StyledTableRow, StyledTableCell } from "../comps/styledComponents";
import LoadingBackdrop from "../comps/LoadingBackdrop";
import { useGetCompareProductsQuery } from '../../redux/api'

function ProductTableContent() {
  const products = useSelector((state) => state.products.products).filter(x => x.isSelected); 
  const newUnicProducts = products.map(x => [x.id,x.productItem.article]);
  const compareProducts = useSelector((state) => state.compareProducts.lastCompare)
  const newcompareProducts = compareProducts.map(x => x.productItem)
  const newUnicCompareProducts = compareProducts.map(x => [x?.id,x.productItem?.article]);
  let newProducts = products.map(x => x.productItem);
  console.log(compareProducts,newUnicCompareProducts)
    const shouldSkip = newProducts.length <= 1 || 
    JSON.stringify(newUnicCompareProducts) === JSON.stringify(newUnicProducts);

  const { data: productsInfo, isLoading, error, refetch,isFetching } = useGetCompareProductsQuery(newProducts,{skip: shouldSkip});
  const dispatch = useDispatch()
  
  const { mode, setMode } = useColorScheme();

  React.useEffect(() => {
    if (JSON.stringify(newUnicCompareProducts) === JSON.stringify(newUnicProducts)) {
      const newCompareProduct = compareProducts.map(x => x.productItem);
      setsProductsInfo(compareProducts.length > 0 ? newCompareProduct : products);
    } else if (productsInfo) {
      setsProductsInfo(productsInfo);
      dispatch(setProduct({currentCompare: products.map((x,index) => 
        ({id : x.id, productItem: productsInfo[index],marketplaceName : x.marketplaceName,isSelected : x.isSelected}))}));
      }
    console.log('+',products,productsInfo)
  }, [productsInfo, dispatch]);

  const onReload = () => {
    refetch()
  }

  //console.log(productsInfo)
  const [sProductsInfo, setsProductsInfo] = React.useState([]); //!
  const [characteristicsExpanded, setCharacteristicsExpanded] = React.useState(true);
  const [orderedCharacteristics, setOrderedCharacteristics] = React.useState([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = React.useState([]);
  const [rankItems, setRankItems] = React.useState([]);
  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    if (!orderedCharacteristics || !sProductsInfo || sProductsInfo.length === 0)
      return;
    
    const rank = new Array(sProductsInfo.length).fill(0);

    orderedCharacteristics.forEach((characteristic) => {
      if (characteristic && characteristic.isBestFlags && characteristic.costWeight) {
        characteristic.isBestFlags.forEach((isBest, productIndex) => {
          if (isBest && productIndex < rank.length)
            rank[productIndex] += characteristic.costWeight;
        });
      }
    });

    const total = rank.reduce((sum, value) => sum + value, 0);
    
    let normalizedRank;
    if (total > 0) {
      normalizedRank = rank.map(value => Math.round((value / total) * 100));
    } else {
      normalizedRank = rank.map(() => 100 / rank.length);
    }
    
    setRankItems(normalizedRank);
  }, [orderedCharacteristics, sProductsInfo]);

  const getProductCharacteristics = (product) => {
    if (!product.characteristics) return [];
    const characteristics = [];
    Object.values(product.characteristics).forEach((char) => {
      if (
        ["Артикул", "Бренд", "Продавец", "Ссылка на товар"].includes(char.name) ||
        !char.value ||
        char.value === "—"
      )
        return;
      characteristics.push({
        name: char.name,
        value: char.value,
        isBest: char.isBest || false,
      });
    });
    return characteristics;
  };

    const handleToggleBestFlag = (characteristicName, productIndex) => {
  setOrderedCharacteristics(prev => {
    const updated = prev.map(char => 
      (char.name === characteristicName 
        ? {
            ...char,
            isBestFlags: char.isBestFlags.map((flag, index) => 
              index === productIndex ? !flag : flag
            )
          }
        : char)
    );
    
    const sorted = [...updated].sort((a, b) => {
      const aHasBest = a.isBestFlags.some(x => x);
      const bHasBest = b.isBestFlags.some(x => x);
      
      if (aHasBest && !bHasBest) return -1;
      if (!aHasBest && bHasBest) return 1;
      
      const aIndex = prev.findIndex(x => x.name === a.name);
      const bIndex = prev.findIndex(x => x.name === b.name);
      return aIndex - bIndex;
    });
    
    const sortedWithWeights = sorted.map((char, index) => ({
      ...char,
      costWeight: getCostWeight(
        char.name,
        sorted.length,
        index,
        selectedCharacteristics,
        char.manualWeight
      )
    }));
    
    return sortedWithWeights;
  });
};

  const getCommonCharacteristics = React.useCallback(() => {
    if (!sProductsInfo || sProductsInfo.length === 0) return [];
    const allCharacteristics = [];
    const characteristicNames = new Set();
    sProductsInfo.forEach((product, index) => {
      const productChars = getProductCharacteristics(product);
      allCharacteristics[index] = productChars;
      productChars.forEach((char) => characteristicNames.add(char.name));
    });
    const commonCharNames = Array.from(characteristicNames).filter((charName) =>
      sProductsInfo.every((_, index) =>
        allCharacteristics[index].some((char) => char.name === charName)
      )
    );
    return commonCharNames.map((charName, index_) => {
      const values = [];
      const isBestFlags = [];
      sProductsInfo.forEach((_, index) => {
        const char = allCharacteristics[index].find((c) => c.name === charName);
        if (char) {
          values.push(char.value);
          isBestFlags.push(char.isBest);
        }
      });
      const isCompare = isBestFlags.some((x) => x);
      return {
        name: charName,
        values,
        isBestFlags,
        manualWeight: 1,
        costWeight: isCompare
          ? getCostWeight(
              charName,
              commonCharNames.length,
              index_,
              selectedCharacteristics
            )
          : 1,
      };
    });
  }, [sProductsInfo, selectedCharacteristics]);

  const commonCharacteristics = getCommonCharacteristics();

  React.useEffect(() => {
    if (commonCharacteristics.length > 0) {
      if (isInitialMount.current || orderedCharacteristics.length === 0) {
        const characteristicsWithWeights = commonCharacteristics.map((char, index) => ({
          ...char,
          costWeight:
            char.costWeight > 0
              ? getCostWeight(
                  char.name,
                  commonCharacteristics.length,
                  index,
                  selectedCharacteristics,
                  char.manualWeight
                )
              : 0,
        }));
        setOrderedCharacteristics([
          ...characteristicsWithWeights.filter(item => item.isBestFlags.some(x => x)),
          ...characteristicsWithWeights.filter(item => !item.isBestFlags.some(x => x))
        ]);
        isInitialMount.current = false;
      }
    }
  }, [commonCharacteristics, selectedCharacteristics]);

  const findCharacteristic = React.useCallback(
    (id) => {
      const characteristic = orderedCharacteristics.find((c) => c.name === id);
      return {
        characteristic,
        index: orderedCharacteristics.indexOf(characteristic),
      };
    },
    [orderedCharacteristics]
  );

  const moveCharacteristic = React.useCallback(
    (id, atIndex) => {
      const { characteristic, index } = findCharacteristic(id);
      if (!characteristic) return;

      const newOrderedCharacteristics = [...orderedCharacteristics];
      newOrderedCharacteristics.splice(index, 1);
      newOrderedCharacteristics.splice(atIndex, 0, characteristic);

      const updatedCharacteristics = newOrderedCharacteristics.map((char, idx) => ({
        ...char,
        costWeight:
          char.costWeight > 0
            ? getCostWeight(
                char.name,
                newOrderedCharacteristics.length,
                idx,
                selectedCharacteristics,
                char.manualWeight
              )
            : 0,
      }));

      setOrderedCharacteristics(updatedCharacteristics);
    },
    [findCharacteristic, orderedCharacteristics, selectedCharacteristics]
  );

  const updateCharacteristicsOrder = (newSelected) => {
    const selectedChars = orderedCharacteristics.filter(char => 
      newSelected.includes(char.name)
    );
    const unselectedChars = orderedCharacteristics.filter(char => 
      !newSelected.includes(char.name)
    );
    
    const orderedSelectedChars = newSelected.map(name => 
      selectedChars.find(char => char.name === name)
    ).filter(Boolean);
    
    const newOrdered = [...orderedSelectedChars, ...unselectedChars];
    
    const updatedOrder = newOrdered.map((char, index) => ({
      ...char,
      costWeight:
        char.costWeight > 0
          ? getCostWeight(
              char.name,
              newOrdered.length,
              index,
              newSelected,
              char.manualWeight
            )
          : 1,
    }));
    
    setOrderedCharacteristics(updatedOrder);
  };

  if (newProducts.length === 1) {
    return <div style={{ padding: 20 }}>
        <h2>Вы не можете сравнить единственный товар</h2>
        <p>Вернитесь на главную страницу и добавьте товары для сравнения.</p>
    </div>
  }

  if (isLoading || isFetching) {
    return <LoadingBackdrop open={(isLoading || isFetching)} />;
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Ошибка загрузки данных</h2>
        <p>Произошла ошибка при загрузке данных для сравнения.</p>
      </div>
    );
  }

  if (!sProductsInfo || sProductsInfo.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Нет данных для отображения</h2>
        <p>Вернитесь на главную страницу и добавьте товары для сравнения.</p>
      </div>
    );
  }

  const firstColumnWidth = "200px";
  const productColumnWidth = "200px";

  const handleToggleSelect = (event, name) => {
    const selectedIndex = selectedCharacteristics.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedCharacteristics, name];
    } else {
      newSelected = selectedCharacteristics.filter(item => item !== name);
    }
    
    setSelectedCharacteristics(newSelected);
    updateCharacteristicsOrder(newSelected);
  };

  const isSelected = (name) => selectedCharacteristics.indexOf(name) !== -1;

  const handleWeightChange = (event, characteristicName) => {
    const charIndex = orderedCharacteristics.findIndex(char => char.name === characteristicName);
    if (charIndex === -1) return;
    
    let newValue = parseFloat(event.target.value);
    if (isNaN(newValue))
      newValue = 0;
    
    if (newValue > 1) newValue = 1;
    if (newValue < 0) newValue = 0;

    const updatedCharacteristics = [...orderedCharacteristics];
    
    updatedCharacteristics[charIndex] = {
      ...updatedCharacteristics[charIndex],
      costWeight: getCostWeight(
        updatedCharacteristics[charIndex].name,
        updatedCharacteristics.length,
        charIndex,
        selectedCharacteristics,
        newValue
      ),
      manualWeight: newValue,
    };
    
    setOrderedCharacteristics(updatedCharacteristics);
  };

  return (
    <>
      {(isLoading && !sProductsInfo) ?? <div>Loading...</div>
      }
      <Box 
        component="nav"
        sx={{
          height: '76px',
          position: 'relative',
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingLeft: '15px',
          backgroundColor: 'background.paper',
        }}
      >
        <SwitchTheme />
      </Box>
      <Box sx={{ padding: 2 }}>
        <TableContainer component={Paper}>
          <Table
            sx={{width: "100%", overflowX : 'auto'}}
            aria-label="comparison table"
          >
            <TableHeader
              firstColumnWidth={firstColumnWidth}
              productColumnWidth={productColumnWidth}
              productsInfo={sProductsInfo}
            />
            <tbody>
              <ImagesRow productsInfo={sProductsInfo} />
              <PriceRow productsInfo={sProductsInfo} />
              <RatingRow productsInfo={sProductsInfo} />
              <AvailabilityRow productsInfo={sProductsInfo} />

              <CharacteristicsHeader
                characteristicsExpanded={characteristicsExpanded}
                toggleExpanded={() => setCharacteristicsExpanded(!characteristicsExpanded)}
              />

              {orderedCharacteristics.map((characteristic) => (
                <CharacteristicRow
                  key={characteristic.name}
                  characteristic={characteristic}
                  firstColumnWidth={firstColumnWidth}
                  productColumnWidth={productColumnWidth}
                  findCharacteristic={findCharacteristic}
                  moveCharacteristic={moveCharacteristic}
                  isSelected={isSelected(characteristic.name)}
                  onToggleSelect={handleToggleSelect}
                  onWeightChange={handleWeightChange}
                  characteristicsExpanded={characteristicsExpanded}
                  onToggleBestFlag={handleToggleBestFlag}
                />
              ))}

              {orderedCharacteristics.length === 0 && (
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    <strong>Общие характеристики</strong>
                  </StyledTableCell>
                  {sProductsInfo.map((product, index) => (
                    <StyledTableCell key={index} align="center">
                      <em style={{ color: "#6b7280" }}>
                        Нет общих характеристик для сравнения
                      </em>
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              )}

              <AdditionalInfoRows productsInfo={sProductsInfo} rankItems={rankItems} />
            </tbody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ padding: 2, height: '50%', width: '50%', margin: '0 auto',display: "flex", justifyContent : 'center' }}>
        <Button variant="contained" onClick={() => onReload()}>Пересравнить</Button>
      </Box>
      <Box sx={{ padding: 2, height: '50%', width: '50%', margin: '0 auto'}}>
        {/* <Swiper
          spaceBetween={50}
          slidesPerView={1}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {chartRadialData.map((x, index) => (
            <SwiperSlide key={index}>
              <Radar data={x} options={options} />
            </SwiperSlide>
          ))}
        </Swiper>  */}
      </Box>
    </>
  );
}

export default function ProductTable() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ProductTableContent />
    </DndProvider>
  );
}