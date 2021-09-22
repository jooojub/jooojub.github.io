import React from "react";
import { makeStyles } from "@material-ui/styles";

import clsx from "clsx";

const useStyles = makeStyles({
  CategoriesContainer: {
    "& .tag-btn": {
      //   backgroundColor: "#343a40",
    //   backgroundColor: "#112D4E",
      backgroundColor: "#f5f5f5 !important",
      color: "#4f4f4f !important",
      fontSize: "14px",
      fontWeight: "700",
      marginRight: "0.5rem",
      marginBottom: "0.5rem",
      padding: "0.6rem",
      width: "fit-content",
      display: "inline-block",
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

function CategoriesComponent() {
  const classes = useStyles();

  return (
    <div className={clsx("mt-3 p-3", classes.CategoriesContainer)}>
      <div className="tag-btn">
          gcc options
          <span className="ml-2 badge bg-dark ms-2">23</span>
      </div>
      <div className="tag-btn">
          glibc<span className="ml-2 badge bg-dark ms-2">3</span>
      </div>

      <div className="tag-btn">
        linuxglibc<span className="ml-2 badge bg-dark ms-2">12</span>
      </div>
      <div className="tag-btn">
        test1glibc<span className="ml-2 badge bg-dark ms-2">51</span>
      </div>
      <div className="tag-btn">
        wformatglibc<span className="ml-2 badge bg-dark ms-2">77</span>
      </div>
      <div className="tag-btn">
        forceglibc<span className="ml-2 badge bg-dark ms-2">20</span>
      </div>
    </div>
  );
}

export default CategoriesComponent;
