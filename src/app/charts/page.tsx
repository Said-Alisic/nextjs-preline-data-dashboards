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
    title: "Area Chart - Monthly Sales",
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

  return (
    <div className="w-full p-6 justify-items-center">
      <section className="w-5/6 mt-4 gap-6 grid grid-cols-1 md:grid-cols-2">
        <LineChart
          title={lineChart.title}
          categories={lineChart.categories}
          series={lineChart.series}
        />
        <AreaChart
          title={areaChart.title}
          categories={areaChart.categories}
          series={areaChart.series}
        />
      </section>
    </div>
  );
}
