import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Button } from "@material-ui/core";
import HeaderNavBar from "./HeaderNavBar";
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
  headerContainer: {
    background: "#fffff",
    height: "400px",
    // marginTop: "20px",
    "@media (max-width:576px)": {
      // "& .header-container-margin": {
      //   display: "block",
      // },
      "& .header-container": {
        position: "relative",
      },
      "& .header-container-text": {
        padding: "2rem",
      },
      "& .header-container-image": {
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "-1",
        padding: "0rem",
      },
    },
    "@media (min-width:576px)": {
      // "& .header-container-margin": {
      //   display: "block",
      // },
      "& .header-container": {
        position: "relative",
      },
      "& .header-container-text": {
        padding: "2rem",
      },
      "& .header-container-image": {
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "-1",
        padding: "0rem",
      },
    },
    "@media (min-width:768px)": {
      // "& .header-container-margin": {
      //   display: "block",
      // },
      "& .header-container": {
        position: "absolute",
        flexDirection: "row",
        display: "flex",
        flexWrap: "wrap",
        marginRight: "-15px",
        marginLeft: "-15px",
      },
      "& .header-container-text": {
        padding: "2rem",
      },
      "& .header-container-image": {
        position: "relative",
        top: "0",
        left: "0",
        padding: "3rem",
      },
    },
    "@media (min-width:992px)": {
      // "& .header-container-margin": {
      //   display: "block",
      // },
      "& .header-container": {
        position: "absolute",
        flexDirection: "row",
        display: "flex",
        flexWrap: "wrap",
        marginRight: "-15px",
        marginLeft: "-15px",
      },
      "& .header-container-text": {
        padding: "2rem",
      },
      "& .header-container-image": {
        position: "relative",
        top: "0",
        left: "0",
        padding: "3rem",
      },
    },
    "@media (min-width: 1200px)": {
      // "& .header-container-margin": {
      //   display: "block",
      // },
      "& .header-container": {
        position: "absolute",
        flexDirection: "row",
        display: "flex",
        flexWrap: "wrap",
        marginRight: "-15px",
        marginLeft: "-15px",
      },
      "& .header-container-text": {
        padding: "2rem",
      },
      "& .header-container-image": {
        position: "relative",
        top: "0",
        left: "0",
        padding: "1rem",
      },
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

  test: {
    position: "absolute",
    zIndex: "10",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#0D1317",
    opacity: "80%",
  }
});

function MainPage() {
  const classes = useStyles();

  return (
    <>
      <HeaderNavBar />
      <div
        className={clsx("row", classes.headerContainer)}
        style={{
          userSelect: "none",
          position: "relative",
          backgroundPosition: "center center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundImage:
            "url(https://i.picsum.photos/id/1040/4496/3000.jpg?hmac=kvZONlBpTcZ16PuE_g2RWxlicQ5JKVq2lqqZndfafBY)",
        }}
      >
        <div className={classes.test} />
        <div className="col-1 col-md-2" />
        <div className="col">
          <div className="h-100 w-100 d-flex align-items-center">
            <div
              className="col-md-12"
              style={{ textAlign: "center", color: "#ffffff", zIndex: 11, }}
            >
              <font
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "60px",
                  fontWeight: "600",
                  textShadow: "1px 1px #000000",
                }}
              >
                Hello ;)
              </font>
              <br />
              <font
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "24px",
                  fontWeight: "600",
                  textShadow: "1px 1px #000000",
                }}
              >
                please take a break!
              </font>
              <br />
              <br />
              <font
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  fontWeight: "400",
                  textShadow: "1px 1px #000000",
                }}
              >
                I'm system S/W Engineers. However, interested in many fields.
                Let's study together!
              </font>
              <div className="mt-4 pt-4 text-center">
                <a href="#" type="button"  class="btn btn-primary hvr-wobble-vertical">show profile</a>
              </div>
            </div>
            {/* <div className="col-md-7 w-100 text-right h-100 header-container-image">
                <img style={{borderRadius: "8px", boxShadow: "0 13px 27px -5px hsl(240deg 30% 28% / 25%), 0 8px 16px -8px hsl(0deg 0% 0% / 30%), 0 -6px 16px -6px hsl(0deg 0% 0% / 3%)"}} src="https://picsum.photos/id/237/400/300" />
            </div> */}
          </div>
        </div>
        <div className="col-1 col-md-2 header-container-margin" />
      </div>
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
