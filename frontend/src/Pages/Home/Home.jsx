import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import ApexChart from "../../Chart/ApexChart";
import Default from "../../Components/Layout/Default";
import Stock from "../../Components/stock";
import Notification from "../../Components/Notifications/Notification";

import "./Home.css";
import TickerSearch from "../../Components/TickerSearch/TickerSearch";

const Home = () => {
  const intervals = [
    {
      name: "1M",
    },
    {
      name: "5M",
    },
    {
      name: "30M",
    },
  ];

  const [isInWatchList, setIsInWatchList] = useState(false);
  const [changeInterval, setChangeInterval] = useState("1m");
  const [changeRange, setChangeRange] = useState("1d");

  const storedTicker = localStorage.getItem("ACTIVE_TICKER") || "TSLA";
  localStorage.setItem("ACTIVE_TICKER", storedTicker);
  const stock = new Stock(storedTicker);

  const handleInterval = (interval) => {
    setChangeInterval(interval);
  };

  //APEX CHART X AXIS VALUES ARE BOGUS
  //Y AXIS VALUES NEED TO BE ROUNDED

  const handleRange = (range) => {
    setChangeRange(range);
  };

  const handleWatchlist = () => {
    try {
      const storedTicker = localStorage.getItem("ACTIVE_TICKER") || "TSLA";
      var tickersWatchList =
        JSON.parse(localStorage.getItem("tickersWatchList")) || [];

      const indexOfTicker = tickersWatchList.indexOf(storedTicker);
      if (indexOfTicker !== -1) {
        tickersWatchList.splice(indexOfTicker, 1);
        setIsInWatchList(false);
      } else {
        tickersWatchList.push(storedTicker);
        setIsInWatchList(true);
      }
      console.log(tickersWatchList);

      localStorage.setItem(
        "tickersWatchList",
        JSON.stringify(tickersWatchList)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    stock.getData();
    console.log("[HOME: DEBUG] Retreiving Data");
  });

  useEffect(() => {
    var tickersWatchList =
      JSON.parse(localStorage.getItem("tickersWatchList")) || [];
    const indexOfTicker = tickersWatchList.indexOf(storedTicker);
    if (indexOfTicker !== -1) {
      setIsInWatchList(true);
    }
  }, []);

  return (
    <Fragment>
      <Default>
        <TickerSearch />
        <div className="container my-4">
          <div className="row">
            <div className="col-md-3">
              <Notification />
            </div>

            <div className="col-md-9">
              <div className="d-flex justify-content-between">
                <div className="select-interval">
                  <p className="mb-1 font-12 text-white">Interval</p>
                  <div className="mb-3">
                    {intervals.map((interval, i) => (
                      <span
                        className="interval"
                        onClick={() => {
                          handleInterval(interval.name.toLocaleLowerCase());
                        }}
                        style={{
                          background:
                            changeInterval === interval.name.toLocaleLowerCase()
                              ? "#0a063e"
                              : "white",
                          color:
                            changeInterval === interval.name.toLocaleLowerCase()
                              ? "white"
                              : "#0a063e",
                        }}
                        key={i}
                      >
                        {interval.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <ApexChart
                Stock={stock}
                range={changeRange}
                interval={changeInterval}
              />
              <div className="add-watchlist mt-4">
                <button
                  className="btn btn-secondary me-3"
                  onClick={handleWatchlist}
                >
                  {!isInWatchList
                    ? "Add To Watchlist"
                    : "Remove from Watchlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Default>
    </Fragment>
  );
};

export default Home;
