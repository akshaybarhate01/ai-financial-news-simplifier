import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useTranslation } from '../../hooks/useTranslation';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SectorChartProps {
  labels: string[];
  values: number[];
}

export const SectorChart: React.FC<SectorChartProps> = ({ labels, values }) => {
  const { t } = useTranslation();

  const data = {
    labels: labels.length ? labels : ['Macro', 'Equities', 'Bonds', 'Commodities'],
    datasets: [
      {
        data: values.length ? values : [35, 45, 12, 8],
        backgroundColor: [
          '#0891B2', // Cyan
          '#0B192C', // Deep navy
          '#64748B', // Slate
          '#10B981', // Emerald
          '#F59E0B', // Amber
          '#6366F1', // Indigo
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 12,
          padding: 14,
          font: {
            size: 11,
            family: 'Inter, sans-serif',
          },
        },
      },
      tooltip: {
        backgroundColor: '#0B192C',
        titleFont: { family: 'Inter', size: 12 },
        bodyFont: { family: 'Inter', size: 11 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="fintech-card p-5 h-[340px] flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-fintech-navy-900 dark:text-white">
          {t('sector_dist')}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('sector_dist_sub')}
        </p>
      </div>

      <div className="relative flex-1 py-2">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};
