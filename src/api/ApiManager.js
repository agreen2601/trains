import { useState } from "react";
import apiKey from "./ApiKey";

const ApiManager = () => {
  const [showFetchError, setShowFetchError] = useState(false);
  const [showTooManyRequestsError, setShowTooManyRequestsError] =
    useState(false);

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
        if (r.status === 429) {
          setShowTooManyRequestsError(true);
        } else if (r.status !== 200) {
          setShowFetchError(true);
        }
        return r.json();
      })
      .catch(() => setShowFetchError(true));
  };

  return {
    showFetchError,
    showTooManyRequestsError,
    fetchTrains,
  };
};

export default ApiManager;
