"use client";

import React from "react";

interface TopFilterBarProps {
  setCurrentSortingOption?: (option: string) => void;
  setColstyle: (style: boolean) => void;
  colstyle: boolean;
  pageContentTrac: number[];
}

const TopFilterBar: React.FC<TopFilterBarProps> = ({
  setCurrentSortingOption,
  setColstyle,
  colstyle,
  pageContentTrac,
}) => {
  return (
    <>
      <div className="col-sm-6">
        <div className="text-center text-sm-start">
          <p className="pagination_page_count mb-0">
            Showing {pageContentTrac[0]}–
            {pageContentTrac[2] < pageContentTrac[1]
              ? pageContentTrac[2]
              : pageContentTrac[1]}{" "}
            of {pageContentTrac[2]} results
          </p>
        </div>
      </div>

      <div className="col-sm-6">
        <div className="page_control_shorting d-flex align-items-center justify-content-center justify-content-sm-end">
          <div className="pcs_dropdown pr10 d-flex align-items-center">
            <span style={{ minWidth: "60px" }}>Sort by</span>
            <select
              className="form-select"
              onChange={(e) =>
                setCurrentSortingOption && setCurrentSortingOption(e.target.value)
              }
            >
              <option>Newest</option>
              <option>Best Seller</option>
              <option>Best Match</option>
              <option>Price Low</option>
              <option>Price High</option>
            </select>
          </div>
          <div
            className={`pl15 pr15 bdrl1 bdrr1 d-none d-md-block cursor ${
              !colstyle ? "menuActive" : ""
            }`}
            onClick={() => setColstyle(false)}
            style={{ cursor: "pointer" }}
          >
            Grid
          </div>
          <div
            className={`pl15 d-none d-md-block cursor ${
              colstyle ? "menuActive" : ""
            }`}
            onClick={() => setColstyle(true)}
            style={{ cursor: "pointer" }}
          >
            List
          </div>
        </div>
      </div>
    </>
  );
};

export default TopFilterBar;
