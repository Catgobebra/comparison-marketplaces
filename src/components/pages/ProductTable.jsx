/* global chrome */
import React from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { changeCompareProducts } from "../../redux-state/reducers/compareProduct";
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

import useProducts from "../../hooks/useProducts";

import LoadingProgressBar from "../comps/LoadingProgressBar";


import { Bar } from 'react-chartjs-2';
import { Radar } from 'react-chartjs-2';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.css'

import {
  Chart as ChartJS,
  CategoryScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors 
} from 'chart.js';

import { getCostWeight } from "../../utils/tableLogic";
import { StyledTableRow, StyledTableCell } from "../comps/styledComponents";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
Title,
Tooltip,
Legend,
Colors,
RadialLinearScale,
PointElement,
LineElement
);

function ProductTableContent() {
  const dispatch = useDispatch();
  const productsInfo = useSelector((state) => state.compareProducts.compare_products); 
  const originalProducts = useSelector((state) => state.products.products);

  const { doCompare, loading } = useProducts();

  const [characteristicsExpanded, setCharacteristicsExpanded] = React.useState(true);
  const [orderedCharacteristics, setOrderedCharacteristics] = React.useState([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = React.useState([]);
  const [rankItems, setRankItems] = React.useState([]);

  console.log(orderedCharacteristics)
  console.log(selectedCharacteristics)
  console.log(productsInfo)
  console.log(orderedCharacteristics.slice(0,5).map(x => x.isBestFlags[0]))

  const chartRadialData = []
  for (let i = 0; i < productsInfo.length; i++) {
  chartRadialData.push(
    {
  labels: orderedCharacteristics.slice(0,5).map(x => x.name),
  datasets: [
    {
      label: 'Значение',
      data: orderedCharacteristics.slice(0,5).map(x => x.isBestFlags[i]),
      borderWidth: 1,
    },
  ],
}
  )
  }
  console.log(chartRadialData)

 const chartData = {
  labels: productsInfo.map(product => product.productName?.substring(0, 50) || 'Без названия'), 
  datasets: [
    {
      label: 'Цена',
      data: productsInfo.map(product => product.originalPrice)
    }
  ]
  };

  const options = {
    plugins: {
      colors: {
        forceOverride: true
      }
    }
  };
  

  React.useEffect(() => {
    chrome.storage.local.get(["myStoredCompareArray"]).then((result) => {
      if (result.myStoredCompareArray && result.myStoredCompareArray.length > 0) {
        dispatch(changeCompareProducts(result.myStoredCompareArray));
      } else if (originalProducts && originalProducts.length > 0) {
        console.log("Нет результатов сравнения. Выполните сравнение товаров.");
      }
    });
  }, [dispatch, originalProducts]);

  React.useEffect(() => {
    const performComparison = async () => {
      if (productsInfo && productsInfo.length > 0) {
        console.log(productsInfo)
        return;
      }

      if (originalProducts && originalProducts.length > 0) {
        try {
          await doCompare();
        } catch (error) {
          console.error("Comparison failed:", error);
        }
      }
    };

    performComparison();
  }, [doCompare, originalProducts,productsInfo]);


  React.useEffect(() => {
  if (!orderedCharacteristics || !productsInfo || productsInfo.length === 0)
    return;
  
  const rank = new Array(productsInfo.length).fill(0);

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
  }, [orderedCharacteristics, productsInfo]);

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

  const getCommonCharacteristics = React.useCallback(() => {
    if (!productsInfo || productsInfo.length === 0) return [];
    const allCharacteristics = [];
    const characteristicNames = new Set();
    productsInfo.forEach((product, index) => {
      const productChars = getProductCharacteristics(product);
      allCharacteristics[index] = productChars;
      productChars.forEach((char) => characteristicNames.add(char.name));
    });
    const commonCharNames = Array.from(characteristicNames).filter((charName) =>
      productsInfo.every((_, index) =>
        allCharacteristics[index].some((char) => char.name === charName)
      )
    );
    return commonCharNames.map((charName, index_) => {
      const values = [];
      const isBestFlags = [];
      productsInfo.forEach((_, index) => {
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
          : 0,
      };
    });
  }, [productsInfo, selectedCharacteristics]);

  const commonCharacteristics = getCommonCharacteristics();

  React.useEffect(() => {
    if (commonCharacteristics.length > 0 && orderedCharacteristics.length === 0) {
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
      setOrderedCharacteristics(
        [
    ...characteristicsWithWeights.filter(item => item.isBestFlags.some(x => x)),
    ...characteristicsWithWeights.filter(item => !item.isBestFlags.some(x => x))
      ]);
    }
  }, [commonCharacteristics, orderedCharacteristics.length, selectedCharacteristics]);

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
          : 0,
    }));
    
    setOrderedCharacteristics(updatedOrder);
  };

  if (!productsInfo || productsInfo.length === 0)
    return (
      <div style={{ padding: 20 }}>
        <h2>Нет данных для отображения</h2>
        <p>Вернитесь на главную страницу и добавьте товары для сравнения.</p>
      </div>
    );

  const firstColumnWidth = "30%";
  const productColumnWidth = `${70 / productsInfo.length}%`;

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
    <Box sx={{ padding: 2 }}>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 700, tableLayout: "fixed", width: "100%" }}
          aria-label="comparison table"
        >
          <TableHeader
            firstColumnWidth={firstColumnWidth}
            productColumnWidth={productColumnWidth}
            productsInfo={productsInfo}
          />
          <tbody>
            <ImagesRow productsInfo={productsInfo} />
            <PriceRow productsInfo={productsInfo} />
            <RatingRow productsInfo={productsInfo} />
            <AvailabilityRow productsInfo={productsInfo} />

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
              />
            ))}

            {orderedCharacteristics.length === 0 && (
              <StyledTableRow>
                <StyledTableCell component="th" scope="row">
                  <strong>Общие характеристики</strong>
                </StyledTableCell>
                {productsInfo.map((product, index) => (
                  <StyledTableCell key={index} align="center">
                    <em style={{ color: "#6b7280" }}>
                      Нет общих характеристик для сравнения
                    </em>
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            )}

            <AdditionalInfoRows productsInfo={productsInfo} rankItems={rankItems} />
          </tbody>
        </Table>
      </TableContainer>
    </Box>
    <Box sx={{ padding: 2, height: '50%', width: '50%', margin : '0 auto'}}>
      <Bar data={chartData} options={options} />
      <Swiper
      spaceBetween={50}
      slidesPerView={1}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
      >
      {chartRadialData.map(x =><SwiperSlide><Radar data={x} options={options} /></SwiperSlide>)}
      </Swiper>
    </Box>
    <LoadingProgressBar open={loading} />
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