import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTranslation } from '../../hooks/useTranslation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface WeeklyVolumeChartProps {
  days: string[];
  articlesRead: number[];
}

export const WeeklyVolumeChart: React.FC<WeeklyVolumeChartProps> = ({
  days,
  articlesRead,
}) => {
  const { t } = useTranslation();

  const data = {
    labels: days.length ? days : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Intelligence Briefs Read',
        data: articlesRead.length ? articlesRead : [4, 7, 5, 8, 11, 6, 9],
        borderColor: '#0891B2',
        backgroundColor: 'rgba(8, 145, 178, 0.08)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#0891B2',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
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
        ticks: { font: { family: 'Inter', size: 11 } },
      },
    },
  };

  return (
    <div className="fintech-card p-5 h-[340px] flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-fintech-navy-900 dark:text-white">
          {t('weekly_engagement_title')}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('weekly_engagement_sub')}
        </p>
      </div>

      <div className="relative flex-1 py-2">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};
