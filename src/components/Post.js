import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCalendarMinus } from "@fortawesome/free-regular-svg-icons";
import PostParser from "../api/PostParser";

// import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
// import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

import { MarkdownPreview } from "react-marked-markdown";
import hljs from "highlight.js";
import c from "highlight.js/lib/languages/c";
import javascript from "highlight.js/lib/languages/javascript";

import "../highlights/monokai.css";

const useStyles = makeStyles({
  blogCardImage: {
    width: "auto",
    // height: "auto",
    borderRadius: "12px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
    boxSizing: "border-box",

    display: "block",
    height: "100%",
    objectFit: "cover",
  },

  blogContent: {
    // fontSize: ".87rem",
    // lineHeight: "1.5rem",
    marginTop: "1rem",

    fontSize: "15px",
    color: "rgb(41, 41, 41)",
    fontWeight: "600",
    lineHeight: "2",
  },

  blogDate: {
    fontSize: ".87rem",
    lineHeight: "1.5rem",
    fontColor: "grey",
  },
  readmoreText: {
    "&:hover": {
      color: "#607d8b !important",
    },
  },
});

const tags = (file) => {
  const jsx = [];

  if (file === undefined) return;

  file.tags.split(",").forEach((tag, index) => {
    const key = tag.trim();

    if (index === 0) {
      jsx.push(
        <div
          key={key}
          className="btn btn-primary rounded-lg btn-sm pt-1 pb-1 pl-3 pr-3 m-0 mr-2"
        >
          {key}
        </div>
      );
    } else {
      jsx.push(
        <div
          key={key}
          className="btn btn-dark rounded-lg btn-sm pt-1 pb-1 pl-3 pr-3 m-0"
        >
          {key}
        </div>
      );
    }
  });

  return jsx;
};

const date = (file) => {
  if (file === undefined) return;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(file.date));
};

function Post(props) {
  const classes = useStyles();

  useEffect(() => {
    setCurrentPost(props.file);

    new PostParser().getPostWithFile(props.file, setCurrentPostContent);

    hljs.registerLanguage("javascript", javascript);
    hljs.registerLanguage("c", c);

    hljs.highlightAll();
  }, [props.file]);

  const [currentPost, setCurrentPost] = useState(undefined);
  const [currentPostContent, setCurrentPostContent] = useState(null);

  return (
    <div className="row">
      <div className="col-12 col-md-12 p-3">
        <div className="mb-3">{tags(currentPost)}</div>
        <div className="mb-3">
          <h4 className="font-weight-bold text-left">
            {currentPost && currentPost.title}
          </h4>
        </div>
        <div>
          <h6 className="blue-grey-text text-left font-small font-weight-bold">
            <FontAwesomeIcon className="mr-2" icon={faCalendarMinus} />{" "}
            {date(currentPost)}
          </h6>
        </div>
        <hr />
        <div>
          <p className={classes.blogContent}>
            <MarkdownPreview
              value={currentPostContent}
              markedOptions={{
                langPrefix: "hljs language-", // # [1]
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

export default Post;
