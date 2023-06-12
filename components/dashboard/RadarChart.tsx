/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { TStockOut } from '@/lib/types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

import Loading from '../Loading';

const categories = [
  'ATK',
  'Kebersihan',
  'Lain',
  'Komputer',
  'Obat',
  'Kendaraan',
];
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];
const borderColors = [
  '#006666',
  '#4d4dff',
  '#ff3333',
  '#ffa500',
  '#008000',
  '#883dbd',
  '#006666',
  '#4d4dff',
  '#ff3333',
  '#ffa500',
  '#008000',
  '#883dbd',
];
const colors = [
  '#00666640',
  '#4d4dff40',
  '#ff333340',
  '#ffa50040',
  '#00800040',
  '#883dbd40',
  '#00666640',
  '#4d4dff40',
  '#ff333340',
  '#ffa50040',
  '#00800040',
  '#883dbd40',
];

const options = {
  plugins: {
    responsive: true,

    legend: {
      display: false,
    },
  },
};

type Props = {
  stocks?: TStockOut[];
};

const RadarChart = ({ stocks }: Props): JSX.Element => {
  const [janData, setJanData] = useState(
    Array(...Array(6)).map(Number.prototype.valueOf, 0),
  );
  const [febData, setFebData] = useState(
    Array(...Array(6)).map(Number.prototype.valueOf, 0),
  );
  const [marData, setMarData] = useState(
    Array(...Array(6)).map(Number.prototype.valueOf, 0),
  );
  const [aprData, setAprData] = useState(
    Array(...Array(6)).map(Number.prototype.valueOf, 0),
  );
  const [meiData, setMeiData] = useState(
    Array(...Array(6)).map(Number.prototype.valueOf, 0),
  );
  const [junData, setJunData] = useState(
    Array(...Array(6)).map(Number.prototype.valueOf, 0),
  );
  const [julData, setJulData] = useState(
    Array(...Array(6)).map(Number.prototype.valueOf, 0),
  );
  const [aguData, setAguData] = useState(
    Array(...Array(6)).map(Number.prototype.valueOf, 0),
  );
  const [sepData, setSepData] = useState(
    Array(...Array(6)).map(Number.prototype.valueOf, 0),
  );
  const [oktData, setOktData] = useState(
    Array(...Array(6)).map(Number.prototype.valueOf, 0),
  );
  const [novData, setNovData] = useState(
    Array(...Array(6)).map(Number.prototype.valueOf, 0),
  );
  const [desData, setDesData] = useState(
    Array(...Array(6)).map(Number.prototype.valueOf, 0),
  );
  const [loading, setLoading] = useState(true);

  const mainData = {
    labels: categories,
    datasets: [
      {
        fill: true,
        label: months[0],
        data: janData,
        backgroundColor: colors[0],
        borderColor: borderColors[0],
        borderWidth: 1,
      },
      {
        fill: true,
        label: months[1],
        data: febData,
        backgroundColor: colors[1],
        borderColor: borderColors[1],
        borderWidth: 1,
      },
      {
        fill: true,
        label: months[2],
        data: marData,
        backgroundColor: colors[2],
        borderColor: borderColors[2],
        borderWidth: 1,
      },
      {
        fill: true,
        label: months[3],
        data: aprData,
        backgroundColor: colors[3],
        borderColor: borderColors[3],
        borderWidth: 1,
      },
      {
        fill: true,
        label: months[4],
        data: meiData,
        backgroundColor: colors[4],
        borderColor: borderColors[4],
        borderWidth: 1,
      },
      {
        fill: true,
        label: months[5],
        data: junData,
        backgroundColor: colors[5],
        borderColor: borderColors[5],
        borderWidth: 1,
      },
      {
        fill: true,
        label: months[6],
        data: julData,
        backgroundColor: colors[6],
        borderColor: borderColors[6],
        borderWidth: 1,
      },
      {
        fill: true,
        label: months[7],
        data: aguData,
        backgroundColor: colors[7],
        borderColor: borderColors[7],
        borderWidth: 1,
      },
      {
        fill: true,
        label: months[8],
        data: sepData,
        backgroundColor: colors[8],
        borderColor: borderColors[8],
        borderWidth: 1,
      },
      {
        fill: true,
        label: months[9],
        data: oktData,
        backgroundColor: colors[9],
        borderColor: borderColors[9],
        borderWidth: 1,
      },
      {
        fill: true,
        label: months[10],
        data: novData,
        backgroundColor: colors[10],
        borderColor: borderColors[10],
        borderWidth: 1,
      },
      {
        fill: true,
        label: months[11],
        data: desData,
        backgroundColor: colors[11],
        borderColor: borderColors[11],
        borderWidth: 1,
      },
    ],
  };

  const jan = Array(...Array(6)).map(Number.prototype.valueOf, 0);
  const feb = Array(...Array(6)).map(Number.prototype.valueOf, 0);
  const mar = Array(...Array(6)).map(Number.prototype.valueOf, 0);
  const apr = Array(...Array(6)).map(Number.prototype.valueOf, 0);
  const mei = Array(...Array(6)).map(Number.prototype.valueOf, 0);
  const jun = Array(...Array(6)).map(Number.prototype.valueOf, 0);
  const jul = Array(...Array(6)).map(Number.prototype.valueOf, 0);
  const agu = Array(...Array(6)).map(Number.prototype.valueOf, 0);
  const sep = Array(...Array(6)).map(Number.prototype.valueOf, 0);
  const okt = Array(...Array(6)).map(Number.prototype.valueOf, 0);
  const nov = Array(...Array(6)).map(Number.prototype.valueOf, 0);
  const des = Array(...Array(6)).map(Number.prototype.valueOf, 0);

  const setStateData = useCallback(
    (indexOfCategory: number, month: string, genuineQuantity: number) => {
      switch (month) {
        case 'Jan':
          if (jan[indexOfCategory] !== 0) {
            jan[indexOfCategory] += genuineQuantity;
            setJanData(jan);
          } else {
            jan[indexOfCategory] = genuineQuantity;
            setJanData(jan);
          }
          break;
        case 'Feb':
          if (feb[indexOfCategory] !== 0) {
            feb[indexOfCategory] += genuineQuantity;
            setFebData(feb);
          } else {
            feb[indexOfCategory] = genuineQuantity;
            setFebData(feb);
          }
          break;
        case 'Mar':
          if (mar[indexOfCategory] !== 0) {
            mar[indexOfCategory] += genuineQuantity;
            setMarData(mar);
          } else {
            mar[indexOfCategory] = genuineQuantity;
            setMarData(mar);
          }
          break;
        case 'Apr':
          if (apr[indexOfCategory] !== 0) {
            apr[indexOfCategory] += genuineQuantity;
            setAprData(apr);
          } else {
            apr[indexOfCategory] = genuineQuantity;
            setAprData(apr);
          }
          break;
        case 'Mei':
          if (mei[indexOfCategory] !== 0) {
            mei[indexOfCategory] += genuineQuantity;
            setMeiData(mei);
          } else {
            mei[indexOfCategory] = genuineQuantity;
            setMeiData(mei);
          }
          break;
        case 'Jun':
          if (jun[indexOfCategory] !== 0) {
            jun[indexOfCategory] += genuineQuantity;
            setJunData(jun);
          } else {
            jun[indexOfCategory] = genuineQuantity;
            setJunData(jun);
          }
          break;
        case 'Jul':
          if (jul[indexOfCategory] !== 0) {
            jul[indexOfCategory] += genuineQuantity;
            setJulData(jul);
          } else {
            jul[indexOfCategory] = genuineQuantity;
            setJulData(jul);
          }
          break;
        case 'Agu':
          if (agu[indexOfCategory] !== 0) {
            agu[indexOfCategory] += genuineQuantity;
            setAguData(agu);
          } else {
            agu[indexOfCategory] = genuineQuantity;
            setAguData(agu);
          }
          break;
        case 'Sep':
          if (sep[indexOfCategory] !== 0) {
            sep[indexOfCategory] += genuineQuantity;
            setSepData(sep);
          } else {
            sep[indexOfCategory] = genuineQuantity;
            setSepData(sep);
          }
          break;
        case 'Okt':
          if (okt[indexOfCategory] !== 0) {
            okt[indexOfCategory] += genuineQuantity;
            setOktData(okt);
          } else {
            okt[indexOfCategory] = genuineQuantity;
            setOktData(okt);
          }
          break;
        case 'Nov':
          if (nov[indexOfCategory] !== 0) {
            nov[indexOfCategory] += genuineQuantity;
            setNovData(nov);
          } else {
            nov[indexOfCategory] = genuineQuantity;
            setNovData(nov);
          }
          break;
        case 'Des':
          if (des[indexOfCategory] !== 0) {
            des[indexOfCategory] += genuineQuantity;
            setDesData(des);
          } else {
            des[indexOfCategory] = genuineQuantity;
            setDesData(des);
          }
          break;
        default:
          break;
      }
    },
    [],
  );
  const getCategoryName = (category: any) => {
    let categoryName: string;
    switch (category) {
      case 'alat tulis kantor':
        categoryName = 'ATK';
        break;
      case 'alat kebersihan':
        categoryName = 'Kebersihan';
        break;
      case 'alat kendaraan':
        categoryName = 'Kendaraan';
        break;
      case 'alat komputer':
        categoryName = 'Komputer';
        break;
      case 'obat obatan':
        categoryName = 'Obat';
        break;
      default:
        categoryName = 'Lain';
        break;
    }
    return categoryName;
  };

  const setChart = useCallback(() => {
    stocks?.forEach((stock) => {
      const { genuineQuantity, createdAt, category } = stock;
      const date = new Date(createdAt);
      const getMonth = months[date.getMonth()];
      const getCategory = getCategoryName(category);

      const indexOfCategory = categories.findIndex(
        (cat) => cat === getCategory,
      );
      setStateData(indexOfCategory, getMonth, genuineQuantity);
    });
  }, [stocks, setStateData]);

  useEffect(() => {
    if (!stocks) {
      setLoading(true);
    } else {
      setChart();
      setLoading(false);
    }
  }, [stocks, setChart]);

  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <div>
        {loading ? <Loading /> : <Radar data={mainData} options={options} />}
      </div>
    </Box>
  );
};

export default RadarChart;
