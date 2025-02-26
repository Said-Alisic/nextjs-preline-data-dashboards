import AreaChart from "app/libs/components/charts/AreaChart";
import LineChart from "app/libs/components/charts/LineChart";

export default function ChartsPage() {
  const lineChart = {
    title: "Line Chart - Monthly Sales",
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
    title: "Revenue",
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

  const chartCardStyles = "bg-white rounded-3xl pt-7 pb-4 pr-4 pl-2 shadow-lg";
  const chartTitleStyles = "text-2xl ml-10 pb-4 text-[#1924fa] font-medium";

  return (
    <div className="w-full p-6 justify-items-center">
      <section className="w-5/6 mt-4 gap-6 grid grid-cols-1 md:grid-cols-1">
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
