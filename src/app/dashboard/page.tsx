import { HeartIcon } from "@heroicons/react/20/solid";
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { getIndividualProductSales } from "app/libs/actions";
import { getOrderStatsByMonth } from "app/libs/actions/orders.action";
import AreaChart from "app/libs/components/charts/AreaChart";
import BarChart from "app/libs/components/charts/BarChart";
import LineChart from "app/libs/components/charts/LineChart";
import PieChart from "app/libs/components/charts/PieChart";
import { JSX } from "react";

export default async function ChartsPage(): Promise<JSX.Element> {
  const shouldCompareData = true;

  // Areachart data
  const getOrderStats = await getOrderStatsByMonth({
    startDate: "2025-01-01",
    endDate: "2026-03-16",
    comparison: shouldCompareData,
  });

  const areaChartLegend = ["Current", "Previous"];

  const areaChartLabels: string[] = getOrderStats.data.map((order) => {
    return order.month?.slice(0, 3)!;
  });

  const areaChartData: number[] = getOrderStats.data.map((order) => {
    return Math.round(order.totalIncomeInCents / 100);
  });

  const areaChartComparisonData: number[] = getOrderStats.comparisonData.map(
    (order) => {
      return Math.round(order.totalIncomeInCents / 100);
    }
  );

  const areaChartSeries = {
    title: "Revenue",
    series: [
      {
        name: areaChartLegend[0],
        data: areaChartData,
      },
      areaChartComparisonData.length > 0
        ? {
            name: areaChartLegend[1],
            data: areaChartComparisonData,
          }
        : { name: "", data: [] },
    ],

    categories: areaChartLabels,
  };

  // Linechart data
  const lineChartLegend = ["Current", "Previous"];

  const lineChartLabels: string[] = getOrderStats.data.map((order) => {
    return order.month?.slice(0, 3)!;
  });

  const lineChartOrderCountData: number[] = getOrderStats.data.map((order) => {
    return order.orderCount;
  });

  const lineChartOrderTotalProductsSoldData: number[] = getOrderStats.data.map(
    (order) => {
      return order.totalProductsSold;
    }
  );

  const lineChartSeries = {
    title: "Sales",
    series: [
      {
        name: "Orders Delivered",
        data: lineChartOrderCountData,
      },
      {
        name: "Products Sold",
        data: lineChartOrderTotalProductsSoldData,
      },
    ],

    categories: lineChartLabels,
  };

  // Piechart data
  const individualProductSales = await getIndividualProductSales({
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    comparison: shouldCompareData,
  });

  const pieChartLabels: string[] = individualProductSales.data.map(
    (product) => {
      return product.name;
    }
  );

  const pieChartData: number[] = individualProductSales.data.map((product) => {
    const totalProductsSold = individualProductSales.data.reduce(
      (acc, product) => {
        return acc + product.totalProductsSold;
      },
      0
    );

    return (
      Math.round((product.totalProductsSold / totalProductsSold) * 100 * 100) /
      100
    );
  });

  const pieChartComparisonData: number[] =
    individualProductSales.comparisonData.map((product) => {
      const totalProductsSold = individualProductSales.data.reduce(
        (acc, product) => acc + product.totalProductsSold,
        0
      );

      return (
        Math.round(
          (product.totalProductsSold / totalProductsSold) * 100 * 100
        ) / 100
      );
    });

  // TODO: Replace with data from database
  const statCards = [
    {
      name: "Active Users",
      value: "35,000",
      previous: "34,000",
      differenceInPercentage: "2%",
      trend: "up",
      icon: <UserGroupIcon width={28} height={28} color="#0084d1" />,
    },
    {
      name: "User Satisfaction",
      value: "64.53%",
      previous: "59.53%",
      differenceInPercentage: "5%",
      trend: "up",
      icon: <HeartIcon width={28} height={28} color="#e12afb" />,
    },
    {
      name: "Revenue",
      value: "$400,000",
      previous: "$450,000",
      differenceInPercentage: "15%",
      trend: "down",
      icon: <CurrencyDollarIcon width={28} height={28} color="#1fdb6d" />,
    },
    {
      name: "Average Weekly Users",
      value: "1,000",
      previous: "950",
      differenceInPercentage: "4.5%",
      trend: "up",
      icon: <UsersIcon width={28} height={28} color="#4f39f6" />,
    },
  ];

  const barChartCategories = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const barChartSeries = [
    {
      name: "Gross Revenue",
      data: [
        23000, 84000, 105000, 157000, 56000, 81000, 58000, 93000, 60000, 66000,
        34000, 78000,
      ],
    },
    {
      name: "Net Revenue",
      data: [
        17000, 76000, 85000, 101000, 48000, 67000, 50000, 91000, 44000, 49000,
        28000, 62000,
      ],
    },
    {
      name: "Expenses",
      data: [
        5000, 12000, 14000, 20000, 9500, 8000, 7000, 15500, 7500, 8000, 3000,
        13500,
      ],
    },
  ];

  const chartCardStyles = "bg-white rounded-3xl pt-7 pb-4 pr-4 pl-2 shadow-lg";
  const chartTitleStyles = "text-2xl ml-10 pb-4 text-[#1924fa] font-medium";
  const statCardStyles =
    "rounded-3xl pl-6 pr-4 pt-4 pb-10 shadow-lg bg-gradient-to-br from-[#D1D3FE] from-0% via-40% via-white to-white";

  return (
    <main className="ml-[19rem] w-[80%] pt-4 pb-10 px-1 ">
      <section className="w-[95%] mt-20 gap-10 grid grid-cols-6 md:grid-cols-4">
        {statCards.map((statCard, key) => (
          <div className={statCardStyles} key={key}>
            <div className="mb-2 bg-white w-10 h-10 flex justify-center items-center rounded-lg shadow-md">
              {statCard.icon}
            </div>
            <h4 className="text-lg text-black">{statCard.name}</h4>
            <span className="text-2xl font-semibold text-black mt-1.5">
              {statCard.value}
            </span>
            <span
              className={`ml-4 text-sm bg-gray-100 px-3 py-1.5 rounded-full ${
                statCard.trend === "up" ? "text-[#1fdb6d]" : "text-[#ff0033]"
              }`}
            >
              {statCard.trend === "up" ? "+" : "-"}
              {statCard.differenceInPercentage}
            </span>
          </div>
        ))}
      </section>
      <section className="w-[95%] mt-10 gap-6 grid grid-cols-1 md:grid-cols-1">
        <div className={chartCardStyles}>
          <h3 className={chartTitleStyles}>
            {"Monthly " + lineChartSeries.title}
          </h3>
          <LineChart
            categories={lineChartSeries.categories}
            series={lineChartSeries.series}
            title={lineChartSeries.title}
          />
        </div>
        <div className={chartCardStyles}>
          <h3 className={chartTitleStyles}>
            {"Monthly " + areaChartSeries.title}
          </h3>
          <AreaChart
            categories={areaChartSeries.categories}
            series={areaChartSeries.series}
            shouldCompare={shouldCompareData}
            title={areaChartSeries.title}
          />
        </div>
        <div className={chartCardStyles}>
          <h3 className={chartTitleStyles}>Monthly Finances</h3>
          <BarChart categories={barChartCategories} series={barChartSeries} />
        </div>
        <div className="grid grid-cols-2 gap-10">
          <div className={chartCardStyles}>
            <h3 className={chartTitleStyles}>Total Product Sales Year 2025</h3>
            <PieChart
              labels={pieChartLabels}
              series={pieChartData}
              // labels={["Free Tier", "Startup", "Enterprise"]}
              // series={[70, 18, 12]}
            />
          </div>

          {shouldCompareData ? (
            <div className={chartCardStyles}>
              <h3 className={chartTitleStyles}>
                Total Product Sales Year 2024
              </h3>
              <PieChart
                labels={pieChartLabels}
                series={pieChartComparisonData}
                // labels={[
                //   "Love it",
                //   "Satisfied",
                //   "Neutral",
                //   "Unsatisfied",
                //   "Hate it",
                // ]}
                // series={[20, 40, 18, 16, 6]}
              />
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
