import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { faCalendarMinus } from "@fortawesome/free-regular-svg-icons";

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
        <div key={key} className="btn btn-primary rounded-lg btn-sm pt-1 pb-1 pl-3 pr-3 m-0 mr-2">
          {key}
        </div>
      );
    } else {
      jsx.push(
        <div key={key} className="btn btn-dark rounded-lg btn-sm pt-1 pb-1 pl-3 pr-3 m-0">
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

function BlogCard(props) {
  const classes = useStyles();
  const [file] = useState(props.file);

  return (
    <div className="row mt-3">
      <div className="col-12 col-md-12 p-3">
        <div className="mb-3">{tags(file)}</div>
        <div className="mb-3">
          <h4 className="font-weight-bold text-left">{file && file.title}</h4>
        </div>
        <div>
          <h6 className="blue-grey-text text-left font-small font-weight-bold">
            <FontAwesomeIcon className="mr-2" icon={faCalendarMinus} />{" "}
            {date(file)}
          </h6>
        </div>
        <hr />
        <div>
          <p className={classes.blogContent}>
          {file && file.description}
          </p>
        </div>
        <div>
          <p className="text-right mb-0 text-uppercase font-small  font-weight-bold">
            <a className={classes.readmoreText}>
              read more
              <FontAwesomeIcon className="ml-1" icon={faChevronRight} />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
