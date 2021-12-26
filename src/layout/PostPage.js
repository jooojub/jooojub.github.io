import React, { useEffect, useState } from "react";
import HeaderNavBar from "./HeaderNavBar";
import HeaderBar from "./HeaderBar";
import Footer from "./Footer";
import MainContentContainer from "./MainContentContainer";
import { DiscussionEmbed } from "disqus-react";

import CategoriesComponent from "../components/CategoriesComponent";
import ArchiveComponent from "../components/ArchiveComponent";
import SponsorComponent from "../components/SponsorComponent";
import ContentTitle from "../components/ContentTitle";
import SearchInBlog from "../components/SearchInBlog";
import Post from "../components/Post";

import PostParser from "../api/PostParser";
import { useHistory } from "react-router-dom";

import Button from "react-bootstrap/Button";

function PostPage(props) {
  const history = useHistory();
  const [currentPost, setCurrentPost] = useState(undefined);

  useEffect(() => {
    const post_match = new PostParser().getWithFile(props.match.params.file);

    if (post_match === null) history.push("/");

    setCurrentPost(post_match);
  }, [props.match.params.file, history]);

  return (
    <>
      <HeaderNavBar />
      <HeaderBar
        bgImage={"url(/assets/images/background/post_header_img.jpg)"}
        mainComponent={
          <font
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "60px",
              fontWeight: "600",
              textShadow: "1px 1px #000000",
            }}
          >
            Post
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
            {currentPost && currentPost.title}
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
            {currentPost &&
              new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(currentPost.date))}
          </font>
        }
      />
      <MainContentContainer>
        <div className="row text-justify d-flex">
          {/* contents */}
          <div className="col-md-8 col-12 pr-4 pl-4 text-left">
            {/* <ContentTitle value={currentPost && currentPost.title} /> */}
            {/* <div className="m-2"> */}
            {currentPost && (
              <>
                <Post file={currentPost} />
                <br />
                <DiscussionEmbed
                  shortname="jooojub"
                  config={{
                    url: window.location.href,
                    identifier: currentPost.file,
                    title: currentPost.title,
                  }}
                />
              </>
            )}
            <br />

            <div className="d-flex justify-content-center mt-2">
              <Button
                variant="dark"
                size="sm"
                onClick={() => {
                  history.goBack();
                }}
              >
                Previous
              </Button>
            </div>
            <br />
            <br />
            {/* </div> */}
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

export default PostPage;
