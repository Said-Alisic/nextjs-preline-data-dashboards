"use client";

import { FC, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartProps {
  categories: string[];
  series: { name: string; data: any[] }[];
  title?: string;
}

const LineChart: FC<ChartProps> = ({ title, categories, series }) => {
  const [isToolTipShared, setIsToolTipShared] = useState(true);

  const options: ApexOptions = {
    colors: ["#1924fa", "#000000", "#8e95e8"],
    chart: {
      events: {
        legendClick: () => {
          setIsToolTipShared(!isToolTipShared);
        },
      },
      id: "line-chart",
      height: 250,
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "straight",
      width: [4, 4, 4],
      dashArray: [0, 0, 4],
      colors: ["#1924fa", "#000000", "#8e95e8"],
    },
    // title: {
    //   text: title,
    //   align: "left",
    //   offsetX: 30,
    //   offsetY: -5,
    //   style: { fontSize: "16px", fontWeight: 600, color: "#1f2937" },
    // },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      offsetY: -20,
      onItemClick: {
        toggleDataSeries: true,
      },
    },
    grid: {
      strokeDashArray: 0,
      borderColor: "#e5e7eb",
      padding: { top: -20, right: 0 },
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      labels: {
        offsetY: 5,
        style: { colors: "#9ca3af", fontSize: "13px", fontWeight: 400 },
        formatter: (title) => {
          if (!title) return title;
          const newT = title.split(" ");
          return `${newT[0]}`;
        },
      },
    },
    yaxis: {
      min: 0,
      // tickAmount: 4,
      labels: {
        align: "left",
        minWidth: 0,
        maxWidth: 140,
        style: { colors: "#9ca3af", fontSize: "12px", fontWeight: 400 },
        formatter: (value) =>
          value >= 1000 ? `${value / 1000}k` : value.toString(),
      },
    },
    tooltip: {
      shared: isToolTipShared,
      intersect: false,
      custom: ({ series, dataPointIndex, w }) => {
        const tooltipTitle = title;

        if (series.length > 1) {
          let seriesHtml = "";

          w.config.series.forEach((s: any, seriesIdx: number) => {
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
            </div>
            ${seriesHtml}
          </div>`;
        } else {
          const singleSeries = w.config.series[0];
          const singleValue = series[0][dataPointIndex] || 0;
          const singleColor = w.globals.colors[0];

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

  return <Chart options={options} series={series} type="line" height={300} />;
};

export default LineChart;
