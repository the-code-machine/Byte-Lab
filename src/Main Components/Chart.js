import React, { useState } from 'react';
import Chart from "react-apexcharts";

const Charts = () => {
  const [options] = useState({
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories: [
        "1970", "", "1972", "", "1974", "", "1976", "", "1978", "", "1980", "", "1982", "", "1984", "", "1986", "", "1988", "","1990","","1992","","1994","","1996","","1998","",
        "2000", "", "2002", "", "2004", "", "2006", "", "2008", "", "2010", "", "2012", "", "2014", "", "2016", "", "2018", "",
        "2020", "", "2022"
      ],
      labels: {
        rotateAlways: true, // Rotate labels always
        style: {
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400,
          cssClass: 'apexcharts-xaxis-label',
        },
      },
      tickPlacement: 'between', // Place ticks between the labels
      hideOverlappingLabels: true 
    },
    colors: ['#1DBF73'], // Custom color for the series
  });

  const [series] = useState([
    {
      name: "CO2",
      data: [
        0.39, 0.38, 0.39, 0.37, 0.39, 0.41, 0.43, 0.42, 0.41, 0.43, 0.44, 0.47, 0.48, 0.5, 0.54, 0.55, 0.59, 0.61, 0.64, 0.67, 0.69, 0.73, 0.74, 0.79, 0.83, 0.85, 0.88, 0.89, 0.93, 0.95, 0.94, 0.96, 0.98, 1.04, 1.06, 1.12, 1.2, 1.26, 1.35, 1.42, 1.48, 1.6, 1.63, 1.73, 1.73, 1.74, 1.82, 1.9, 1.86, 1.68, 1.81, 1.91
      ]
    }
  ]);

  return (
    <div className=" relative h-screen w-full flex justify-center items-center">
          <Chart
            options={options}
            series={series}
            type="line"
            width="900"
          />
    
    </div>
  );
};

export default Charts;
