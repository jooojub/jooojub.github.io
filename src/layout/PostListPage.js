import React, { useEffect } from "react";
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
import { useHistory } from "react-router-dom";

const posts = (category) => {
  const post_parser = new PostParser();
  const jsx = [];
  var find = false;

  // is tag
  post_parser.getWithTag(category).forEach((post) => {
    jsx.push(<BlogCard key={post.file} file={post} />);
    find = true;
  });

  // is archive
  if (find === false) {
    post_parser.getWithDate(category).forEach((post) => {
      jsx.push(<BlogCard key={post.file} file={post} />);
    });  
  }

  return jsx;
};

function PostListPage(props) {
  const post_parser = new PostParser();
  const history = useHistory();

  useEffect(() => {
    const tag_match = post_parser
      .getTags()
      .filter((x) => x.value === props.match.params.category);

    if (tag_match.length === 0) {
      const date_match = post_parser
        .getDate()
        .filter((x) => x.value === props.match.params.category);
      if (date_match.length === 0) history.push("/");
    }
  });

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
            Posts
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
            # {post_parser.tagToString(props.match.params.category)}
          </font>
        }
      />
      <MainContentContainer>
        <div className="row text-justify d-flex">
          {/* contents */}
          <div className="col-md-8 col-12 pr-4">
            <ContentTitle
              value={post_parser
                .tagToString(props.match.params.category)
                .toUpperCase()}
            />
            <div className="m-2">
              {posts(props.match.params.category)}
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

export default PostListPage;
