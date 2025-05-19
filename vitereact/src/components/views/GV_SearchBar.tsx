import React, { KeyboardEvent, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState, search_actions } from "@/store/main";

const GV_SearchBar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current search query from global state
  const search_query = useSelector((state: RootState) => state.search_state.search_query);

  // Update global search query on input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(search_actions.set_search_query(e.target.value));
  };

  // Trigger search when user presses Enter or clicks the search icon.
  const triggerSearch = () => {
    // Navigate to the Recipe Listing page with the search query as a URL parameter.
    if (location.pathname !== "/recipes") {
      navigate(`/recipes?search=${encodeURIComponent(search_query)}`);
    } else {
      // If already on the recipes page, update the search query parameter to trigger new filtering.
      navigate(`/recipes?search=${encodeURIComponent(search_query)}`);
    }
  };

  // Handle key press events -- trigger search if Enter key is pressed.
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      triggerSearch();
    }
  };

  return (
    <>
      <div className="w-full max-w-xl mx-auto my-4">
        <div className="relative">
          <input
            type="text"
            value={search_query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search recipes by name or ingredient…"
            className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={triggerSearch}
            className="absolute right-0 top-0 mt-2 mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1016.65 2a7.5 7.5 0 000 14.65z"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default GV_SearchBar;