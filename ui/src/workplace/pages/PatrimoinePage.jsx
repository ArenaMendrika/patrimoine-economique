import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

function ChartComponent({ data, x }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const jours = [];
  for (let i = 0; i < data.length; i++) {
    jours.push(i * x);
  }

  data = {
    labels: jours,
    datasets: [
      {
        label: "Valeur des patrimoines",
        data: data,
        backgroundColor: [
          "rgba(255, 255, 255, 0.6)",
          "rgba(255, 255, 255, 0.6)",
          "rgba(255, 255, 255, 0.6)",
        ],
        borderColor: "black",
        borderWidth: 1,
        pointBackgroundColor: "black",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Jours",
        },
      },
      y: {
        title: {
          display: true,
          text: "Valeur des patrimoines",
        },
      },
    },
  };
  return (
    <div style={{height: "40vh" }}>
      <Line data={data} options={options} />
    </div>
  );
}



const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function DateRangeSelector({
  dateDebut,
  setDateDebut,
  dateFin,
  setDateFin,
  jour,
  setJour,
  handleValidateRange,
}) {
  return (
    <div className="range d-flex flex-row justify-content-around ">
      <div>
        <p>Date de début :</p>
        <DatePicker selected={dateDebut} onChange={setDateDebut} />
      </div>
      <div>
        <p>Date fin :</p>
        <DatePicker selected={dateFin} onChange={setDateFin} />
      </div>
      <div>
        <p>Jour :</p>
        <select value={jour} onChange={(e) => setJour(parseInt(e.target.value))}>
          {array.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button
          className="btn btn-secondary mt-4"
          onClick={handleValidateRange}
        >
          Valider
        </button>
      </div>
    </div>
  );
}



function ValueGetter({ dateSelected, setDateSelected, handleGetValeur, valuePatrimoine }) {
  return (
    <div className="range d-flex flex-row w-75 pe-3 justify-content-between">
      <div className="d-flex flex-row">
      <DatePicker selected={dateSelected} onChange={setDateSelected} />
      <button className="btn btn-secondary ms-2" onClick={() => handleGetValeur(dateSelected)}>
        Valider
      </button>
      </div>
      <div className="d-flex flex-row">
        <p>La valeur du patrimoine est de :</p>
        <p className="ms-2"> {valuePatrimoine} Ar</p>
      </div>
    </div>
  );
}


function PatrimoinePage() {
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [jour, setJour] = useState(1);
  const [chartData, setChartData] = useState([]);
  const [valuePatrimoine, setValuePatrimoine] = useState(0);
  const [dateSelected, setDateSelected ] = useState(null)

  

  const handleValidateRange = async () => {
    // Appel à l'API pour obtenir la valeur du patrimoine sur la plage de dates
    const response = await fetch("http://localhost:3000/patrimoine/range", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "month", dateDebut, dateFin, jour}),
    });
    const data = await response.json();
    setChartData(data.valeur);
  };

  const handleGetValeur = async (date) => {
    const response = await fetch(`http://localhost:3000/patrimoine/${date.toISOString()}`);
    const data = await response.json();
    setValuePatrimoine(data.valeur);
  };

  return (
    <div className="container">
      <h2>Page Patrimoine</h2>
      
      <div className="mb-4 ml-3">
        <h4>Chart</h4>
        <DateRangeSelector 
          dateDebut={dateDebut} 
          setDateDebut={setDateDebut} 
          dateFin={dateFin} 
          setDateFin={setDateFin} 
          jour={jour} 
          setJour={setJour} 
          handleValidateRange={handleValidateRange} 
        />
        {chartData && <ChartComponent data={chartData} x={parseInt(jour)}/>}
      </div>

      <div>
        <h4>Obtenir la valeur du Patrimoine</h4>
        <ValueGetter 
          dateSelected = {dateSelected}
          setDateSelected = {setDateSelected}
          handleGetValeur={handleGetValeur} 
          valuePatrimoine = {valuePatrimoine}
        />
      </div>
    </div>
  );
}

export default PatrimoinePage;
