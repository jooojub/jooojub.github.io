import React from "react";
// import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchInBlog = (props) => {
  return (
    <div className="row">
      <div className="m-4 col pr-md-5" style={{ width: "75%" }}>
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            placeholder="Search"
            aria-label="Search"
          />
          <button
            type="button"
            className="btn btn-dark btn-sm pt-1 pb-1 pl-3 pr-3 m-0"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
    </div>
  );
};

// SearchInBlog.propTypes = {
//   value: PropTypes.string.isRequired,
// };

export default SearchInBlog;
