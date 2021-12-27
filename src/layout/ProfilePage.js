import React from "react";

import { makeStyles } from "@material-ui/styles";
import HeaderNavBar from "./HeaderNavBar";
import HeaderBar from "./HeaderBar";
import Footer from "./Footer";
import MainContentContainer from "./MainContentContainer";
import SponsorComponent from "../components/SponsorComponent";

import clsx from "clsx";

import { Avatar } from "@material-ui/core";
import ContentTitle from "../components/ContentTitle";
import PostParser from "../api/PostParser";
import ReactHelmet from "../components/ReactHelmet";

const useStyles = makeStyles({
  profileAvatar: {
    height: "160px",
    width: "160px",
    userSelect: "none",
    margin: "1rem",
    boxShadow:
      "0 5px 15px -8px rgba(0,0,0,.24), 0 8px 10px -5px rgba(0,0,0,.2)",
  },
  circleIcon: {
    backgroundColor: "#0D1317",
    textAlign: "center",
    display: "inline-block",
    width: "30px",
    height: "30px",
    padding: "6px 0px",
    color: "white",
    margin: "5px",
    fontSize: "18px",
    borderRadius: "4px",
    "&:hover": {
      cursor: "pointer",
      transition: "all 0.5s linear",
    },
  },
  IconGithub: {
    "&:hover": {
      backgroundColor: "#666666",
    },
  },
  IconLinkedin: {
    "&:hover": {
      backgroundColor: "#0976B4",
    },
  },
  IconGoogle: {
    "&:hover": {
      backgroundColor: "#C32F10",
    },
  },

  skilInfo: {
    backgroundColor: "#213447",
    textAlign: "center",
    padding: "4px 12px",
    width: "auto",
    color: "white",
    margin: "5px",
    fontSize: "14px",
    borderRadius: "1rem",
    fontWeight: "500",
    userSelect: "none",
    display: "flex",
    alignItems: "center",
  },
});

const ProfilePage = () => {
  const classes = useStyles();

  const interest_list = [
    {
      skill: "c ",
      // render: () => {
      //   return <i className="fa fab-github pr-2" aria-hidden="true" />;
      // },
    },
    {
      skill: "c++",
    },
    {
      skill: "c#",
    },
    {
      skill: "java",
    },
    {
      skill: "aarch64",
    },
    {
      skill: "x86-64",
    },
    {
      skill: "bash",
    },
    {
      skill: "python",
    },
    {
      skill: "javascript",
    },
    {
      skill: "css",
    },
    {
      skill: "WPF",
    },
    {
      skill: "react",
    },
    {
      skill: "nodejs",
    },
    {
      skill: "yocto",
    },
    {
      skill: "buildroot",
    },
    {
      skill: "gcc",
    },
    {
      skill: "glibc",
    },
    {
      skill: "u-boot",
    },
    {
      skill: "linux kernel",
    },
    {
      skill: "tizen",
    },
    {
      skill: "sysvinit",
    },
    {
      skill: "systemd",
    },
    {
      skill: "sanitizer",
    },
  ];

  return (
    <>
      <ReactHelmet
        title="jooojub"
        url="https://jooojub.github.io/profile"
        image="https://jooojub.github.io/assets/images/avatars/toto.jpg"
        description="system S/W engineers"
      />
      <HeaderNavBar />
      <HeaderBar
        bgImage={"url(/assets/images/background/profile_header_img.jpg)"}
        mainComponent={
          <font
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "60px",
              fontWeight: "600",
              textShadow: "1px 1px #000000",
            }}
          >
            About me
          </font>
        }
        subComponent={
          <font
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "24px",
              fontWeight: "600",
              textShadow: "1px 1px #000000",
            }}
          >
            jooojub
          </font>
        }
        subSecondComponent={
          <font
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              fontWeight: "400",
              textShadow: "1px 1px #000000",
            }}
          >
            I'm system S/W Engineers.
          </font>
        }
      />
      <MainContentContainer>
        <div className="row">
          <div className="col-1" />
          <div className="col-md-10">
            <div>
              <div className="d-flex justify-content-center mb-1">
                <Avatar
                  alt="jooojub"
                  className={classes.profileAvatar}
                  src="/assets/images/avatars/toto.jpg"
                />
              </div>
              <h3
                className="font-weight-bold mb-3"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                jooojub
              </h3>
              <h6 className="mb-3" style={{ fontFamily: "Inter, sans-serif" }}>
                system S/W engineers
              </h6>
              <div className="mb-4">
                <a href="https://github.com/jooojub" target="_blank" rel="noreferrer">
                  <i
                    className={clsx(
                      "fab fa-github",
                      classes.circleIcon,
                      classes.IconGithub
                    )}
                    aria-hidden="true"
                  />
                </a>
                <i
                  className={clsx(
                    "fab fa-linkedin-in",
                    classes.circleIcon,
                    classes.IconLinkedin
                  )}
                  aria-hidden="true"
                />
                <a href="mailto:jooojub@gmail.com" target="_blank" rel="noreferrer">
                  <i
                    className={clsx(
                      "fab fa-google",
                      classes.circleIcon,
                      classes.IconGoogle
                    )}
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>

            <div className="mb-5 pr-4 pl-3">
              <ContentTitle value={"Interest"} />
              <div className="row m-4 justify-content-md-start justify-content-center">
                {interest_list.map((obj) => {
                  return (
                    <div key={obj.skill} className={classes.skilInfo}>
                      {obj.render && obj.render()}
                      <div>{obj.skill}</div>
                    </div>
                  );
                })}{" "}
              </div>
            </div>
            <div className="pr-4 pl-3">
              <ContentTitle value={"Statistics"} />
              <div className="row">
                <div className="m-1 ml-4">
                  <div className="row m-4">
                    <h1 className="align-self-center">
                      <i className="fa fa-book"></i>
                    </h1>
                    <div className="ml-3">
                      <h3
                        className="text-left font-weight-bold mb-0"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {new PostParser().getPostCount()}
                      </h3>
                      <h6>
                        <p>Number of posts</p>
                      </h6>
                    </div>
                  </div>
                </div>

                <div className="m-1">
                  <div className="row m-4 pr-4 pl-3">
                    <h1 className="align-self-center">
                      <i className="fas fa-mug-hot"></i>
                    </h1>
                    <div className="ml-3">
                      <h3
                        className="text-left font-weight-bold mb-0  "
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        4021
                      </h3>
                      <h6>
                        <p>Cups of coffee</p>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pr-4 pl-3">
              <ContentTitle value={"Sponsor"} />
              <div className="m-2 text-left">
                <SponsorComponent />
              </div>
            </div>
          </div>
          <div className="col-1" />
        </div>
      </MainContentContainer>
      <Footer />
    </>
  );
};

export default ProfilePage;
