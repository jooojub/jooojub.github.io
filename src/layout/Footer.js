import React from "react";
import { makeStyles } from "@material-ui/styles";
import { MDBFooter, MDBContainer, MDBRow, MDBCol } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedinIn,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";

import clsx from "clsx";

const useStyles = makeStyles({
  footerContainer: {
    backgroundColor: "#0D1317",
    userSelect: "none",
  },
  footerSubContainer: {
    backgroundColor: "#000000",
    color: "#A9AFB3",
    fontSize: "12px",
  },
  footerCategoriesTable: {
    color: "#ffffff",
  },
  footerTagContainer: {
    "& .tag-btn": {
      backgroundColor: "#343a40",
      color: "#ffffff",
      fontSize: "14px",
      fontWeight: "600",
      marginRight: "0.5rem",
      marginBottom: "0.5rem",
      padding: "0.4rem",
      width: "fit-content",
      display: "inline-block",
      "&:hover": {
        backgroundColor: "#112D4E",
        cursor: "pointer",
        transition: "all 0.5s linear",
      },
    },
  },
  footerIcon: {
    "&:hover": {
      color: "#ffffff",
      cursor: "pointer",
      transition: "all 0.5s linear",
    },
  },
});

function Footer() {
  const classes = useStyles();

  return (
    <MDBFooter
      className={clsx("font-small pt-4 mt-4", classes.footerContainer)}
    >
      <MDBContainer fluid className={clsx("text-center text-md-left")}>
        <MDBRow>
          <MDBCol md="1" />
          <MDBCol lg="3" md="3">
            <h1 className="title font-weight-bold">Jooojub</h1>
            <p>
              <font color="#A9AFB3">
                Here you can use rows and columns here to organize your footer
                content.
              </font>
            </p>
          </MDBCol>
          {/* <MDBCol md="2">
            <h6 className="title font-weight-bold pb-3">Categories</h6>
            <table
              className={clsx(
                "table table-borderless",
                classes.footerCategoriesTable
              )}
            >
              <tbody>
                <tr>
                  <td className="p-0 pr-4 pb-1">
                    <p className="title font-weight-bold">toolchain</p>
                  </td>
                  <td className="p-0 pr-4 pb-1">
                    <p className="title font-weight-bold">glibc</p>
                  </td>
                </tr>
                <tr>
                  <td className="p-0 pr-4 pb-1">
                    <p className="title font-weight-bold">Linux</p>
                  </td>
                  <td className="p-0 pr-4 pb-1">
                    <p className="title font-weight-bold">test</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </MDBCol> */}
          <MDBCol md="4" className="mb-4">
            <h6 className="title font-weight-bold pb-3">
              Browse by Categories
            </h6>
            <div className={clsx("flex flex-wrap", classes.footerTagContainer)}>
              <div className="tag-btn">gcc options</div>
              <div className="tag-btn">glibc</div>
              <div className="tag-btn">linux</div>
              <div className="tag-btn">test1</div>
              <div className="tag-btn">wformat</div>
              <div className="tag-btn">force</div>
            </div>
          </MDBCol>
          <MDBCol lg="3" md="3">
            <h6 className="title font-weight-bold pb-3">Recent Post</h6>
            <p>
              <font color="#A9AFB3">
                Here you can use rows and columns here to organize your footer
                content.
              </font>
            </p>
          </MDBCol>
          <MDBCol md="1" />
        </MDBRow>
      </MDBContainer>
      <div className={clsx("text-center py-3", classes.footerSubContainer)}>
        <MDBContainer fluid>
          <MDBRow>
            <MDBCol md="1" />
            <MDBCol md="8" className={clsx("d-flex align-items-center")}>
              &copy; {new Date().getFullYear()} - All Right Reserved. Designed
              and Developed by jooojub
            </MDBCol>
            <MDBCol md="2" className={clsx("d-flex justify-content-end")}>
              <FontAwesomeIcon
                icon={faGithub}
                className={clsx("m-2 h5", classes.footerIcon)}
              />
              <FontAwesomeIcon
                icon={faLinkedinIn}
                className={clsx("m-2 h5", classes.footerIcon)}
              />
              <FontAwesomeIcon
                icon={faGoogle}
                className={clsx("m-2 h5", classes.footerIcon)}
              />
            </MDBCol>
            <MDBCol md="1" />
          </MDBRow>
        </MDBContainer>
      </div>
    </MDBFooter>
  );
}

export default Footer;
