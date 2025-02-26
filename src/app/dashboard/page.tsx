import { HeartIcon } from "@heroicons/react/20/solid";
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import AreaChart from "app/libs/components/charts/AreaChart";
import LineChart from "app/libs/components/charts/LineChart";

export default function ChartsPage() {
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
      value: "64,53%",
      previous: "59,53%",
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

  const chartCardStyles = "bg-white rounded-3xl pt-7 pb-4 pr-4 pl-2 shadow-lg";
  const chartTitleStyles = "text-2xl ml-10 pb-4 text-[#1924fa] font-medium";
  const statCardStyles =
    "rounded-3xl px-6 pt-4 pb-10 shadow-lg bg-gradient-to-br from-[#D1D3FE] from-0% via-40% via-white to-white";

  return (
    <div className="w-full p-6 justify-items-center">
      <section className="w-5/6 mt-4 gap-10 grid grid-cols-6 md:grid-cols-4">
        {statCards.map((statCard, key) => {
          return (
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
          );
        })}
      </section>
      <section className="w-5/6 mt-10 gap-6 grid grid-cols-1 md:grid-cols-1">
        {/* TODO: #REFACTOR -> Move `div` elements into new components that call a different chart */}
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
      </section>
    </div>
  );
}
