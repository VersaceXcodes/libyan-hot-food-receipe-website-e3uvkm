import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, auth_actions } from "@/store/main";

const GV_AdminNav: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for the active navigation item, defaulted to "dashboard"
  const [active_admin_item, set_active_admin_item] = useState("dashboard");

  // Get global auth state for possible additional checks (if needed)
  const auth_state = useSelector((state: RootState) => state.auth_state);

  // Handler for navigation item clicks; update active item
  const handle_item_click = (item: string) => {
    set_active_admin_item(item);
  };

  // Logout handler: clears authentication from the global store and navigates to login
  const handle_logout = () => {
    dispatch(auth_actions.clear_auth_state());
    navigate("/admin/login");
  };

  return (
    <>
      <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
        <div className="flex space-x-4">
          <Link
            to="/admin/dashboard"
            onClick={() => handle_item_click("dashboard")}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              active_admin_item === "dashboard" ? "bg-gray-900" : "hover:bg-gray-700"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/recipes/new"
            onClick={() => handle_item_click("manage_recipes")}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              active_admin_item === "manage_recipes" ? "bg-gray-900" : "hover:bg-gray-700"
            }`}
          >
            Manage Recipes
          </Link>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handle_logout}
            className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 text-red-400"
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default GV_AdminNav;