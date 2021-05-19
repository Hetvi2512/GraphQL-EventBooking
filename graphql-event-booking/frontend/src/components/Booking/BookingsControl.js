import React, { useState } from "react";

import "./BookingControls.css";
export default function BookingsControl(props) {
  return (
    <div className="bookings-control">
      <button
        className={props.activeOutputType === "List" ? "active" : ""}
        onClick={() => props.onChange("List")}
      >
        List
      </button>
      <button
        className={props.activeOutputType === "Chart" ? "active" : ""}
        onClick={() => props.onChange("Chart")}
      >
        Chart
      </button>
    </div>
  );
}
