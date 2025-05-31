"use client";

import { useState, useEffect } from "react";
import { PropertySeedData } from "@/lib/seed-data";
import ListingSidebar from "./ListingSidebar";
import TopFilterBar from "./TopFilterBar";
import FeaturedListings from "./FeaturedListings";
import PaginationTwo from "./PaginationTwo";

interface PropertyFilteringProps {
  listings: PropertySeedData[];
}

export default function PropertyFiltering({ listings }: PropertyFilteringProps) {
  const [filteredData, setFilteredData] = useState<PropertySeedData[]>([]);
  const [currentSortingOption, setCurrentSortingOption] = useState("Newest");
  const [sortedFilteredData, setSortedFilteredData] = useState<PropertySeedData[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [colstyle, setColstyle] = useState(false);
  const [pageItems, setPageItems] = useState<PropertySeedData[]>([]);
  const [pageContentTrac, setPageContentTrac] = useState([0, 0, 0]);

  // Filter states
  const [listingStatus, setListingStatus] = useState("All");
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [bedrooms, setBedrooms] = useState(0);
  const [bathroms, setBathroms] = useState(0);
  const [location, setLocation] = useState("All Cities");
  const [squirefeet, setSquirefeet] = useState<number[]>([]);
  const [yearBuild, setyearBuild] = useState<number[]>([0, 2050]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setPageItems(
      sortedFilteredData.slice((pageNumber - 1) * 8, pageNumber * 8)
    );
    setPageContentTrac([
      (pageNumber - 1) * 8 + 1,
      pageNumber * 8,
      sortedFilteredData.length,
    ]);
  }, [pageNumber, sortedFilteredData]);

  const resetFilter = () => {
    setListingStatus("All");
    setPropertyTypes([]);
    setPriceRange([0, 100000]);
    setBedrooms(0);
    setBathroms(0);
    setLocation("All Cities");
    setSquirefeet([]);
    setyearBuild([0, 2050]);
    setCategories([]);
    setCurrentSortingOption("Newest");
    setSearchQuery("");
  };

  const handlelistingStatus = (elm: string) => {
    setListingStatus((pre) => (pre === elm ? "All" : elm));
  };

  const handlepropertyTypes = (elm: string) => {
    if (elm === "All") {
      setPropertyTypes([]);
    } else {
      setPropertyTypes((pre) =>
        pre.includes(elm) ? [...pre.filter((el) => el !== elm)] : [...pre, elm]
      );
    }
  };

  const handlepriceRange = (elm: number[]) => {
    setPriceRange(elm);
  };

  const handlebedrooms = (elm: number) => {
    setBedrooms(elm);
  };

  const handlebathroms = (elm: number) => {
    setBathroms(elm);
  };

  const handlelocation = (elm: string) => {
    setLocation(elm);
  };

  const handlesquirefeet = (elm: number[]) => {
    setSquirefeet(elm);
  };

  const handleyearBuild = (elm: number[]) => {
    setyearBuild(elm);
  };

  const handlecategories = (elm: string) => {
    if (elm === "All") {
      setCategories([]);
    } else {
      setCategories((pre) =>
        pre.includes(elm) ? [...pre.filter((el) => el !== elm)] : [...pre, elm]
      );
    }
  };

  const filterFunctions = {
    handlelistingStatus,
    handlepropertyTypes,
    handlepriceRange,
    handlebedrooms,
    handlebathroms,
    handlelocation,
    handlesquirefeet,
    handleyearBuild,
    handlecategories,
    priceRange,
    listingStatus,
    propertyTypes,
    resetFilter,
    bedrooms,
    bathroms,
    location,
    squirefeet,
    yearBuild,
    categories,
    setPropertyTypes,
    setSearchQuery,
  };

  // Filter logic
  useEffect(() => {
    const refItems = listings.filter((elm) => {
      if (listingStatus === "All") {
        return true;
      } else if (listingStatus === "Buy") {
        return elm.transactionType === "sale";
      } else if (listingStatus === "Rent") {
        return elm.transactionType === "rent";
      }
      return true;
    });

    let filteredArrays = [];

    if (propertyTypes.length > 0) {
      const filtered = refItems.filter((elm) =>
        propertyTypes.includes(elm.propertyType)
      );
      filteredArrays = [...filteredArrays, filtered];
    }

    filteredArrays = [
      ...filteredArrays,
      refItems.filter((el) => (el.rooms || 0) >= bedrooms),
    ];

    filteredArrays = [
      ...filteredArrays,
      refItems.filter((el) => (el.bathrooms || 0) >= bathroms),
    ];

    filteredArrays = [
      ...filteredArrays,
      refItems.filter(
        (el) =>
          el.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          el.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          el.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          el.features?.join(" ").toLowerCase().includes(searchQuery.toLowerCase())
      ),
    ];

    filteredArrays = [
      ...filteredArrays,
      !categories.length
        ? [...refItems]
        : refItems.filter((elm) =>
            categories.every((elem) => elm.features?.includes(elem))
          ),
    ];

    if (location !== "All Cities") {
      filteredArrays = [
        ...filteredArrays,
        refItems.filter((el) => el.city === location),
      ];
    }

    if (priceRange.length > 0) {
      const filtered = refItems.filter(
        (elm) => elm.price >= priceRange[0] && elm.price <= priceRange[1]
      );
      filteredArrays = [...filteredArrays, filtered];
    }

    if (squirefeet.length > 0 && squirefeet[1]) {
      const filtered = refItems.filter(
        (elm) =>
          (elm.surface || 0) >= squirefeet[0] && (elm.surface || 0) <= squirefeet[1]
      );
      filteredArrays = [...filteredArrays, filtered];
    }

    if (yearBuild.length > 0) {
      const filtered = refItems.filter(
        (elm) =>
          (elm.yearBuilt || 0) >= yearBuild[0] && (elm.yearBuilt || 0) <= yearBuild[1]
      );
      filteredArrays = [...filteredArrays, filtered];
    }

    const commonItems = refItems.filter((item) =>
      filteredArrays.every((array) => array.includes(item))
    );

    setFilteredData(commonItems);
  }, [
    listings,
    listingStatus,
    propertyTypes,
    priceRange,
    bedrooms,
    bathroms,
    location,
    squirefeet,
    yearBuild,
    categories,
    searchQuery,
  ]);

  // Sorting logic
  useEffect(() => {
    setPageNumber(1);
    if (currentSortingOption === "Newest") {
      const sorted = [...filteredData].sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setSortedFilteredData(sorted);
    } else if (currentSortingOption.trim() === "Price Low") {
      const sorted = [...filteredData].sort((a, b) => a.price - b.price);
      setSortedFilteredData(sorted);
    } else if (currentSortingOption.trim() === "Price High") {
      const sorted = [...filteredData].sort((a, b) => b.price - a.price);
      setSortedFilteredData(sorted);
    } else {
      setSortedFilteredData(filteredData);
    }
  }, [filteredData, currentSortingOption]);

  return (
    <section className="pt0 pb90 bgc-f7">
      <div className="container">
        <div className="row gx-xl-5">
          <div className="col-lg-4 d-none d-lg-block">
            <ListingSidebar filterFunctions={filterFunctions} />
          </div>

          {/* Mobile filter sidebar */}
          <div
            className="offcanvas offcanvas-start p-0"
            tabIndex={-1}
            id="listingSidebarFilter"
            aria-labelledby="listingSidebarFilterLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="listingSidebarFilterLabel">
                Listing Filter
              </h5>
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body p-0">
              <ListingSidebar filterFunctions={filterFunctions} />
            </div>
          </div>

          <div className="col-lg-8">
            <div className="row align-items-center mb20">
              <TopFilterBar
                pageContentTrac={pageContentTrac}
                colstyle={colstyle}
                setColstyle={setColstyle}
                setCurrentSortingOption={setCurrentSortingOption}
              />
            </div>

            <div className="row mt15">
              <FeaturedListings colstyle={colstyle} data={pageItems} />
            </div>

            <div className="row">
              <PaginationTwo
                pageCapacity={8}
                data={sortedFilteredData}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
