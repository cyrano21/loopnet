"use client";

import React from "react";
import SearchBox from "./filters/SearchBox";
import ListingStatus from "./filters/ListingStatus";
import PropertyType from "./filters/PropertyType";
import PriceSlider from "./filters/PriceRange";
import Bedroom from "./filters/Bedroom";
import Bathroom from "./filters/Bathroom";
import Location from "./filters/Location";
import SquareFeet from "./filters/SquareFeet";
import YearBuilt from "./filters/YearBuilt";
import OtherFeatures from "./filters/OtherFeatures";

interface FilterFunctions {
  handlelistingStatus: (status: string) => void;
  handlepropertyTypes: (type: string) => void;
  handlepriceRange: (range: number[]) => void;
  handlebedrooms: (bedrooms: number) => void;
  handlebathroms: (bathrooms: number) => void;
  handlelocation: (location: string) => void;
  handlesquirefeet: (sqft: number[]) => void;
  handleyearBuild: (year: number[]) => void;
  handlecategories: (category: string) => void;
  resetFilter: () => void;
  setSearchQuery: (query: string) => void;
  setPropertyTypes: (types: string[]) => void;
  priceRange: number[];
  listingStatus: string;
  propertyTypes: string[];
  bedrooms: number;
  bathroms: number;
  location: string;
  squirefeet: number[];
  yearBuild: number[];
  categories: string[];
}

interface ListingSidebarProps {
  filterFunctions: FilterFunctions;
}

const ListingSidebar: React.FC<ListingSidebarProps> = ({ filterFunctions }) => {
  return (
    <div className="list-sidebar-style1">
      <div className="widget-wrapper">
        <h6 className="list-title">Find your home</h6>
        <SearchBox onSearchChange={(searchTerm) => console.log('Search:', searchTerm)} />
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Listing Status</h6>
        <div className="radio-element">
          <ListingStatus onStatusChange={(status) => console.log('Status:', status)} selectedStatuses={[]} />
        </div>
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Property Type</h6>
        <div className="checkbox-style1">
          <PropertyType onTypeChange={(types) => console.log('Types:', types)} selectedTypes={[]} />
        </div>
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Price Range</h6>
        <div className="range-slider-style1">
          <PriceSlider onPriceChange={(min, max) => console.log('Price:', min, max)} minPrice={null} maxPrice={null} />
        </div>
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Bedrooms</h6>
        <div className="d-flex">
          <Bedroom onBedroomChange={(bedrooms) => console.log('Bedrooms:', bedrooms)} selectedBedrooms={[]} />
        </div>
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Bathrooms</h6>
        <div className="d-flex">
          <Bathroom onBathroomChange={(bathrooms) => console.log('Bathrooms:', bathrooms)} selectedBathrooms={[]} />
        </div>
      </div>

      <div className="widget-wrapper advance-feature-modal">
        <h6 className="list-title">Location</h6>
        <div className="form-style2 input-group">
          <Location 
            onLocationChange={(locations) => console.log('Location changed:', locations)}
            selectedLocations={[]}
          />
        </div>
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Square Feet</h6>
        <SquareFeet 
          onSquareFeetChange={(min, max) => console.log('Square feet changed:', min, max)}
          minSquareFeet={null}
          maxSquareFeet={null}
        />
      </div>

      <div className="widget-wrapper">
        <h6 className="list-title">Year Built</h6>
        <YearBuilt 
          onYearBuiltChange={(min, max) => console.log('Year built changed:', min, max)}
          minYearBuilt={null}
          maxYearBuilt={null}
        />
      </div>

      <div className="widget-wrapper">
        <div className="feature-accordion">
          <div className="accordion" id="accordionExample">
            <div className="accordion-item border-none">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button border-none p-0 after-none feature-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  <span className="flaticon-settings" /> Other Features
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body p-0 mt15">
                  <OtherFeatures filterFunctions={filterFunctions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="widget-wrapper mb20">
        <div className="btn-area d-grid align-items-center">
          <button className="ud-btn btn-thm">
            <span className="flaticon-search align-text-top pr10" />
            Search
          </button>
        </div>
      </div>

      <div className="reset-area d-flex align-items-center justify-content-between">
        <div
          onClick={() => filterFunctions.resetFilter()}
          className="reset-button cursor"
          style={{ cursor: "pointer" }}
        >
          <span className="flaticon-turn-back" />
          <u>Reset all filters</u>
        </div>
        <a className="reset-button" href="#">
          <span className="flaticon-favourite" />
          <u>Save Search</u>
        </a>
      </div>
    </div>
  );
};

export default ListingSidebar;
