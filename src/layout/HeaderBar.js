import React from "react";
import { makeStyles } from "@material-ui/styles";

import clsx from "clsx";

const useStyles = makeStyles({
  headerContainer: {
    height: "400px",
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
  }
});

function HeaderBar() {
  const classes = useStyles();

  return (
    <>
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
        <div className={classes.headerOverlay} />
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
                <a href="/profile" type="button" class="btn btn-primary hvr-wobble-vertical">show profile</a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-1 col-md-2 header-container-margin" />
      </div>
    </>
  );
}

export default HeaderBar;
