import React from "react";
import { makeStyles } from "@material-ui/styles";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";

import {
  faCalendarMinus
} from "@fortawesome/free-regular-svg-icons";

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
    lineHeight: "2"
  },

  blogDate: {
    fontSize: ".87rem",
    lineHeight: "1.5rem",
    fontColor: "grey",
  },
  readmoreText: {
    "&:hover": {
      color: "#607d8b !important",
    }
  }
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
    <div className="row mt-3">
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
      <button type="button" className="btn btn-primary rounded-lg btn-sm pt-1 pb-1 pl-3 pr-3 m-0 mr-2">gcc</button>
      <button type="button" className="btn btn-dark rounded-lg btn-sm pt-1 pb-1 pl-3 pr-3 m-0">options</button>
      </div>
      <div className="mb-3">
        <h4 className="font-weight-bold text-left">This is title of the news</h4>
      </div>
      <div>
        <h6 className="blue-grey-text text-left font-small font-weight-bold"><FontAwesomeIcon className="mr-2" icon={faCalendarMinus}/> July 5, 2017</h6>
      </div>
      <hr />
      <div>
        <p className={classes.blogContent}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac urna diam. Nullam urna felis, porttitor quis nulla ut, tincidunt cursus tellus. Nunc ac tempus ante. Ut sagittis urna in enim mollis fringilla. Suspendisse sit amet porttitor sem. Interdum et malesuada fames ac ante ipsum primis in
        </p>
      </div>
      <div>
      <p className="text-right mb-0 text-uppercase font-small  font-weight-bold">
        <a className={classes.readmoreText}>
          read more
          <FontAwesomeIcon className="ml-1" icon={faChevronRight}/>
        </a>
      </p>
    </div>
    </div>
  </div>
  );
}

export default BlogCard;
