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
        <h8>
          gcc options
          <span class="ml-2 badge bg-dark ms-2">23</span>
        </h8>
      </div>
      <div className="tag-btn">
        <h8>
          glibc<span class="ml-2 badge bg-dark ms-2">3</span>
        </h8>
      </div>

      <div className="tag-btn">
        <h8>linuxglibc<span class="ml-2 badge bg-dark ms-2">12</span></h8>
      </div>
      <div className="tag-btn">
        <h8>test1glibc<span class="ml-2 badge bg-dark ms-2">51</span></h8>
      </div>
      <div className="tag-btn">
        <h8>wformatglibc<span class="ml-2 badge bg-dark ms-2">77</span></h8>
      </div>
      <div className="tag-btn">
        <h8>forceglibc<span class="ml-2 badge bg-dark ms-2">20</span></h8>
      </div>
    </div>
  );
}

export default CategoriesComponent;
