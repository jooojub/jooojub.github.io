import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  contentTitle: {
    display: "flex",
    alignItems: "center",
    borderLeft: "5px solid #E2E8F0",
    paddingLeft: "20px",
  },
});

const ContentTitle = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.contentTitle}>
      <h4 className="title font-weight-bold mb-0">{props.value}</h4>
    </div>
  );
};

ContentTitle.propTypes = {
  value: PropTypes.string.isRequired,
};

export default ContentTitle;