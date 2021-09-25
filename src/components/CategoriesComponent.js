import React from "react";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";

import PostParser from "../api/PostParser";

import clsx from "clsx";

const useStyles = makeStyles({
  CategoriesContainer: {
    "& .tag-btn": {
      backgroundColor: "#f5f5f5 !important",
      color: "#4f4f4f !important",
      fontSize: "14px",
      fontWeight: "700",
      marginRight: "0.5rem",
      marginBottom: "0.5rem",
      padding: "0.6rem",
      width: "fit-content",
      display: "inline-block",
      "&:hover": {
        cursor: "pointer",
        transition: "all 0.5s linear",
      },
    },
  },
});

const tags = () => {
  const post_parser = new PostParser();
  const jsx = [];

  post_parser.getTags().forEach((tag) => {
    jsx.push(
      <Link key={`${tag.value}`} to={`/posts/${tag.value}`}>
        <div className="tag-btn">
          {post_parser.tagToString(tag.value)}
          <span className="ml-2 badge bg-dark ms-2">{tag.count}</span>
        </div>
      </Link>
    );
  });

  return jsx;
};

function CategoriesComponent() {
  const classes = useStyles();

  return (
    <div className={clsx("mt-3 p-3", classes.CategoriesContainer)}>
      {tags()}
    </div>
  );
}

export default CategoriesComponent;
