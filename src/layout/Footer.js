import React from "react";
import { makeStyles } from "@material-ui/styles";
import { MDBFooter, MDBContainer, MDBRow, MDBCol } from "mdbreact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedinIn,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";

import PostParser from "../api/PostParser";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

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
      "&:hover &:focus": {
        backgroundColor: "#112D4E",
        cursor: "pointer",
        transition: "all 0.5s linear",
      },
    },
  },
  footerIcon: {
    color: "#A9AFB3",
    "&:hover &:focus": {
      color: "#ffffff",
      cursor: "pointer",
      transition: "all 0.5s linear",
    },
  },
  tooltip: {
    "& .tooltip-inner": {
      backgroundColor: "#213447",
      color: "white",
      margin: "0",
    },
  },
});

function tags() {
  const post_parser = new PostParser();
  const jsx = [];

  post_parser.getTags().forEach((tag) => {
    jsx.push(
      <Link key={`${tag.value}`} to={`/posts/${tag.value}`}>
        <div className="tag-btn">{post_parser.tagToString(tag.value)}</div>
      </Link>
    );
  });

  return jsx;
}

function recentPost() {
  const post_parser = new PostParser();
  const jsx = [];

  const recent_post = post_parser.getRecentPosts(1, 1);

  jsx.push(
    <Link
      style={{ textDecoration: "none" }}
      key={`${recent_post[0].file}`}
      to={`/post/${recent_post[0].file}`}
    >
      <h6 className="title">{recent_post[0].title}</h6>
      <p key={`${recent_post[0].file}`}>
        <font color="#A9AFB3">
          {recent_post[0].description.slice(0, 100) + "..."}
        </font>
      </p>
    </Link>
  );

  return jsx;
}
function Footer() {
  const classes = useStyles();

  return (
    <MDBFooter
      className={clsx("font-small pt-4 mt-4 container-fluid navbar-fixed-bottom", classes.footerContainer)}
    >
      <MDBContainer fluid className={clsx("text-center text-md-left")}>
        <MDBRow>
          <MDBCol md="1" />
          <MDBCol lg="3" md="3">
            <h1 className="title font-weight-bold">
              <OverlayTrigger
                trigger={["hover", "hover"]}
                transition={false}
                overlay={
                  <Tooltip
                    className={classes.tooltip}
                    style={{ margin: 0 }}
                    id="profile"
                  >
                    About me!
                  </Tooltip>
                }
                placement="bottom"
              >
                {({ ref, ...triggerHandler }) => (
                  <Link
                    {...triggerHandler}
                    ref={ref}
                    style={{ textDecoration: "none", width: "fit-content" }}
                    to={"/profile"}
                  >
                    Jooojub
                  </Link>
                )}
              </OverlayTrigger>
            </h1>
            <p>
              <font color="#A9AFB3">system S/W engineers</font>
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
              {tags()}
            </div>
          </MDBCol>
          <MDBCol lg="3" md="3">
            <h6 className="title font-weight-bold pb-3">Recent Post</h6>
            {recentPost()}
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
              <OverlayTrigger
                trigger={["hover", "hover"]}
                transition={false}
                overlay={
                  <Tooltip
                    className={classes.tooltip}
                    style={{ margin: 0 }}
                    id="github"
                  >
                    Github
                  </Tooltip>
                }
                placement="top"
              >
                {({ ref, ...triggerHandler }) => (
                  <div {...triggerHandler} ref={ref}>
                    <a
                      href="https://github.com/jooojub"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faGithub}
                        className={clsx("m-2 h5", classes.footerIcon)}
                      />
                    </a>
                  </div>
                )}
              </OverlayTrigger>
              <OverlayTrigger
                trigger={["hover", "hover"]}
                transition={false}
                overlay={
                  <Tooltip
                    className={classes.tooltip}
                    style={{ margin: 0 }}
                    id="linked-in"
                  >
                    Linked in
                  </Tooltip>
                }
                placement="top"
              >
                {({ ref, ...triggerHandler }) => (
                  <div {...triggerHandler} ref={ref}>
                    {/* <a target="_blank"> */}
                      <FontAwesomeIcon
                        icon={faLinkedinIn}
                        className={clsx("m-2 h5", classes.footerIcon)}
                      />
                    {/* </a> */}
                  </div>
                )}
              </OverlayTrigger>
              <OverlayTrigger
                trigger={["hover", "hover"]}
                transition={false}
                overlay={
                  <Tooltip
                    className={classes.tooltip}
                    style={{ margin: 0 }}
                    id="google"
                  >
                    Google
                  </Tooltip>
                }
                placement="top"
              >
                {({ ref, ...triggerHandler }) => (
                  <div {...triggerHandler} ref={ref}>
                    <a
                      href="mailto:jooojub@gmail.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faGoogle}
                        className={clsx("m-2 h5", classes.footerIcon)}
                      />
                    </a>
                  </div>
                )}
              </OverlayTrigger>
            </MDBCol>
            <MDBCol md="1" />
          </MDBRow>
        </MDBContainer>
      </div>
    </MDBFooter>
  );
}

export default Footer;
