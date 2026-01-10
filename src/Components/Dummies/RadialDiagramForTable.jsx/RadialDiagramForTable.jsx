import {Radar } from 'react-chartjs-2';

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

function RadialDiagramForTable({chartData,mode}) {
    const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 1,
        grid: {
          color: mode === 'light' ? "#263238" :"#eceff1"
        },
        angleLines: {
          color: mode === 'light' ? "#263238" :"#eceff1"
        }
      }
    }
  }
  return (<Radar data={chartData} options={options} />)
}

export default RadialDiagramForTable