"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartProps {
  title: string;
  categories: string[];
  series: { name: string; data: any[] }[];
}

const LineChart: React.FC<ChartProps> = ({ title, categories, series }) => {
  const options: ApexOptions = {
    chart: {
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
      colors: ["#467bf0"],
    },
    title: {
      text: title,
      align: "left",
      offsetX: 30,
      offsetY: -5,
      style: { fontSize: "16px", fontWeight: 600, color: "#1f2937" },
    },
    legend: { show: false },
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
          return `${newT[0]} ${newT[1]?.slice(0, 3)}`;
        },
      },
    },
    yaxis: {
      min: 0,
      max: 40000,
      tickAmount: 4,
      labels: {
        align: "left",
        minWidth: 0,
        maxWidth: 140,
        style: { colors: "#9ca3af", fontSize: "12px", fontWeight: 400 },
        formatter: (value) =>
          value >= 1000 ? `${value / 1000}k` : value.toString(),
      },
    },
  };

  return <Chart options={options} series={series} type="line" height={300} />;
};

export default LineChart;
