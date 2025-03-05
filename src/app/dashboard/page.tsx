import { HeartIcon } from "@heroicons/react/20/solid";
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { getIndividualProductSales } from "app/libs/actions";
import AreaChart from "app/libs/components/charts/AreaChart";
import BarChart from "app/libs/components/charts/BarChart";
import LineChart from "app/libs/components/charts/LineChart";
import PieChart from "app/libs/components/charts/PieChart";
import { JSX } from "react";

export default async function ChartsPage(): Promise<JSX.Element> {
  const shouldCompareData = true;

  const individualProductSales = await getIndividualProductSales({
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    comparison: shouldCompareData,
  });

  const piechartData: number[] = individualProductSales.data.map((product) => {
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

  const piechartComparisonData: number[] =
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

  const piechartLabels: string[] = individualProductSales.data.map(
    (product) => {
      return product.name;
    }
  );

  const lineChart = {
    title: "Monthly Sales",
    series: [
      {
        name: "Sales",
        data: [0, 10000, 27000, 25000, 27000, 40000],
      },
    ],

    categories: [
      "20 January 2023",
      "25 January 2023",
      "28 January 2023",
      "31 January 2023",
      "1 February 2023",
      "3 February 2023",
    ],
  };

  const areaChart = {
    title: "Monthly Revenue",
    series: [
      {
        name: "2025",
        data: [
          5000, 10000, 27000, 25000, 27000, 40000, 17000, 18000, 6000, 9500,
          15000, 12000,
        ],
      },
      {
        name: "2024",
        data: [
          4000, 30000, 7000, 2500, 33000, 20000, 10000, 5500, 6000, 8000, 25000,
          3000,
        ],
      },
    ],

    categories: [
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
    ],
  };

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
    "rounded-3xl px-6 pt-4 pb-10 shadow-lg bg-gradient-to-br from-[#D1D3FE] from-0% via-40% via-white to-white";

  return (
    <main className="ml-[20rem] w-[80%] pt-4 pb-10 px-1 ">
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
          <h3 className={chartTitleStyles}>{lineChart.title}</h3>
          <LineChart
            categories={lineChart.categories}
            series={lineChart.series}
          />
        </div>
        <div className={chartCardStyles}>
          <h3 className={chartTitleStyles}>{areaChart.title}</h3>
          <AreaChart
            categories={areaChart.categories}
            series={areaChart.series}
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
              labels={piechartLabels}
              series={piechartData}
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
                labels={piechartLabels}
                series={piechartComparisonData}
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
