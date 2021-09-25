import React from "react";
import { makeStyles } from "@material-ui/styles";

import PostParser from "../api/PostParser";

import clsx from "clsx";

const useStyles = makeStyles({
  ArchiveContainer: {
    "& .archive-btn": {
      backgroundColor: "#f5f5f5 !important",
      color: "#4f4f4f !important",
      fontSize: "14px",
      fontWeight: "700",
      marginRight: "0.5rem",
      marginBottom: "0.5rem",
      padding: "0.6rem",
      textAlign: "center",
      display: "inline-block",
      width: "135px",
      "&:hover": {
        cursor: "pointer",
        transition: "all 0.5s linear",
      },
    },
  },
});

const dates = () => {
  const post_parser = new PostParser();
  const jsx = [];

  post_parser.getDate().forEach((date) => {
    jsx.push(<div className="archive-btn">{date.value}</div> );
  });

  return jsx;
};

function ArchiveComponent() {
  const classes = useStyles();

  return (
    <div className={clsx("mt-3 p-3", classes.ArchiveContainer)}>
      {dates()}
    </div>
  );
}

export default ArchiveComponent;
