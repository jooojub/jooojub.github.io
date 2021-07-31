import React from "react";
import { makeStyles } from "@material-ui/styles";
import HeaderNavBar from "./HeaderNavBar";
import HeaderBar from "./HeaderBar";
import Footer from "./Footer";

import clsx from "clsx";

const useStyles = makeStyles({
  primaryBtn: {
    backgroundColor: "#30475E",
    borderRadius: "1rem",
    fontSize: "11px",
    // padding: "1rem",
    // paddingLeft: "1rem",
    // paddingRight: "1rem",
    "&:hover": {
      backgroundColor: "#0D1317",
      cursor: "pointer",
      transition: "all 0.5s linear",
    },
  },
  contentContainer: {
    display: "none",
    "@media (min-width:576px)": {
      display: "none",
    },
    "@media (min-width:768px)": {
      display: "block",
    },
    "@media (min-width:992px)": {
      display: "block",
    },
    "@media (min-width: 1200px)": {
      display: "block",
    },
  },
  contentSidebarContainer: {
    minWidht: "250px",
    maxWidth: "250px",
    display: "none",
    "@media (min-width:576px)": {
      display: "none",
    },
    "@media (min-width:768px)": {
      display: "block",
    },
    "@media (min-width:992px)": {
      display: "block",
    },
    "@media (min-width: 1200px)": {
      display: "block",
    },
  },
});

function MainPage() {
  const classes = useStyles();

  return (
    <>
      <HeaderNavBar />
      <HeaderBar />
      <div
        className="row"
        style={{ background: "#F8F8F8", paddingTop: "4rem" }}
      >
        <div className={clsx("col-1", classes.contentContainer)} />
        <div className="col">
          <div className="row text-justify d-flex">
            {/* contents */}
            <div className="col ml-4">
              <h4 className="title font-weight-bold">Recently Posts</h4>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
            {/* side-contents */}
            <div className={clsx("col", classes.contentSidebarContainer)}></div>
          </div>
        </div>
        <div className={clsx("col-1", classes.contentContainer)} />
      </div>
      <Footer />
    </>
  );
}

export default MainPage;
