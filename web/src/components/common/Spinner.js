import React from "react";
import spinner from "../../assets/spinner.gif";
const Spinner = () => {
  return (
    <img
      style={{ width: "200px", margin: "auto", display: "block" }}
      src={spinner}
      alt="Loading"
    />
  );
}

export default Spinner
