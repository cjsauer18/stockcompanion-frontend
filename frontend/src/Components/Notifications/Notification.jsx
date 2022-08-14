import React, { useState, useContext, useEffect, Fragment } from "react";
import Button from "react-bootstrap/Button";
import "./Notification.css";
import NotificationTile from "./NotificationTile";
import Form from "react-bootstrap/Form";
import { formatData } from "../../utility/loadChartData";
import Dashboard from "./Dashboard";

//This component tracks the price percentage change every 1 minute, 5 minute, 30 minute, 1 hour through use of a suite of interval buttons.

//Helper function, compares alerts to a newly created alert to ensure we dont have duplicate alerts.
function contains(obj, alerts) {
  var i;
  for (i = 0; i < alerts.length; i++) {
    if (obj.stock === alerts[i].stock && obj.interval === alerts[i].interval) {
      return true;
    }
  }
  return false;
}

function Notification({ handleClearDashboard }) {
  const [alerts, setAlerts] = useState([]);
  const [interval, setInterval] = useState({
    name: "1 min",
    interval: 60,
  });

  useEffect(() => {
    //fetches the most recent alerts to load back into state.
    const alerts = JSON.parse(localStorage.getItem("alerts")) || [];
    setAlerts(alerts);
  }, []);

  const handleDelete = (alert) => {
    const index = alerts.indexOf(alert);
    if (alerts.length === 1) {
      localStorage.removeItem("alerts");
      setAlerts([]);
    } else {
      const newAlerts = new Array(...alerts);
      newAlerts.splice(index, 1);
      localStorage.setItem("alerts", JSON.stringify(newAlerts));
      setAlerts(newAlerts);
    }
  };

  const toggleActive = async (alert) => {
    if (alert.isActive) {
      alert.isActive = false;
    } else if (!alert.isActive) {
      alert.isActive = true;
      alert.startTime = Math.floor(Date.now() / 1000);
      try {
        //assures the toggled alert has the most recent data.
        alert.startPrice = await fetchPrice(
          `http://localhost:5000/members?ticker=${
            alert.stock
          }&start=${Math.floor(Date.now() / 1000)}&end=${Math.floor(
            Date.now() / 1000
          )}&interval=1m&range=5m`
        );
      } catch (Exception) {
        console.log(Exception);
      }
    }
    const newState = new Array(...alerts);
    setAlerts(newState);
    localStorage.setItem("alerts", JSON.stringify(alerts));
  };

  const fetchPrice = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    const formattedData = formatData(data);
    //setIsLoading(true);
    //   console.log("lets see..", formattedData[0].y[0]);
    //setIsLoadingFetch(true)
    console.log("fetching:", formattedData);

    return Math.floor(formattedData[formattedData.length - 1].y[0]);
  };

  //This function handles the set notification functuoanlity. It retrieves the current stock ticker that the user has loaded up, and
  //creates an alert in state. The alert can be toggled through the notification tile component where it has passed down function handles to the child component (tile)
  //to toggle active or remove the alert. The alert is handled in the dashboard component.

  const handleSetNotification = (interval) => {
    const currentStock = localStorage.getItem("ACTIVE_TICKER") || "";
    console.log("fetching ticker:", currentStock);

    //console.log(interval);
    if (!interval) {
      return;
    }
    if (currentStock === "") return;

    const newAlert = {
      stock: currentStock,
      interval: interval.interval,
      desc: interval.name,
      isActive: false,
      id: alerts.length,
      startPrice: "",
      startTime: Date.now() / 1000,
    };

    if (alerts.length === 0) {
      const newAlerts = new Array(newAlert);
      setAlerts(newAlerts);
      localStorage.setItem("alerts", JSON.stringify(newAlerts)); //this does not return in time when the price has fetched.
    } else if (!contains(newAlert, alerts)) {
      const newAlerts = new Array(...alerts);
      newAlerts.push(newAlert);
      setAlerts(newAlerts);
      localStorage.setItem("alerts", JSON.stringify(newAlerts));
    }
  };

  const intervals = [
    {
      name: "1 min",
      interval: 60,
    },
    {
      name: "5 min",
      interval: 300,
    },
    {
      name: "10 min",
      interval: 600,
    },
    {
      name: "30 min",
      interval: 18000,
    },
    {
      name: "1 hr",
      interval: 36000,
    },
  ];

  return (
    <Fragment>
      <p className="font-12 text-white mb-2">Notifications</p>
      <Form className="interval-change-form">
        <div className="d-flex justify-content-between align-items-center">
          <Form.Select
            onChange={(e) => setInterval(JSON.parse(e.target.value))}
            className="me-2"
          >
            {intervals.map((interval, i) => {
              return (
                <option
                  value={JSON.stringify(interval)}
                  key={i}
                  className="interval-btn me-2 my-3"
                >
                  {interval.name}
                </option>
              );
            })}
          </Form.Select>

          <Button
            className="set-notification"
            onClick={() => handleSetNotification(interval)}
          >
            Set
          </Button>
        </div>
      </Form>

      <Dashboard />

      <div className="active-notification-pannel mb-3">
        {alerts.length === 0 ? (
          <div className="text-white">No notifications set</div>
        ) : (
          alerts.map((alert, i) => (
            <NotificationTile
              key={i}
              isActive={alert.isActive}
              toggleActive={toggleActive}
              alert={alert}
              handleDelete={handleDelete}
            />
            // <button></button> toggle active, maybe remove button here
          ))
        )}
      </div>
    </Fragment>
  );
}

export default Notification;
