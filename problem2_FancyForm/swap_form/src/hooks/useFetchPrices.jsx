import { useState, useEffect } from "react";

const useFetchPrices = (url) => {
  const [tokenPrices, setTokenPrices] = useState({});
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const prices = {};
        data.forEach((item) => {
          prices[item.currency] = item.price;
        });
        setTokenPrices(prices);
        setTokens(Object.keys(prices));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [url]);

  return { tokenPrices, tokens };
};

export default useFetchPrices;
