import { getPriceInfo } from "../Utils/tableLogic";

export function useChartData(productsInfo,orderedCharacteristics) {
  console.log(productsInfo)
  const chartRadialData = productsInfo?.map((element, index) => {
    return {
      labels: orderedCharacteristics?.slice(0, 5)?.map((x) => x?.name) || [],
      datasets: [
        {
          label: "Значение",
          data: orderedCharacteristics?.slice(0, 5)?.map((x) => x?.isBestFlags?.[index] || 0) || [],
          fill: true,
          borderWidth: 1,
        },
      ],
    };
  }) || [];

  const chartData = {
    labels: productsInfo?.map(
      (product) => `${product?.productName?.substring(0, 30)}...` || "Без названия"
    ) || [],
    datasets: [
      {
        label: "Цена",
        fill: true,
        data: productsInfo?.map((product) => {
          const priceInfo = getPriceInfo(product);
          return priceInfo?.min || 0;
        }) || [],
      },
    ],
  };
  
  return {
    chartData,
    chartRadialData
  };
}