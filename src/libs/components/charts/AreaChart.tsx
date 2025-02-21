"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartProps {
  title: string;
  categories: string[];
  series: { name: string; data: number[] }[];
}

const AreaChart: React.FC<ChartProps> = ({ title, categories, series }) => {
  const arrowTrendingUpIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                                   <path fill-rule="evenodd" d="M12.577 4.878a.75.75 0 0 1 .919-.53l4.78 1.281a.75.75 0 0 1 .531.919l-1.281 4.78a.75.75 0 0 1-1.449-.387l.81-3.022a19.407 19.407 0 0 0-5.594 5.203.75.75 0 0 1-1.139.093L7 10.06l-4.72 4.72a.75.75 0 0 1-1.06-1.061l5.25-5.25a.75.75 0 0 1 1.06 0l3.074 3.073a20.923 20.923 0 0 1 5.545-4.931l-3.042-.815a.75.75 0 0 1-.53-.919Z" clip-rule="evenodd" />
                                 </svg>`;

  const arrowTrendingDownIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                           <path fill-rule="evenodd" d="M1.22 5.222a.75.75 0 0 1 1.06 0L7 9.942l3.768-3.769a.75.75 0 0 1 1.113.058 20.908 20.908 0 0 1 3.813 7.254l1.574-2.727a.75.75 0 0 1 1.3.75l-2.475 4.286a.75.75 0 0 1-1.025.275l-4.287-2.475a.75.75 0 0 1 .75-1.3l2.71 1.565a19.422 19.422 0 0 0-3.013-6.024L7.53 11.533a.75.75 0 0 1-1.06 0l-5.25-5.25a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                         </svg>`;

  const options: ApexOptions = {
    chart: {
      id: "area-chart",
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
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
    title: {
      text: title,
      align: "left",
      offsetX: 30,
      offsetY: -5,
      style: { fontSize: "16px", fontWeight: 600, color: "#1f2937" },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      offsetY: -20,
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
        formatter: (val) => (val >= 1000 ? `${val / 1000}k` : val.toString()),
      },
    },
    // tooltip: {
    //   shared: true,
    //   intersect: false,
    //   custom: function ({ series, dataPointIndex, w }) {
    //     const tooltipTitle = "Revenue";
    //     const percentage = "209.5%";

    //     let seriesHtml = "";
    //     w.config.series.forEach((s: any, seriesIdx: number) => {
    //       const color = w.globals.colors[seriesIdx];
    //       const val = series[seriesIdx][dataPointIndex] || 0;

    //       seriesHtml += `
    //         <div class="flex items-center pb-2 gap-4">
    //           <!-- Colored square -->
    //           <div style="width: 10px; height: 10px; background: ${color}; display: inline-block; margin-right: 8px; border-radius: 2px;"></div>

    //           <!-- Value -->
    //           <span class="font-semibold text-gray-900">$${val.toLocaleString()}</span>

    //           <!-- Series name -->
    //           <span class="text-gray-700">${s.name}</span>
    //         </div>
    //       `;
    //     });

    //     const arrowTrendingUpIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
    //                                <path fill-rule="evenodd" d="M12.577 4.878a.75.75 0 0 1 .919-.53l4.78 1.281a.75.75 0 0 1 .531.919l-1.281 4.78a.75.75 0 0 1-1.449-.387l.81-3.022a19.407 19.407 0 0 0-5.594 5.203.75.75 0 0 1-1.139.093L7 10.06l-4.72 4.72a.75.75 0 0 1-1.06-1.061l5.25-5.25a.75.75 0 0 1 1.06 0l3.074 3.073a20.923 20.923 0 0 1 5.545-4.931l-3.042-.815a.75.75 0 0 1-.53-.919Z" clip-rule="evenodd" />
    //                              </svg>`;

    //     const arrowTrendingDownIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
    //                        <path fill-rule="evenodd" d="M1.22 5.222a.75.75 0 0 1 1.06 0L7 9.942l3.768-3.769a.75.75 0 0 1 1.113.058 20.908 20.908 0 0 1 3.813 7.254l1.574-2.727a.75.75 0 0 1 1.3.75l-2.475 4.286a.75.75 0 0 1-1.025.275l-4.287-2.475a.75.75 0 0 1 .75-1.3l2.71 1.565a19.422 19.422 0 0 0-3.013-6.024L7.53 11.533a.75.75 0 0 1-1.06 0l-5.25-5.25a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
    //                      </svg>`;

    //     return `
    //       <div class="p-3 bg-white border border-gray-200 shadow-md rounded-md">
    //         <div class="flex justify-between text-sm font-semibold">
    //           <span>${tooltipTitle}</span>
    //           <span>${arrowTrendingUpIcon}</span>
    //           <span class="text-green-600"> ${percentage}</span>
    //         </div>
    //         ${seriesHtml}
    //       </div>`;
    //   },
    // },
    tooltip: {
      shared: true,
      intersect: false,
      custom: ({ series, dataPointIndex, w }) => {
        const tooltipTitle = "Revenue";

        if (series.length > 1) {
          // Ensure there are at least two series to compare
          // if (w.config.series.length > 1) return null;

          // Extract the relevant values for comparison
          const currentYearValue = series[0][dataPointIndex] || 0; // 2025 series
          const previousYearValue = series[1][dataPointIndex] || 0; // 2024 series

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
              ? `<span class="text-green-600">${arrowTrendingUpIcon} ${formattedPercentage}</span>`
              : percentageChange < 0
              ? `<span class="text-red-600">${arrowTrendingDownIcon} ${formattedPercentage}</span>`
              : `<span class="text-gray-600">No Change</span>`;

          let seriesHtml = "";

          w.config.series.forEach((s: any, seriesIdx: number) => {
            const color = w.globals.colors[seriesIdx];
            const val = series[seriesIdx][dataPointIndex] || 0;

            seriesHtml += `
            <div class="flex items-center pb-2 gap-4">
              <div style="width: 10px; height: 10px; background: ${color}; display: inline-block; margin-right: 8px; border-radius: 2px;"></div>
              <span class="font-semibold text-gray-900">$${val.toLocaleString()}</span>
              <span class="text-gray-700">${s.name}</span>
            </div>
          `;
          });

          return `
          <div class="p-3 bg-white border border-gray-200 shadow-md rounded-md">
            <div class="flex justify-between text-sm font-semibold">
              <span>${tooltipTitle}</span>
              ${trendingIcon}
            </div>
            ${seriesHtml}
          </div>`;
        } else {
          // Single series case
          const singleSeries = w.config.series[0];
          const singleValue = series[0][dataPointIndex] || 0;
          const singleColor = w.globals.colors[0];

          const seriesHtml = `
            <div class="flex items-center pb-2 gap-4">
              <div style="width: 10px; height: 10px; background: ${singleColor}; display: inline-block; margin-right: 8px; border-radius: 2px;"></div>
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
