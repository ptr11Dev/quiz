import React from "react";
import { Bar } from "react-chartjs-2";

const Chart = props => {
  return (
    <Bar
      data={props.chartData}
      options={{
        legend: { display: false },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }}
    />
  );
};

export default Chart;
