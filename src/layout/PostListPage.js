import React, { useEffect, useState } from "react";
import HeaderNavBar from "./HeaderNavBar";
import HeaderBar from "./HeaderBar";
import Footer from "./Footer";
import MainContentContainer from "./MainContentContainer";

import BlogCard from "../components/BlogCard";
import CategoriesComponent from "../components/CategoriesComponent";
import ArchiveComponent from "../components/ArchiveComponent";
import SponsorComponent from "../components/SponsorComponent";
import ContentTitle from "../components/ContentTitle";
import SearchInBlog from "../components/SearchInBlog";

import PostParser from "../api/PostParser";
import { useHistory } from "react-router-dom";

import Pagination from "../components/Pagination";

const posts = (current_posts, current, perPage) => {
  const jsx = [];
  const begin = (current - 1) * perPage;

  current_posts.slice(begin, begin + perPage).forEach((post) => {
    jsx.push(<BlogCard key={post.file} file={post} />);
  });

  return jsx;
};

function PostListPage(props) {
  const history = useHistory();

  const [current, setCurrent] = useState(1);
  const perPage = 5;
  const [totalPage, setTotalPage] = useState(1);

  const [currentPosts, setCurrentPosts] = useState([]);

  const [currentCategory, setCurrentCategory] = useState();

  useEffect(() => {
    const post_parser = new PostParser();
  
    const tag_match = post_parser
      .getTags()
      .filter((x) => x.value === props.match.params.category);

    if (tag_match.length === 0) {
      const date_match = post_parser
        .getDate()
        .filter((x) => x.value === props.match.params.category);
      if (date_match.length === 0) history.push("/");

      const cur_post = post_parser.getWithDate(props.match.params.category);

      setTotalPage(cur_post.length);
      setCurrentPosts(cur_post);
      setCurrentCategory("archive");
    } else {
      const cur_post = post_parser.getWithTag(props.match.params.category);

      setTotalPage(cur_post.length);
      setCurrentPosts(cur_post);
      setCurrentCategory("categories");
    }

    setCurrent(1);
  }, [props.match.params.category, history]);

  return (
    <>
      <HeaderNavBar />
      <HeaderBar
        bgImage={"url(/assets/images/background/post_list_header_img.jpg)"}
        mainComponent={
          <font
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "60px",
              fontWeight: "600",
              textShadow: "1px 1px #000000",
            }}
          >
            My posts
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
            filter by {currentCategory}
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
            # {new PostParser().tagToString(props.match.params.category)}
          </font>
        }
      />
      <MainContentContainer>
        <div className="row text-justify d-flex">
          {/* contents */}
          <div className="col-md-8 col-12 pr-4 pl-4">
            <ContentTitle
              value={new PostParser()
                .tagToString(props.match.params.category)
                .toUpperCase()}
            />
            <div className="m-2">
              {posts(currentPosts, current, perPage)}
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
            <ContentTitle value={"Sponsor"} />
            <div className="m-2">
              <SponsorComponent />
            </div>
          </div>
        </div>
      </MainContentContainer>
      <Footer />
    </>
  );
}

export default PostListPage;
