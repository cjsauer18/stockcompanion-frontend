import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { getOverlayDirection } from "react-bootstrap/esm/helpers";
import { IoMdClose } from "react-icons/io";
import { TbToggleRight, TbToggleLeft } from "react-icons/tb";

function NotificationTile({ isActive, toggleActive, alert, handleDelete }) {
  return (
    <Card
      className="notification-tile"
      style={{ width: "100%", height: "10%", marginBottom: "8px" }}
    >
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          {alert.stock} - {alert.desc}
        </div>
        <div>
          {alert.isActive ? (
            <TbToggleRight
              role={"button"}
              onClick={() => toggleActive(alert)}
              size={22}
              style={{ marginRight: 10 }}
            />
          ) : (
            <TbToggleLeft
              role={"button"}
              onClick={() => toggleActive(alert)}
              size={22}
              style={{ marginRight: 10 }}
            />
          )}
          <IoMdClose
            role={"button"}
            onClick={() => handleDelete(alert)}
            size={22}
          />
        </div>
      </Card.Body>
    </Card>
  );
}

export default NotificationTile;
