import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { SearchBar, ResultList } from "./SearchComponents";
import DocumentDetails from "./DocumentDetails";
import MapPicker from "./MapPicker";
import FilterButton from "./FilterButton"; 
import UserFilterButton from "./UserSearchComponent"; 
import "bootstrap/dist/css/bootstrap.min.css";

function AppRoutes() {
  const [query, setQuery] = useState(""); // For general text search
  const [results, setResults] = useState([]); // Unified results state
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null); // For geospatial search
  const [darkMode, setDarkMode] = useState(false);
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" }); // For date filtering
  const [userFilter, setUserFilter] = useState(""); 

  const locationRouter = useLocation();

  // useEffect to handle routing state 
  useEffect(() => {
    if (locationRouter.pathname === "/" && locationRouter.state) {
      const {
        query: q,
        results: r,
        location: loc,
        filters,
      } = locationRouter.state;

      if (q) setQuery(q);
      if (r) setResults(r);
      if (loc) setLocation(loc);
      if (filters) {
        setUserFilter(filters.userLogin || "");
        setDateFilter({
          startDate: filters.startDate || "",
          endDate: filters.endDate || ""
        });
      }
    }
  }, [locationRouter]);


  // Combining all filters
  const handleSearch = async () => {
    if (!query.trim() && !userFilter.trim() && !location && !dateFilter.startDate && !dateFilter.endDate) {
      setResults([]); 
      return;
    }
    
    setLoading(true);

    let url = `/search?`;
    const params = [];

    if (query.trim()) {
      params.push(`query=${encodeURIComponent(query)}`);
    }

    if (userFilter.trim()) { 
      params.push(`user_login=${encodeURIComponent(userFilter)}`);
    }

    if (location) {
      params.push(`lat=${location.lat}`);
      params.push(`lng=${location.lng}`);
      params.push(`radius=${location.radius}`);
    }

    if (dateFilter?.startDate) {
      params.push(`start_date=${encodeURIComponent(dateFilter.startDate)}`);
    }

    if (dateFilter?.endDate) {
      params.push(`end_date=${encodeURIComponent(dateFilter.endDate)}`);
    }

    // Joins all parameters with '&'
    url += params.join('&');

    try {
      const res = await fetch(url);
      if (!res.ok) {
        // If API returns 404 for "No results found matching combined criteria"
        if (res.status === 404) {
          setResults([]); 
          return; 
        }
        const errorData = await res.json();
        throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
        handleSearch();
    }, 300); 
    return () => clearTimeout(timer);
  }, [query, userFilter, location, dateFilter]); 

  // Dark mode toggle 
  useEffect(() => {
    document.body.className = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  }, [darkMode]);

  return (
    <>
      <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"} shadow`}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img src="/logo.svg" alt="Logo" width="30" height="30" className="me-2" />
            <strong>Fish Search</strong>
          </Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="btn btn-outline-secondary ms-auto"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </nav>

      <main className="my-4 px-3">
<Routes>
  <Route
    path="/"
    element={
      <>
        {/* Main general search bar */}
        <div className="row mb-3">
          <div className="col-12">
            <SearchBar
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* Filter buttons */}
        <div className="row mb-3 gx-2 align-items-end justify-content-start">
          <div className="col-12 col-md-auto mb-2">
            <UserFilterButton
              onUserFilterChange={setUserFilter}
              value={userFilter}
            />

          </div>
          <div className="col-12 col-md-auto mb-2">
            <FilterButton
              onFilterChange={setDateFilter}
              value={dateFilter}
            />

          </div>
        </div>

        <MapPicker onLocationChange={setLocation} value={location} />


        {loading ? (
          <p className="mt-3">Loading...</p>
        ) : (
          <>
            {results.length > 0 ? (
              <ResultList
                results={results}
                query={query}
                location={location}
                filters={{ userLogin: userFilter, ...dateFilter }}
              />
            ) : (
              (query.trim() ||
                userFilter.trim() ||
                location ||
                dateFilter.startDate ||
                dateFilter.endDate) &&
              !loading && (
                <p className="mt-3">No results found for your search.</p>
              )
            )}
          </>
        )}
      </>
    }
  />
  <Route path="/document/:id" element={<DocumentDetails />} />
</Routes>

      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}