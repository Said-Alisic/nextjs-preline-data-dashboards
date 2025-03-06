"use client";

import { FC, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BarChartProps {
  categories: string[];
  series: { name: string; data: number[] }[];
  title?: string;
}

const BarChart: FC<BarChartProps> = ({ categories, series, title }) => {
  const [isToolTipShared, setIsToolTipShared] = useState(true);
  const [hiddenSeriesIndexes, setHiddenSeriesIndexes] = useState<number[]>([]);

  const options: ApexOptions = {
    colors: ["#1924fa", "#000000", "#8e95e8"],
    chart: {
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
      animations: {
        enabled: true,
        animateGradually: {
          enabled: true,
          delay: 400,
        },
        speed: 1400,
      },
      type: "bar",
      height: 300,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    series,
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "14px",
        borderRadius: 0,
      },
    },
    legend: {
      onItemHover: { highlightDataSeries: false },
      show: true,
      position: "top",
      horizontalAlign: "right",
      offsetY: -20,
      onItemClick: {
        toggleDataSeries: true,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
      crosshairs: { show: true },
      axisBorder: { show: true },
      axisTicks: { show: true, color: "#000000" },
      tooltip: { enabled: true },
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "13px",
          fontWeight: 400,
        },
        offsetX: -2,
        formatter: (title) => title.slice(0, 3),
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "13px",
          fontWeight: 400,
        },
        formatter: (value, opts) =>
          value >= 1000 ? `${value / 1000}k` : value.toString(),
      },
    },
    states: {
      hover: { filter: { type: "darken" } },
    },
    responsive: [
      {
        breakpoint: 568,
        options: {
          chart: { height: 300 },
          plotOptions: { bar: { columnWidth: "14px" } },
          stroke: { width: 8 },
          labels: {
            style: {
              colors: "#9ca3af",
              fontSize: "11px",
              fontFamily: "Inter, ui-sans-serif",
              fontWeight: 400,
            },
            offsetX: -2,
            formatter: (title: string) => title.slice(0, 3),
          },
          yaxis: {
            labels: {
              style: {
                colors: "#9ca3af",
                fontSize: "11px",
                fontFamily: "Inter, ui-sans-serif",
                fontWeight: 400,
              },
              formatter: (value: number) =>
                value >= 1000 ? `${value / 1000}k` : value,
            },
          },
        },
      },
    ],
    tooltip: {
      shared: isToolTipShared,
      intersect: false,
      custom: ({ series, dataPointIndex, w }) => {
        const tooltipTitle = title || w.globals.categoryLabels[dataPointIndex];

        if (series.length > 1 && isToolTipShared) {
          let seriesHtml = "";

          w.config.series.forEach((s: any, seriesIdx: number) => {
            if (hiddenSeriesIndexes.includes(seriesIdx)) return;

            const color = w.globals.colors[seriesIdx];
            const val = series[seriesIdx][dataPointIndex] || 0;
            seriesHtml += `
              <div class="flex items-center pb-2 gap-6">
                <div style="width: 10px; height: 10px; background: ${color}; display: inline-block; margin-right: 8px; border-radius: 5px;"></div>
                <span class="font-semibold text-gray-900">${val.toLocaleString()}</span>
                <span class="text-gray-700">${s.name}</span>
              </div>
            `;
          });

          return `
            <div class="p-3 bg-white border border-gray-200 shadow-md rounded-md">
              <div class="flex justify-between text-sm font-semibold mb-2 gap-4">
                <span>${tooltipTitle}</span>
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
              <span class="font-semibold text-gray-900">${singleValue.toLocaleString()}</span>
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

  return <Chart options={options} series={series} type="bar" height={300} />;
};

export default BarChart;
