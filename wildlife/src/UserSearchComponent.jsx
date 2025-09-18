import React, { useState, useEffect } from "react";
import { User, X } from "lucide-react";

const UserFilterButton = ({ label = "Filter by User", onUserFilterChange, value = "" }) => {
  const [showUserFilter, setShowUserFilter] = useState(false);
  const [userLogin, setUserLogin] = useState(value);

  // Keep internal state in sync with prop
  useEffect(() => {
    setUserLogin(value);
  }, [value]);

  const toggleFilters = () => {
    setShowUserFilter((prev) => !prev);
  };

  const handleUserLoginChange = (e) => {
    const val = e.target.value;
    setUserLogin(val);
    onUserFilterChange(val);
  };

  const clearFilter = () => {
    setUserLogin("");
    onUserFilterChange("");
  };

  const buttonClassName = `btn d-flex align-items-center gap-2 ${
    showUserFilter || userLogin ? "btn-secondary" : "btn-outline-secondary"
  }`;

  return (
    <div className="d-flex align-items-end gap-2 flex-wrap">
      <button onClick={toggleFilters} className={buttonClassName}>
        <User size={16} />
        <span>{label}</span>
      </button>

      {showUserFilter && (
        <>
          <div>
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={userLogin}
              onChange={handleUserLoginChange}
              placeholder="e.g., johndoe"
            />
          </div>

          {userLogin && (
            <button
              className="btn btn-outline-danger d-flex align-items-center"
              onClick={clearFilter}
              title="Clear user filter"
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

export default UserFilterButton;
