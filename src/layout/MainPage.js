import React from "react";
import HeaderNavBar from "./HeaderNavBar";
import HeaderBar from "./HeaderBar";
import Footer from "./Footer";
import MainContentContainer from "./MainContentContainer";

import BlogCard from "../components/BlogCard";
import CategoriesComponent from "../components/CategoriesComponent";
import ArchiveComponent from "../components/ArchiveComponent";
import ContentTitle from "../components/ContentTitle";
import SearchInBlog from "../components/SearchInBlog";

function MainPage() {
  return (
    <>
      <HeaderNavBar />
      <HeaderBar
        bgImage={"url(/assets/images/background/main_header_img.jpg)"}
        mainComponent={
          <font
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "60px",
              fontWeight: "600",
              textShadow: "1px 1px #000000",
            }}
          >
            &nbsp;&nbsp;&nbsp;Hello ;)
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
            please take a break!
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
            I'm system S/W Engineers. However, interested in many fields. Let's
            study together!
          </font>
        }
        subButton={
          <a
            href="/profile"
            type="button"
            class="btn btn-outline-white wow fadeInDown waves-effect waves-light"
          >
            about me
          </a>
        }
      />
      <MainContentContainer>
        <div className="row text-justify d-flex">
          {/* contents */}
          <div className="col-md-8 col-12 pr-4">
            <ContentTitle value={"Recent Posts"} />
            <div className="m-2">
              <BlogCard />
              <BlogCard />
              <BlogCard />
              <br />
            </div>
          </div>
          {/* side-contents */}
          <div className="col-md-4 col-12">
            <ContentTitle value={"Search in blog"} />
            <div className="m-2">
              <SearchInBlog />
            </div>
            <ContentTitle value={"Categories"} />
            <div className="m-2">
              <CategoriesComponent />
            </div>
            <ContentTitle value={"Archive"} />
            <div className="m-2">
              <ArchiveComponent />
            </div>
          </div>
        </div>
      </MainContentContainer>
      <Footer />
    </>
  );
}

export default MainPage;
