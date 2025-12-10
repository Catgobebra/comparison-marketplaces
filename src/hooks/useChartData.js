function useChartData(productsInfo,orderedCharacteristics) {
  const chartRadialData = productsInfo?.map((element, index) => {
    return {
      labels: orderedCharacteristics.slice(0, 5).map((x) => x.name),
      datasets: [
        {
          label: "Значение",
          data: orderedCharacteristics
            .slice(0, 5)
            .map((x) => x.isBestFlags[index]),
          fill: true,
          borderWidth: 1,
        },
      ],
    };
  });

  const chartData = {
    labels: productsInfo
      ? productsInfo.map(
          (product) => product.productName?.substring(0, 50) || "Без названия"
        )
      : [],
    datasets: [
      {
        label: "Цена",
        fill: true,
        data: productsInfo
          ? productsInfo.map((product) => getPriceInfo(product).min)
          : [],
      },
    ],
  };
  return {
    chartData,
    chartRadialData
  }
}

export default useChartData;
