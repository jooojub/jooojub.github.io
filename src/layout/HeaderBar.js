import React from "react";
import { makeStyles } from "@material-ui/styles";

import clsx from "clsx";

const useStyles = makeStyles({
  headerContainer: {
    height: "400px",
    userSelect: "none",
    position: "relative",
    backgroundPosition: "center center",
    backgroundAttachment: "fixed",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },

  headerOverlay: {
    position: "absolute",
    zIndex: "10",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#0D1317",
    opacity: "80%",
  },
});

function HeaderBar(props) {
  const classes = useStyles();

  return (
    <>
      <div
        className={clsx("row", classes.headerContainer)}
        style={{
          backgroundImage: props.bgImage,
        }}
      >
        <div className={classes.headerOverlay} />
        <div className="col-1 col-md-2" />
        <div className="col">
          <div className="h-100 w-100 d-flex align-items-center">
            <div
              className="col-md-12"
              style={{ textAlign: "center", color: "#ffffff", zIndex: 11 }}
            >
              {props.mainComponent}
              <br />
              {props.subComponent}
              <br />
              <br />
              {props.subSecondComponent}
              <div className="mt-4 pt-4 text-center">{props.subButton}</div>
            </div>
          </div>
        </div>
        <div className="col-1 col-md-2 header-container-margin" />
      </div>
    </>
  );
}

export default HeaderBar;
