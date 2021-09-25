import React from "react";
import { MDBPagination, MDBPageItem, MDBPageNav } from "mdbreact";

function ScrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function PageItem(current, setCurrent, totalPage, perPage) {
  const jsx = [];

  const pageCnt = Math.ceil(totalPage / perPage);

  for (var idx = 0; idx < pageCnt; idx++) {
    jsx.push(
      <MDBPageItem active={idx + 1 === current}>
        <MDBPageNav
          value={idx + 1}
          onClick={(e) => {
            setCurrent(Number(e.target.getAttribute("value")));
            ScrollToTop();
          }}
        >
          {idx + 1}
        </MDBPageNav>
      </MDBPageItem>
    );
  }

  return (
    <MDBPagination className="mb-5" color="dark">
      <MDBPageItem
        onClick={() => {
          setCurrent(current - 1);
          ScrollToTop();
        }}
        disabled={current === 1}
      >
        <MDBPageNav aria-label="Previous">
          <span aria-hidden="true">Previous</span>
        </MDBPageNav>
      </MDBPageItem>
      {jsx}
      <MDBPageItem
        onClick={() => {
          setCurrent(current + 1);
          ScrollToTop();
        }}
        disabled={current === pageCnt}
      >
        <MDBPageNav aria-label="Previous">
          <span aria-hidden="true">Next</span>
        </MDBPageNav>
      </MDBPageItem>
    </MDBPagination>
  );
}

function Pagination(props) {
  return (
    <>
      {PageItem(
        props.current,
        props.setCurrent,
        props.totalPage,
        props.perPage
      )}
    </>
  );
}

export default Pagination;
