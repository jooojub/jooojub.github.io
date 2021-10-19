import React, { useState } from "react";

// import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchInBlog = (props) => {
  const [keyword, setKeyword] = useState("");
  const history = useHistory();

  const search = (keyword) => {
    if (keyword !== "")
      history.push(`/search/${keyword}`);
  }

  return (
    <div className="row">
      <div className="m-4 col pr-md-5" style={{ width: "75%" }}>
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            placeholder="Search"
            aria-label="Search"
            value={keyword}
            onInput={(e) => setKeyword(e.target.value)}
          />
            <button
              type="button"
              onClick={() => {search(keyword)}}
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
