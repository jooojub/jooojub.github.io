import React from "react";
import { makeStyles } from "@material-ui/styles";

import clsx from "clsx";

const useStyles = makeStyles({
  ArchiveContainer: {
    "& .archive-btn": {
      //   backgroundColor: "#343a40",
      //   backgroundColor: "#112D4E",
      backgroundColor: "#f5f5f5 !important",
      color: "#4f4f4f !important",
      fontSize: "14px",
      fontWeight: "700",
      marginRight: "0.5rem",
      marginBottom: "0.5rem",
      padding: "0.6rem",
      textAlign: "center",
      display: "inline-block",
      width: "135px",
      "&:hover": {
        // backgroundColor: "#007bff",
        // backgroundColor: "#112D4E",
        cursor: "pointer",
        transition: "all 0.5s linear",
      },
    },
    // "& .badge": {
    //   backgroundColor: "#3E92CC !important",
    // },
  },
});

function ArchiveComponent() {
  const classes = useStyles();

  return (
    <div className={clsx("mt-3 p-3", classes.ArchiveContainer)}>
      <div className="archive-btn">
        <h8>January 2021</h8>
      </div>
      <div className="archive-btn">
        <h8>February 2021</h8>
      </div>
      <div className="archive-btn">
        <h8>March 2021</h8>
      </div>
      <div className="archive-btn">
        <h8>April 2021</h8>
      </div>
      <div className="archive-btn">
        <h8>May 2021</h8>
      </div>
      <div className="archive-btn">
        <h8>June 2021</h8>
      </div>
    </div>
  );
}

export default ArchiveComponent;
