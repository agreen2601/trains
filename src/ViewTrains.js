import React, { useState, useEffect, useCallback } from "react";
import ApiManager from "./api/ApiManager";
import "./App.css";

const ViewTrains = () => {
  const [trains, setTrains] = useState([]);
  const [columns, setColumns] = useState([]);
  const [chosenColor, setChosenColor] = useState("");
  const [chosenType, setChosenType] = useState("");
  const [chosenCarCount, setChosenCarCount] = useState("");

  const { showFetchError, fetchTrains } = ApiManager();

  const getTrains = useCallback(() => {
    fetchTrains().then((r) => {
      setTrains(r.TrainPositions);
      setColumns(Object.keys(r.TrainPositions[0]));
    });
  }, []);

  let trainColors = [];
  let trainTypes = [];
  let trainCarCounts = [];
  let filteredTrains = [];

  if (trains?.length) {
    trainColors = [...new Set(trains.map((trains) => trains.color))].sort();

    trainTypes = [
      ...new Set(trains.map((trains) => trains.ServiceType)),
    ].sort();

    trainCarCounts = [
      ...new Set(trains.map((trains) => trains.CarCount.toString())),
    ].sort();

    filteredTrains = trains
      .filter(({ ServiceType }) => ServiceType?.includes(chosenType))
      .filter((each) => each.color?.includes(chosenColor))
      .filter((each) => each.CarCount.toString()?.includes(chosenCarCount))
      .sort((a, b) =>
        a.CarCount?.toString().localeCompare(b.CarCount?.toString())
      )
      .sort((a, b) =>
        a.LineCode?.toString().localeCompare(b.LineCode?.toString())
      );

    trains.forEach((train) => {
      switch (train.LineCode) {
        case "BL":
          return (train.color = "blue");
        case "GR":
          return (train.color = "green");
        case "OR":
          return (train.color = "orange");
        case "RD":
          return (train.color = "red");
        case "SV":
          return (train.color = "purple");
        case "YL":
          return (train.color = "yellow");
        default:
          return (train.color = "black");
      }
    });
  }

  const handleColorSelect = ({ target: { value } }) => {
    setChosenColor(value);
  };

  const handleTypeSelect = ({ target: { value } }) => {
    setChosenType(value);
  };

  const handleCarCountSelect = ({ target: { value } }) => {
    setChosenCarCount(value);
  };

  useEffect(() => {
    getTrains();
    const intervalId = setInterval(() => {
      getTrains();
    }, 7000);
    return () => clearInterval(intervalId);
  }, [getTrains]);

  const renderTable = (trainsByType, i) => {
    return (
      <div key={i}>
        {trainsByType.length > 0 && (
          <>
            <h3>
              Service Type{" "}
              {trainsByType[0].ServiceType.split(/(?=[A-Z])/).join(" ")} Trains
            </h3>
            <table>
              <thead>
                <tr>
                  {columns &&
                    columns.map((col, i) => (
                      <th key={i}>{col.split(/(?=[A-Z])/).join(" ")}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {trainsByType &&
                  trainsByType.map((train, i) => (
                    <tr
                      key={i}
                      style={{
                        color: train.color,
                        backgroundColor: `rgb(${
                          220 -
                          (100 *
                            trainCarCounts.indexOf(train.CarCount.toString())) /
                            trainCarCounts.length
                        }, ${
                          220 -
                          (100 *
                            trainCarCounts.indexOf(train.CarCount.toString())) /
                            trainCarCounts.length
                        },${
                          220 -
                          (100 *
                            trainCarCounts.indexOf(train.CarCount.toString())) /
                            trainCarCounts.length
                        })`,
                      }}
                    >
                      {columns &&
                        columns.map((col, i) => <th key={i}>{train[col]}</th>)}
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>D.C. Train Data</h2>
      {showFetchError ? (
        <h3>There was an error fetching the data</h3>
      ) : (
        <div>
          {trains && trains?.length > 0 && (
            <div className="selectors">
              <div className="selector">
                <h4>Filter by color:</h4>
                <select onChange={handleColorSelect}>
                  <option value="">All colors</option>
                  {trainColors.map((color, i) => (
                    <option key={i} value={color}>
                      {color?.charAt(0).toUpperCase() + color?.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="selector">
                <h4>Filter by service type:</h4>
                <select onChange={handleTypeSelect}>
                  <option value="">All service types</option>
                  {trainTypes.map((type, i) => (
                    <option key={i} value={type}>
                      {type.split(/(?=[A-Z])/).join(" ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="selector">
                <h4>Filter by car count:</h4>
                <select onChange={handleCarCountSelect}>
                  <option value="">All car counts</option>
                  {trainCarCounts.map((count, i) => (
                    <option key={i} value={count}>
                      {count.split(/(?=[A-Z])/).join(" ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {trainCarCounts?.length > 0 && (
            <div className="key">
              <h3>Car Count Key</h3>
              {trainCarCounts.map((count, i) => (
                <p
                  key={i}
                  style={{
                    backgroundColor: `rgb(${
                      220 -
                      (100 * trainCarCounts.indexOf(count.toString())) /
                        trainCarCounts.length
                    }, ${
                      220 -
                      (100 * trainCarCounts.indexOf(count.toString())) /
                        trainCarCounts.length
                    },${
                      220 -
                      (100 * trainCarCounts.indexOf(count.toString())) /
                        trainCarCounts.length
                    })`,
                  }}
                >
                  {count.split(/(?=[A-Z])/).join(" ")}{" "}
                  {parseInt(count) === 1 ? <span>Car</span> : <span>Cars</span>}
                </p>
              ))}
            </div>
          )}
          {trains.length > 0 ? (
            <>
              {filteredTrains.length ? (
                <>
                  {trainTypes &&
                    trainTypes.map((type, i) =>
                      renderTable(
                        filteredTrains.filter(
                          ({ ServiceType }) => ServiceType === type
                        ),
                        i
                      )
                    )}
                </>
              ) : (
                <h3>
                  There are no trains that match the chosen filter options.
                </h3>
              )}
            </>
          ) : (
            <h3>There is currently no train data.</h3>
          )}
        </div>
      )}
    </>
  );
};

export default ViewTrains;
