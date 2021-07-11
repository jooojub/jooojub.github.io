import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Navbar } from "react-bootstrap";
import { Avatar } from "@material-ui/core";
import { MDBFooter, MDBContainer, MDBRow, MDBCol } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedinIn,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";

import clsx from "clsx";

const useStyles = makeStyles({
  headerNavBar: {
    boxShadow: "none",
    backgroundColor: "#0D1317",
  },
  headerContainer: {
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
  logo: {
    color: "#000000",
    userSelect: "none",
  },
  menu: {
    color: "#444444",
    margin: "10px",
    fontSize: "17px",
    fontWeight: 700,
    marginTop: "10px",
    borderBottom: "3px solid transparent",
    userSelect: "none",
    "&:hover": {
      cursor: "pointer",
      borderBottom: "3px solid #007bff",
      transition: "all 0.5s linear",
      borderRadius: "20%",
    },
  },
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
        backgroundColor: "#007bff",
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

function MainPage() {
  const classes = useStyles();

  return (
    <>
      <Navbar className={classes.headerNavBar} variant="dark">
        <div className={clsx("col-2", classes.headerContainer)} />
        <div className="col-8 d-flex align-items-center">
          <Navbar.Brand>
            <Avatar alt="jooojub" src="/assets/images/avatars/toto.jpg" />
          </Navbar.Brand>
          <Navbar.Brand href="#home" className={classes.logo}>
            <h4 className="title font-weight-bold mb-0">Jooojub</h4>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse className="justify-content-end align-items-center">
            <Navbar.Brand className={classes.menu}>Home</Navbar.Brand>
            <Navbar.Brand className={classes.menu}>About Me</Navbar.Brand>
            <Navbar.Brand className={classes.menu}>Posts</Navbar.Brand>
          </Navbar.Collapse>
        </div>
      </Navbar>
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
      <MDBFooter
        className={clsx("font-small pt-4 mt-4", classes.footerContainer)}
      >
        <MDBContainer fluid className={clsx("text-center text-md-left")}>
          <MDBRow>
            <MDBCol md="2" />
            <MDBCol md="2">
              <h1 className="title font-weight-bold">Jooojub</h1>
              <p>
                <h7>
                  <font color="#A9AFB3">
                    Here you can use rows and columns here to organize your
                    footer content.
                  </font>
                </h7>
              </p>
            </MDBCol>
            <MDBCol md="2">
              <h6 className="title font-weight-bold pb-3">Categories</h6>
              <table
                className={clsx(
                  "table table-borderless",
                  classes.footerCategoriesTable
                )}
              >
                <tr>
                  <td class="p-0 pr-4 pb-1 font-weight-bold">
                    <h7 className="title">toolchain</h7>
                  </td>
                  <td class="p-0 pr-4 pb-1 font-weight-bold">
                    <h7 className="title">glibc</h7>
                  </td>
                </tr>
                <tr>
                  <td class="p-0 pr-4 pb-1 font-weight-bold">
                    <h7 className="title">Linux</h7>
                  </td>
                  <td class="p-0 pr-4 pb-1 font-weight-bold">
                    <h7 className="title">test</h7>
                  </td>
                </tr>
              </table>
            </MDBCol>
            <MDBCol md="2" className="mb-4">
              <h6 className="title font-weight-bold pb-3">Browse by Tag</h6>
              <div
                className={clsx("flex flex-wrap", classes.footerTagContainer)}
              >
                <div className="tag-btn">
                  <h8>gcc options</h8>
                </div>
                <div className="tag-btn">
                  <h8>glibc</h8>
                </div>

                <div className="tag-btn">
                  <h8>linux</h8>
                </div>
                <div className="tag-btn">
                  <h8>test1</h8>
                </div>
                <div className="tag-btn">
                  <h8>wformat</h8>
                </div>
                <div className="tag-btn">
                  <h8>force</h8>
                </div>
              </div>
            </MDBCol>
            <MDBCol md="2">
              <h6 className="title font-weight-bold pb-3">Recent Post</h6>
              <p>
                <h7>
                  <font color="#A9AFB3">
                    Here you can use rows and columns here to organize your
                    footer content.
                  </font>
                </h7>
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <div className={clsx("text-center py-3", classes.footerSubContainer)}>
          <MDBContainer fluid>
            <MDBRow>
              <MDBCol md="2" />
              <MDBCol md="6" className={clsx("d-flex align-items-center h7")}>
                &copy; {new Date().getFullYear()} - All Right Reserved. Designed
                and Developed by jooojub
              </MDBCol>
              <MDBCol md="2" className={clsx("d-flex align-items-right")}>
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
              <MDBCol md="2" />
            </MDBRow>
          </MDBContainer>
        </div>
      </MDBFooter>
    </>
  );
}

export default MainPage;
