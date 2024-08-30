import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Line } from "react-chartjs-2";
import  { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Chart({ data, x }) {
  const chartData = useMemo(() => {
    const labels = data.map((_, index) => index * x);

    return {
      labels,
      datasets: [
        {
          label: "Valeur des patrimoines",
          data: data,
          backgroundColor: "#e6b94b",
          borderColor: "#e6b94b",
          borderWidth: 2,
          pointBackgroundColor: "#d8a62f",
          pointBorderColor: "white",
          pointHoverBackgroundColor: "white",
          pointHoverBorderColor: "#d8a62f",
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  }, [data, x]);

  const options = {
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Jours",
          color: "#666",
          font: {
            family: "Arial",
            size: 16,
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Valeur des patrimoines",
          color: "#666",
          font: {
            family: "Arial",
            size: 16,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#666",
          font: {
            family: "Arial",
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        titleFont: { size: 16, weight: "bold" },
        bodyFont: { size: 14 },
        borderColor: "#fff",
        borderWidth: 1,
        cornerRadius: 4,
      },
    },
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: "70vh",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <Line data={chartData} options={options} />
    </div>
  );
}

function Dates({
  dateDebut,
  setDateDebut,
  dateFin,
  setDateFin,
  jour,
  setJour,
  handleValidateRange,
}) {
  const joursArray = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="container my-4">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm" style={{ border: '2px solid #d8a62f' }}>
            <p className="mb-2 fw-bold">Date de début :</p>
            <DatePicker
              selected={dateDebut}
              onChange={setDateDebut}
              className="form-control"
              style={{ borderRadius: '4px' }}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm" style={{ border: '2px solid #d8a62f' }}>
            <p className="mb-2 fw-bold">Date fin :</p>
            <DatePicker
              selected={dateFin}
              onChange={setDateFin}
              className="form-control"
              style={{ borderRadius: '4px' }}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm" style={{ border: '2px solid #d8a62f' }}>
            <p className="mb-2 fw-bold">Jour :</p>
            <select
              value={jour}
              onChange={(e) => setJour(parseInt(e.target.value))}
              className="form-select"
              style={{ borderRadius: '4px' }}
            >
              {joursArray.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-12 text-center">
          <button
            className="btn text-white mt-4"
            style={{ background: '#d8a62f' }}
            onClick={handleValidateRange}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

function ValeurUneDate({ dateSelected, setDateSelected, handleGetValeur, valuePatrimoine }) {
  return (
    <div className="range d-flex flex-column w-75 pe-3 justify-content-between align-items-center rounded p-3 bg-light box shadow" style={{border: '2px solid #d8a62f'}}>
      <div className="d-flex flex-row align-items-center">
      <DatePicker
          selected={dateSelected}
          onChange={setDateSelected}
          className="form-control custom-date-picker"
      />
        <button
          className="btn" style={{background: '#d8a62f'}}
          onClick={() => handleGetValeur(dateSelected)}
        >
          Confirmer
        </button>
      </div>
      <div className="d-flex flex-row align-items-center">
        <p className="mb-0"> A cette date, la patrimoine est de:</p>
        <p className="ms-2 mb-0 fw-bold" style={{fontSize: '1.2rem'}}>{valuePatrimoine} Ar</p>
      </div>
    </div>
  );
};

function PatrimoinePage() {
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [jour, setJour] = useState(1);
  const [chartData, setChartData] = useState([]);
  const [valuePatrimoine, setValuePatrimoine] = useState(0);
  const [dateSelected, setDateSelected ] = useState(null)

  

  const handleValidateRange = async () => {
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
    <div className="container" style={{marginBottom: '20%'}}>
      
      <div className="mb-4 ml-3">
        <Dates
          dateDebut={dateDebut} 
          setDateDebut={setDateDebut} 
          dateFin={dateFin} 
          setDateFin={setDateFin} 
          jour={jour} 
          setJour={setJour} 
          handleValidateRange={handleValidateRange} 
        />
        {chartData && <Chart data={chartData} x={parseInt(jour)}/>}
      </div>

      <div>
        <ValeurUneDate 
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
