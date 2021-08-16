import React from "react";

function MainContentContainer(props) {
  return (
    <div className="container">
      <div className="row" style={{ paddingTop: "3rem" }}>
        <div className="col-0 col-xl-1" />
        <div className="col">{props.children}</div>
        <div className="col-0 col-xl-1" />
      </div>
    </div>
  );
}

export default MainContentContainer;
