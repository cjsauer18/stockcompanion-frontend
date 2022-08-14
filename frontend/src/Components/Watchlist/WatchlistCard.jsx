import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

import "./watchlist.css";

const WatchlistCard = () => {
  const [trades, setTrades] = useState([]);

  const loadData = async () => {
    try {
      const endTime = Math.round(Date.now() / 1000, 0);
      const starTime = endTime - 300;
      const tickersWatchList =
        localStorage.getItem("tickersWatchList") || JSON.stringify([]);

      const URL = `http://localhost:5000/watchlist?tickers=${tickersWatchList}&start=${starTime}&end=${endTime}&interval=1m&range=1d`;
      const responseParse = await fetch(URL);

      const data = await responseParse.json();

      var tickerList = JSON.parse(tickersWatchList);
      // console.log('tickerList',tickerList)

      var _trades = [];

      tickerList.map((tl) => {
        var price = Object.values(
          data[tickerList.length === 1 ? "Adj Close" : `('Adj Close', '${tl}')`]
        );
        price = price[price.length - 1];

        var open = Object.values(
          data[tickerList.length === 1 ? "Open" : `('Open', '${tl}')`]
        );
        open = open[open.length - 1];

        var close = Object.values(
          data[tickerList.length === 1 ? "Close" : `('Close', '${tl}')`]
        );
        close = close[close.length - 1];

        var prClose = Object.values(
          data[tickerList.length === 1 ? "Close" : `('Close', '${tl}')`]
        );
        prClose = prClose[prClose.length - 2];

        var high = Object.values(
          data[tickerList.length === 1 ? "High" : `('High', '${tl}')`]
        );
        high = high[high.length - 1];

        var low = Object.values(
          data[tickerList.length === 1 ? "Low" : `('Low', '${tl}')`]
        );
        low = low[low.length - 1];

        _trades.push({
          symbol: tl,
          name: tl,
          price: price.toFixed(2),
          change: (price - prClose).toFixed(2),
          changePr: (((price - prClose) * 100) / price).toFixed(2) + "%",
          open: open.toFixed(2),
          close: close.toFixed(2),
          high: high.toFixed(2),
          low: low.toFixed(2),
        });
      });

      setTrades(_trades);
    } catch (error) {
      console.log("E", error);
    }
  };

  // const removeTrades = (i) => {
    
  // };

  // const isTesla = localStorage.getItem("Tesla");

  useEffect(() => {
    loadData();
    var intvl = setInterval(() => {
      loadData();
    }, 3000);

    return () => {
      if (intvl) {
        clearInterval(intvl);
      }
    };
  }, []);

  return (
    <Card className="p-3 mb-4 shadow-sm watchlist-card">
      <Table striped>
        <thead>
          <tr>
            <th>Symbol</th>
            {/* <th>Name</th> */}
            <th>Price</th>
            <th>Change</th>
            <th>%Change</th>
            <th>Open</th>
            <th>Close</th>
            <th>High</th>
            <th>Low</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {trades.map((trade, i) => (
            <tr key={i}>
              <td>{trade.symbol}</td>
              {/* <td>NASDAQ</td> */}
              <td
                className={+trade.change > 0 ? "text-success" : "text-danger"}
              >
                {trade.price}
              </td>
              <td
                className={+trade.change > 0 ? "text-success" : "text-danger"}
              >
                {trade.change}
              </td>
              <td
                className={+trade.change > 0 ? "text-success" : "text-danger"}
              >
                {trade.changePr}
              </td>
              <td>{trade.open}</td>
              <td>{trade.close}</td>
              <td>{trade.high}</td>
              <td>{trade.low}</td>
              {/* <td
                className="text-primary"
                onClick={() => removeTrades(i)}
                role={"button"}
              >
                Remove
              </td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default WatchlistCard;
