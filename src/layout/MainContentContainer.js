import React from "react";
import { makeStyles } from "@material-ui/styles";
import BlogCard from "../components/BlogCard";

import clsx from "clsx";

const useStyles = makeStyles({
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
  contentContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    // "@media (min-width:576px)": {
    //   // display: "none",
    // },
    // "@media (min-width:768px)": {
    //   minWidth: "760px",
    //   maxWidth: "760px",
    // },
    "@media (max-width: 1000px)": {
      minWidth: "500px",
      maxWidth: "500px",
    },
    "@media (min-width: 1200px)": {
      minWidth: "1200px",
      maxWidth: "1200px",
    },
  },
  contentTitle: {
    display: "flex",
    alignItems: "center",
    borderLeft: "5px solid #E2E8F0",
    paddingLeft: "20px",
  }
});

function MainContentContainer() {
  const classes = useStyles();

  return (
    // <div className={classes.contentContainer}>
    <div className="container">
      <div
        className="row"
        style={{ paddingTop: "3rem" }}
      >
        <div className="col-0 col-xl-1" />
        <div className="col">
          <div className="row text-justify d-flex">
            {/* contents */}
            <div className="col-md-8 col-12">
              <div className={classes.contentTitle}>
                <h4 className="title font-weight-bold mb-0">Recent Posts</h4>
              </div>
              <BlogCard />
              <BlogCard />
              <BlogCard />
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
            <div className="col-md-4 col-12">
            <div className={classes.contentTitle}>
                <h4 className="title font-weight-bold mb-0">Categories</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="col-0 col-xl-1" />
      </div>
    </div>
  );
}

export default MainContentContainer;
