"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartProps {
  title: string;
  categories: string[];
  series: { name: string; data: any[] }[];
}

const AreaChart: React.FC<ChartProps> = ({ title, categories, series }) => {
  const options: ApexOptions = {
    chart: {
      id: "area-chart",
      height: 250,
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#467bf0"],
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

  return <Chart options={options} series={series} type="area" height={300} />;
};

export default AreaChart;
