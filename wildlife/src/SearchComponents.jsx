// SearchComponents.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SearchResults.css";

// SearchBar Component
export function SearchBar({ query, setQuery, onSearch }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="input-group">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        className="form-control rounded-start"
        placeholder="Search for a fish..."
      />
      <button onClick={onSearch} className="btn btn-primary rounded-end">
        Search
      </button>
    </div>
  );
}

// ResultCard Component
export function ResultCard({ item, query, results, location, filters }) {
  return (
    <Link
      to={`/document/${item._id}`}
      state={{ query, results, location, filters }}
      className="text-decoration-none text-dark"
    >
      <div className="card w-100 shadow-sm p-3">
        <h5 className="card-title">
          {item.common_name}{" "}
          <small className="text-muted">({item.scientific_name})</small>
        </h5>
        <p className="card-text">{item.description}</p>
        <p className="card-text">
          <small className="text-muted">
            Observed at: {item.place_guess}
            <br />
            Time: {item.time_observed_at}
          </small>
        </p>
      </div>
    </Link>
  );
}

// Pagination Helper
const getPageNumbers = (totalPages, currentPage, maxVisible = 7) => {
  const pages = [];
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (currentPage <= half) {
    end = Math.min(totalPages, maxVisible);
  } else if (currentPage + half >= totalPages) {
    start = Math.max(1, totalPages - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};

// ResultList Component with Pagination
export function ResultList({ results, query, location, filters }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (results.length === 0) return <p>No results found.</p>;

  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = results.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="mb-3">
        <strong>{results.length}</strong> result{results.length !== 1 ? "s" : ""} found
        {query && <> for "<em>{query}</em>"</>}
      </div>

      <div className="row">
        {paginatedResults.map((item) => (
          <div key={item._id} className="col-12 mb-3">
            <ResultCard
              item={item}
              query={query}
              results={results}
              location={location}
              filters={filters}
            />
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination flex-wrap">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                Previous
              </button>
            </li>

            {currentPage > 4 && (
              <>
                <li className="page-item">
                  <button className="page-link" onClick={() => setCurrentPage(1)}>1</button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              </>
            )}

            {getPageNumbers(totalPages, currentPage).map((page) => (
              <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(page)}>
                  {page}
                </button>
              </li>
            ))}

            {currentPage < totalPages - 3 && (
              <>
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
                <li className="page-item">
                  <button className="page-link" onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </button>
                </li>
              </>
            )}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
