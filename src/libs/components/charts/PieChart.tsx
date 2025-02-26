"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface PieChartProps {
  labels: string[];
  series: number[];
}

const PieChart: React.FC<PieChartProps> = ({ labels, series }) => {
  const options: ApexOptions = {
    chart: {
      type: "pie",
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -20,
          minAngleToShowLabel: 30,
        },
      },
    },
    labels,
    colors: ["#1924fa", "#474FFB", "#757BFC", "#A3A7FD", "#D1D3FE"],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
        fontWeight: 600,
        colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#000000", "#000000"],
      },
      formatter: (val: number) => `${val.toFixed(1)} %`,
      dropShadow: {
        enabled: false,
      },
    },
    legend: {
      position: "right",
      labels: {
        colors: "#000000",
      },
    },
    stroke: {
      show: true,
      colors: ["#FFFFFF"],
      width: 2,
    },
    tooltip: {
      followCursor: false,
      enabled: true,
      theme: "none",
      style: {
        fontSize: "12px",
        fontFamily: "inherit",
      },
      fillSeriesColor: false,
      y: {
        formatter: (val) => `${val} %`,
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
      custom: ({ series, seriesIndex, w }) => {
        return `<div style="
          background: white;
          color: black;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 400;
          border-radius: 6px;
          ">
          <span style="color: gray">${w.globals.labels[seriesIndex]}: </span>
          <span>${series[seriesIndex]}%</span>
        </div>`;
      },
    },
  };

  return <Chart options={options} series={series} type="pie" height={320} />;
};

export default PieChart;
