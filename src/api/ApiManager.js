import { useState } from "react";
import apiKey from "./ApiKey";

const ApiManager = () => {
  const [showFetchError, setShowFetchError] = useState(false);

  const fetchTrains = () => {
    return fetch(
      "https://api.wmata.com/TrainPositions/TrainPositions?contentType=json",
      {
        method: "GET",
        headers: {
          api_key: apiKey,
        },
      }
    )
      .then((r) => {
        r.status !== 200 && setShowFetchError(true);
        return r.json();
      })
      .catch(() => setShowFetchError(true));
  };

  return {
    showFetchError,
    fetchTrains,
  };
};

export default ApiManager;
