import React from "react";
import { makeStyles } from "@material-ui/styles";
import HeaderNavBar from "./HeaderNavBar";
import HeaderBar from "./HeaderBar";
import Footer from "./Footer";
import MainContentContainer from "./MainContentContainer";

const useStyles = makeStyles({
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
      <MainContentContainer/>
      <Footer />
    </>
  );
}

export default MainPage;
