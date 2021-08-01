import React from "react";
import { makeStyles } from "@material-ui/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

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
    fontSize: ".87rem",
    lineHeight: "1.5rem",
    marginTop: "1rem",
  },

  blogDate: {
    fontSize: ".87rem",
    lineHeight: "1.5rem",
    fontColor: "grey",
  },
  // blogTag: {
  //   paddingTop: 0.1rem;
  //   paddingBottom: 0.1rem;
  //   paddingLeft: 0.8rem;
  //   paddingRight: 0.8rem;
  //   borderRadius: 0.8rem;
  //   margin: 0;
  // }
});

function BlogCard() {
  const classes = useStyles();

  return (
    <div className="row m-1 mt-3">
    {/* <div className="col-12 col-md-12 mt-5" style={{height: "50px"}}>
      <div className="view overlay z-depth-1">
      <img
        // className={classes.blogCardImage}
        className="img-fluid"
         src="https://mdbootstrap.com/img/Photos/Others/photo1.jpg"
      />
      </div>
    </div> */}
    <div className="col-12 col-md-12 p-3">
      <div className="mb-3">
      <button type="button" class="btn btn-primary rounded-lg btn-sm pt-1 pb-1 pl-3 pr-3 m-0 mr-2">gcc</button>
      <button type="button" class="btn btn-dark rounded-lg btn-sm pt-1 pb-1 pl-3 pr-3 m-0">options</button>
      </div>
      <div>
        <h4 className="font-weight-bold text-left">This is title of the news</h4>
      </div>
      <div>
        <h6 className="teal-text text-left text-uppercase font-small font-weight-bold">July 5, 2017</h6>
      </div>
      <hr />
      <div>
        <p className={classes.blogContent}>
          Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil
          impedit quo minus id quod maxime placeat facere possimus voluptas...
        </p>
      </div>
      <div>
      <p class="text-right mb-0 text-uppercase font-small spacing font-weight-bold">
        <a>
          read more
          <FontAwesomeIcon className="ml-2" icon={faChevronRight}
          />
        </a>
      </p>
    </div>
    </div>
  </div>
  );
}

export default BlogCard;
