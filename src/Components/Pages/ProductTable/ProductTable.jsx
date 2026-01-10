/* global chrome */
import React from "react";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import TableHeader from "../../Dummies/TableHeader/TableHeader";
import ImagesRow from "../../Dummies/ImagesRow/ImagesRow";
import PriceRow from "../../Dummies/PriceRow/PriceRow";
import RatingRow from "../../Dummies/RatingRow/RatingRow";
import AvailabilityRow from "../../Dummies/AvailabilityRow/AvailabilityRow";
import CharacteristicsHeader from "../../Dummies/CharacteristicsHeader/CharacteristicsHeader";
import CharacteristicRow from "../../Dummies/CharacteristicRow/CharacteristicRow";
import AdditionalInfoRows from "../../Dummies/AdditionalInfoRows/AdditionalInfoRows";
import LineDiagramForTable from "../../Dummies/LineDiagramForTable/LineDiagramForTable";
import RadialDiagramForTable from "../../Dummies/RadialDiagramForTable.jsx/RadialDiagramForTable";

import SwitchTheme from "../../UI/SwitchTheme/SwitchTheme";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.css";

import { useColorScheme } from "@mui/material/styles";

import { StyledTableRow, StyledTableCell } from "../../UI/StyledComponents/StyledComponents";
import LoadingBackdrop from "../../UI/LoadingBackdrop/LoadingBackdrop";

import { useProductComparison } from "../../../Hooks/useProductComparison";
import { useCharacteristics } from "../../../Hooks/useCharacteristics";
import { useComparisonLogic } from "../../../Hooks/useComparisonLogic";
import { useChartData } from "../../../Hooks/useChartData";

function ProductTableContent() {
  const { sProductsInfo, isLoading, error, onReload, isFetching, newProducts,data } =
    useProductComparison();

  const {
    characteristicsExpanded,
    orderedCharacteristics,
    selectedCharacteristics,
    rankItems,
    setCharacteristicsExpanded,
    resetCharacteristics,
    findCharacteristic,
    moveCharacteristic,
    setOrderedCharacteristics,
    setSelectedCharacteristics,
  } = useCharacteristics(sProductsInfo);

  const comparisonLogic = useComparisonLogic(
    orderedCharacteristics,
    setOrderedCharacteristics,
    selectedCharacteristics,
    setSelectedCharacteristics
  );
  const {
    handleToggleBestFlag,
    handleToggleSelect,
    handleWeightChange,
    isSelected,
  } = comparisonLogic;

  const { chartData, chartRadialData } = useChartData(
    sProductsInfo || [],
    orderedCharacteristics || []
  );
  console.log(chartData,chartRadialData)


  const handleReload = async () => {
    await onReload(resetCharacteristics);
  };

  const { mode, setMode } = useColorScheme();

  const firstColumnWidth = "200px";
  const productColumnWidth = "200px";

  if (newProducts.length === 1) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Вы не можете сравнить единственный товар</h2>
        <p>Вернитесь на главную страницу и добавьте товары для сравнения.</p>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return <LoadingBackdrop open={isLoading || isFetching} />;
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

  return (
    <>
      {(isLoading && !sProductsInfo) ?? <div>Loading...</div>}
      <Box
        component="nav"
        sx={{
          height: "76px",
          position: "relative",
          boxShadow: "0 1px 2px 0 rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingLeft: "15px",
          backgroundColor: "background.paper",
        }}
      >
        <SwitchTheme />
      </Box>
      <Box sx={{ padding: 2 }}>
        <TableContainer component={Paper}>
          <Table
            sx={{ width: "100%", overflowX: "auto" }}
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
                toggleExpanded={() =>
                  setCharacteristicsExpanded(!characteristicsExpanded)
                }
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

              <AdditionalInfoRows
                productsInfo={sProductsInfo}
                rankItems={rankItems}
              />
            </tbody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        sx={{
          padding: 2,
          height: "50%",
          width: "50%",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button variant="contained" onClick={() => handleReload()}>
          Пересравнить
        </Button>
      </Box>
      <Box sx={{ padding: 2, height: "50%", width: "50%", margin: "0 auto" }}>
       <LineDiagramForTable chartData={chartData} mode={mode} />
       <Swiper
          spaceBetween={50}
          slidesPerView={1}
          observer={true}
          observeParents={true}
          observeSlideChildren={true}
          style={{width: '100%',
          height: '60vh'}}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {chartRadialData.map((x, index) => (
            <SwiperSlide key={index} style={{ height: '100%' }}>
              <RadialDiagramForTable chartData={x} mode={mode} />
            </SwiperSlide>
          ))}
        </Swiper>
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
