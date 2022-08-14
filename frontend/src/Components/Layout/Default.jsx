import React, { Fragment } from "react";
import "./Default.css";

const Default = (props) => {
  return (
    <Fragment>
      <div className="container">{props.children}</div>
    </Fragment>
  );
};

export default Default;
