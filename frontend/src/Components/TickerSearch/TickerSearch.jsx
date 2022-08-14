import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import "./tickersearch.css";

const TickerSearch = (props) => {
  const [tickerData, setTickerData] = useState([]);
  const [activeTicker, setActiveTicker] = useState(false);
  const [updateStockList] = useState(props); //takes a handle from parent homepage component.

  const changeHandler = async (e) => {
    try {
      const SEARCH_API = await fetch(
        `http://localhost:5000/search?keyword=${e.target.value}`
      );
      const response = await SEARCH_API.json();
      console.log("[DEBUG]: ", response.data);
      setTickerData(response.data);
    } catch (error) {
      //setTickerData([]); //Default
      console.log(error);
    }
  };

  const tickerHandler = (ticker) => {
    localStorage.setItem("ACTIVE_TICKER", ticker.symbol);
    window.location.reload();
  };

  useEffect(() => {
    changeHandler();
  });

  return (
    <div className="container my-4">
      <Form className="d-flex mb-5">
        <Form.Control
          type="search"
          placeholder="Enter Stock Ticker"
          className="me-2"
          aria-label="Search"
          onChange={changeHandler}
        />
        <Button className="btn-secondary">
          <BiSearch />
        </Button>
      </Form>
      {tickerData && tickerData.length !== 0 && (
        <Card className="p-3 shadow-sm ticker-search__card">
          <ul className="ticker-search__list">
            {tickerData.map((ticker) => (
              <li
                className="d-flex justify-content-between ticker-search__list-item"
                key={ticker.tickerId}
                onClick={() => tickerHandler(ticker)}
              >
                <span>{ticker.name}</span>
                <b>{ticker.symbol}</b>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default TickerSearch;
