import React, { useState, useEffect } from "react";
import { Funnel, X } from "lucide-react";

const FilterButton = ({ label = "Filter by Date", onFilterChange, value = {} }) => {
  const [showDateFilters, setShowDateFilters] = useState(false);
  const [startDate, setStartDate] = useState(value.startDate || "");
  const [endDate, setEndDate] = useState(value.endDate || "");

  // Sync with external value when navigating back
  useEffect(() => {
    setStartDate(value.startDate || "");
    setEndDate(value.endDate || "");
  }, [value.startDate, value.endDate]);

  const toggleFilters = () => {
    setShowDateFilters(!showDateFilters);
  };

  const handleStartDateChange = (e) => {
    const val = e.target.value;
    setStartDate(val);
    onFilterChange({ startDate: val, endDate });
  };

  const handleEndDateChange = (e) => {
    const val = e.target.value;
    setEndDate(val);
    onFilterChange({ startDate, endDate: val });
  };

  const clearDates = () => {
    setStartDate("");
    setEndDate("");
    onFilterChange({ startDate: "", endDate: "" });
  };

  const buttonClassName = `btn d-flex align-items-center gap-2 ${
    showDateFilters || startDate || endDate ? "btn-secondary" : "btn-outline-secondary"
  }`;

  return (
    <div className="d-flex align-items-end gap-2 flex-wrap">
      <button onClick={toggleFilters} className={buttonClassName}>
        <Funnel size={16} />
        <span>{label}</span>
      </button>

      {showDateFilters && (
        <>
          <div>
            <label className="form-label">Start</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div>
            <label className="form-label">End</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>

          {(startDate || endDate) && (
            <button
              className="btn btn-outline-danger d-flex align-items-center"
              onClick={clearDates}
              title="Clear date filters"
            >
              <X size={16} />
              <span className="ms-1">Clear</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default FilterButton;

