import React, { useState, useEffect } from "react";
import HeaderNavBar from "./HeaderNavBar";
import HeaderBar from "./HeaderBar";
import Footer from "./Footer";
import MainContentContainer from "./MainContentContainer";

import BlogCard from "../components/BlogCard";
import CategoriesComponent from "../components/CategoriesComponent";
import ArchiveComponent from "../components/ArchiveComponent";
import ContentTitle from "../components/ContentTitle";
import SearchInBlog from "../components/SearchInBlog";

import PostParser from "../api/PostParser";
import Pagination from "../components/Pagination";

const posts = (current, perPage) => {
  const post_parser = new PostParser();
  const jsx = [];

  post_parser.getRecentPosts(current, perPage).forEach((post) => {
    jsx.push(<BlogCard key={post.file} file={post} />);
  });

  return jsx;
};

function MainPage() {
  const [current, setCurrent] = useState(1);
  const perPage = 5;
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    const post_parser = new PostParser();
    setTotalPage(post_parser.getPostCount());
  }, []);

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
            className="btn btn-outline-white wow fadeInDown waves-effect waves-light"
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
              {posts(current, perPage)}
              <br />
              <div className="d-flex justify-content-center mt-2">
                <Pagination
                  current={current}
                  setCurrent={setCurrent}
                  totalPage={totalPage}
                  perPage={perPage}
                />
              </div>
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
