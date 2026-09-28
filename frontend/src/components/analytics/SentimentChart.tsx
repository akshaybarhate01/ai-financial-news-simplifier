import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from '../../hooks/useTranslation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface SentimentChartProps {
  bullish: number;
  neutral: number;
  bearish: number;
}

export const SentimentChart: React.FC<SentimentChartProps> = ({
  bullish,
  neutral,
  bearish,
}) => {
  const { t } = useTranslation();

  const data = {
    labels: ['Bullish', 'Neutral', 'Bearish'],
    datasets: [
      {
        label: 'Articles Analyzed',
        data: [bullish || 14, neutral || 8, bearish || 4],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // Emerald
          'rgba(148, 163, 184, 0.85)', // Slate
          'rgba(239, 68, 68, 0.85)', // Rose
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0B192C',
        titleFont: { family: 'Inter', size: 12 },
        bodyFont: { family: 'Inter', size: 11 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
        ticks: { font: { family: 'Inter', size: 11 }, stepSize: 2 },
      },
    },
  };

  return (
    <div className="fintech-card p-5 h-[340px] flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-fintech-navy-900 dark:text-white">
          {t('sentiment_dist_title')}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('sentiment_dist_sub')}
        </p>
      </div>

      <div className="relative flex-1 py-2">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
