import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useCategories } from "../modules/categories/CategoriesContext";
import { useTransactions } from "../modules/transactions/TransactionsContext";
import { getCSSColor } from "../../utilities";
import { useMantineTheme } from "@mantine/core";

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

export const testData = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 0,
    },
  ],
};

const Graphs = () => {
  const theme = useMantineTheme();
  const { categories } = useCategories();
  const { totals, categoryType } = useTransactions();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let labels = [];
    let newData = [];
    let colors = [];
    totals.categories.forEach((v, i) => {
      if (v.type == categoryType) {
        labels.push(v.name);
        newData.push(v.total);
        colors.push(theme.fn.lighten(getCSSColor(theme, v.color), 0.4));
      }
    });
    setData({
      labels: labels,
      datasets: [{ label: "Totals per Category", data: newData, backgroundColor: colors }],
    });
  }, [categories, totals]);

  return (
    <div
      style={{ height: "90%" }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {data && (
        <Doughnut
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "left",
              },
              title: {
                display: false,
                text: "Chart.js Line Chart",
              },
            },
          }}
          plugins={[ChartDataLabels]}
        />
      )}
    </div>
  );
};

export default Graphs;
