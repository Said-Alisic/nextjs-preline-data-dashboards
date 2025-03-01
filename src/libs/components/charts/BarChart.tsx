"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BarChartProps {
  categories: string[];
  series: { name: string; data: number[] }[];
}

const BarChart: React.FC<BarChartProps> = ({ categories, series }) => {
  const options: ApexOptions = {
    colors: ["#1924fa", "#000000", "#8e95e8"],
    chart: {
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
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: { show: false },
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
        formatter: (value) =>
          value >= 1000 ? `${value / 1000}k` : value.toString(),
      },
    },
    states: {
      hover: { filter: { type: "darken" } },
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value >= 1000 ? `${value / 1000}k` : value}`,
      },
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
  };

  return <Chart options={options} series={series} type="bar" height={300} />;
};

export default BarChart;
