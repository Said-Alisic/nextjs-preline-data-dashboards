"use client";

import { FC, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartProps {
  categories: string[];
  series: { name: string; data: number[] }[];
  shouldCompare: boolean;
  title?: string;
  customLegendItems?: string[];
}

const AreaChart: FC<ChartProps> = ({
  categories,
  series,
  shouldCompare,
  title,
  customLegendItems,
}) => {
  const [isToolTipShared, setIsToolTipShared] = useState(true);
  const [hiddenSeriesIndexes, setHiddenSeriesIndexes] = useState<number[]>([]);

  const arrowTrendingUpIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#1fdb6d" class="size-5">
                                   <path fill-rule="evenodd" d="M12.577 4.878a.75.75 0 0 1 .919-.53l4.78 1.281a.75.75 0 0 1 .531.919l-1.281 4.78a.75.75 0 0 1-1.449-.387l.81-3.022a19.407 19.407 0 0 0-5.594 5.203.75.75 0 0 1-1.139.093L7 10.06l-4.72 4.72a.75.75 0 0 1-1.06-1.061l5.25-5.25a.75.75 0 0 1 1.06 0l3.074 3.073a20.923 20.923 0 0 1 5.545-4.931l-3.042-.815a.75.75 0 0 1-.53-.919Z" clip-rule="evenodd" />
                                 </svg>`;

  const arrowTrendingDownIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#ff0033" class="size-5">
                           <path fill-rule="evenodd" d="M1.22 5.222a.75.75 0 0 1 1.06 0L7 9.942l3.768-3.769a.75.75 0 0 1 1.113.058 20.908 20.908 0 0 1 3.813 7.254l1.574-2.727a.75.75 0 0 1 1.3.75l-2.475 4.286a.75.75 0 0 1-1.025.275l-4.287-2.475a.75.75 0 0 1 .75-1.3l2.71 1.565a19.422 19.422 0 0 0-3.013-6.024L7.53 11.533a.75.75 0 0 1-1.06 0l-5.25-5.25a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                         </svg>`;

  const options: ApexOptions = {
    colors: ["#1924fa", "#000000", "#8e95e8"],
    chart: {
      id: "area-chart",
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      events: {
        legendClick: (chartContext, seriesIndex, config) => {
          // Check if seriesIndex is defined
          if (seriesIndex !== undefined) {
            // Check if the index already exists in the hidden array
            if (hiddenSeriesIndexes.includes(seriesIndex)) {
              // If it exists, remove it (series will be shown)
              setHiddenSeriesIndexes(
                hiddenSeriesIndexes.filter((index) => index !== seriesIndex)
              );
            } else {
              // If it doesn't exist, add it (series will be hidden)
              setHiddenSeriesIndexes([...hiddenSeriesIndexes, seriesIndex]);
            }
          }

          setIsToolTipShared(!isToolTipShared);
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    // title: {
    //   text: title,
    //   align: "left",
    //   offsetX: 30,
    //   offsetY: -5,
    //   style: { fontSize: "16px", fontWeight: 600, color: "#1924fa" },
    // },
    legend: {
      show: shouldCompare,
      position: "top",
      horizontalAlign: "right",
      offsetY: -20,
      onItemClick: {
        toggleDataSeries: shouldCompare,
      },
    },
    grid: {
      strokeDashArray: 0,
      borderColor: "#e5e7eb",
      padding: { top: -20, right: 0 },
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "#9ca3af", fontSize: "13px", fontWeight: 400 },
        formatter(value, timestamp, opts) {
          if (!value) return value;
          const newT = value.split(" ");
          return `${newT[0].slice(0, 3)}`;
        },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#9ca3af", fontSize: "12px", fontWeight: 400 },
        formatter: (value) =>
          value >= 100 ? `${value / 100}k` : value.toString(),
      },
    },
    tooltip: {
      shared: isToolTipShared,
      intersect: false,
      custom: ({ series, dataPointIndex, w }) => {
        const tooltipTitle = title;

        if (series.length > 1 && shouldCompare && isToolTipShared) {
          // Extract the relevant values for comparison
          const currentYearValue = series[0][dataPointIndex] || 0;
          const previousYearValue = series[1][dataPointIndex] || 0;

          // Calculate percentage change (avoid division by zero)
          let percentageChange = previousYearValue
            ? ((currentYearValue - previousYearValue) / previousYearValue) * 100
            : currentYearValue > 0
            ? 100 // If previous year was 0 but current year is positive, assume 100% increase
            : 0;

          const formattedPercentage = `${percentageChange.toFixed(1)}%`;

          // Select the correct trending arrow based on percentage change
          const trendingIcon =
            percentageChange > 0
              ? `<span class="text-green-600">${arrowTrendingUpIcon}</span>`
              : percentageChange < 0
              ? `<span class="text-red-600">${arrowTrendingDownIcon}</span>`
              : `<span class="text-gray-600">—</span>`;

          let seriesHtml = "";

          w.config.series.forEach((s: any, seriesIdx: number) => {
            if (hiddenSeriesIndexes.includes(seriesIdx)) return;

            const color = w.globals.colors[seriesIdx];
            const val = series[seriesIdx][dataPointIndex] || 0;

            seriesHtml += `
            <div class="flex items-center pb-2 gap-6">
              <div style="width: 10px; height: 10px; background: ${color}; display: inline-block; margin-right: 8px; border-radius: 5px;"></div>
              <span class="font-semibold text-gray-900">$${val.toLocaleString()}</span>
              <span class="text-gray-700">${s.name}</span>
            </div>
          `;
          });

          return `
          <div class="p-3 bg-white border border-gray-200 shadow-md rounded-md">
            <div class="flex justify-between text-sm font-semibold mb-2  gap-4">
              <span>${tooltipTitle}</span>
              <div class="flex items-end gap-2">
                ${trendingIcon}
                <span>${formattedPercentage}</span>
              </div>
            </div>
            ${seriesHtml}
          </div>`;
        } else {
          let seriesIndex = 0;

          if (hiddenSeriesIndexes.includes(0)) seriesIndex = 1;
          else if (hiddenSeriesIndexes.includes(1)) seriesIndex = 0;

          const singleSeries = w.config.series[seriesIndex];
          const singleValue = series[seriesIndex][dataPointIndex] || 0;
          const singleColor = w.globals.colors[seriesIndex];

          const seriesHtml = `
            <div class="flex items-center pb-2 gap-4">
              <div style="width: 10px; height: 10px; background: ${singleColor}; display: inline-block; margin-right: 8px; border-radius: 5px;"></div>
              <span class="font-semibold text-gray-900">$${singleValue.toLocaleString()}</span>
              <span class="text-gray-700">${singleSeries.name}</span>
            </div>
          `;

          return `
            <div class="p-3 bg-white border border-gray-200 shadow-md rounded-md">
              <div class="flex justify-between text-sm font-semibold">
                <span>${tooltipTitle}</span>
              </div>
              ${seriesHtml}
            </div>`;
        }
      },
    },
  };

  return <Chart options={options} series={series} type="area" height={300} />;
};

export default AreaChart;
