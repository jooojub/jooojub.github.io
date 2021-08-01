import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Navbar } from "react-bootstrap";
import { Avatar } from "@material-ui/core";

const useStyles = makeStyles({
  headerNavBar: {
    boxShadow: "none",
    backgroundColor: "#0D1317",
    // marginBottom: "4rem",
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
});

function HeaderNavBar() {
  const classes = useStyles();

  return (
    <Navbar className={classes.headerNavBar} variant="dark">
      <div className="col-1 d-none d-md-block" />
      <div className="col d-flex align-items-center">
        <Navbar.Brand>
          <Avatar alt="jooojub" src="/assets/images/avatars/toto.jpg" />
        </Navbar.Brand>
        <Navbar.Brand href="#home" className={classes.logo}>
          <h4 className="title font-weight-bold mb-0">Jooojub</h4>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="justify-content-end align-items-center">
          <Navbar.Brand className={classes.menu}>Profile</Navbar.Brand>
          <Navbar.Brand className={classes.menu}>Posts</Navbar.Brand>
        </Navbar.Collapse>
      </div>
      <div className="col-1 d-none d-md-block" />
    </Navbar>
  );
}

export default HeaderNavBar;
