import React from "react";
import { makeStyles } from "@material-ui/styles";
import BlogCard from "../components/BlogCard";
import CategoriesComponent from "../components/CategoriesComponent";
import ArchiveComponent from "../components/ArchiveComponent";
import ContentTitle from "../components/ContentTitle";
import SearchInBlog from "../components/SearchInBlog";

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
});

function MainContentContainer() {
  const classes = useStyles();

  return (
    // <div className={classes.contentContainer}>
    <div className="container">
      <div className="row" style={{ paddingTop: "3rem" }}>
        <div className="col-0 col-xl-1" />
        <div className="col">
          <div className="row text-justify d-flex">
            {/* contents */}
            <div className="col-md-8 col-12">
              <ContentTitle value={"Recent Posts"}/>
              <div className="m-2">
                <BlogCard />
                <BlogCard />
                <BlogCard />
                <br />
              </div>
            </div>
            {/* side-contents */}
            <div className="col-md-4 col-12">
              <ContentTitle value={"Search in blog"}/>
              <div className="m-2">
                <SearchInBlog />
              </div>
              <ContentTitle value={"Categories"}/>
              <div className="m-2">
                <CategoriesComponent />
              </div>
              <ContentTitle value={"Archive"}/>
              <div className="m-2">
                <ArchiveComponent />
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
