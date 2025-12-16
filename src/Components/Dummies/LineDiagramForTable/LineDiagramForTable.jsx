import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";

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
  LineElement,
  Filler
);

function LineDiagramForTable({chartData, mode}) {
   const optionsDiagram = {
    scales: {
      x: {
        grid: {
          color: mode === "light" ? "#263238" : "#eceff1",
        },
      },
      y: {
        grid: {
          color: mode === "light" ? "#263238" : "#eceff1",
        },
      },
    },
  };
  return (<Bar data={chartData}  options={optionsDiagram}  />);
}

export default LineDiagramForTable;
