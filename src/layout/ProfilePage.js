import React from "react";

import { makeStyles } from "@material-ui/styles";
import HeaderNavBar from "./HeaderNavBar";
import HeaderBar from "./HeaderBar";
import Footer from "./Footer";
import MainContentContainer from "./MainContentContainer";

const ProfilePage = () => {
  return (
    <>
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
      <MainContentContainer>test</MainContentContainer>
      <Footer />
    </>
  );
};

export default ProfilePage;
