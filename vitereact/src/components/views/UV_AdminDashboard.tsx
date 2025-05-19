import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, notification_actions, ui_loader_actions } from "@/store/main";

interface RecipeSummary {
  recipe_id: string;
  title: string;
  created_at: string;
  recipe_status: string;
}

interface AdminOverviewData {
  recent_recipes: Array<{
    recipe_id: string;
    title: string;
    created_at: string;
  }>;
  stats: {
    total_recipes: number;
    active_recipes: number;
    archived_recipes: number;
  };
}

const UV_AdminDashboard: React.FC = () => {
  const [admin_overview_data, set_admin_overview_data] = useState<AdminOverviewData>({
    recent_recipes: [],
    stats: {
      total_recipes: 0,
      active_recipes: 0,
      archived_recipes: 0
    }
  });
  const [isLoading, set_isLoading] = useState<boolean>(true);

  const dispatch = useDispatch();
  const auth_state = useSelector((state: RootState) => state.auth_state);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        dispatch(ui_loader_actions.set_ui_loading(true));
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/recipes`,
          {
            headers: {
              Authorization: `Bearer ${auth_state.token}`
            },
            params: {
              limit: 100
            }
          }
        );
        let recipes: RecipeSummary[] = response.data;
        // Sort recipes by created_at descending
        recipes.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        const recent_recipes = recipes.slice(0, 5).map(recipe => ({
          recipe_id: recipe.recipe_id,
          title: recipe.title,
          created_at: recipe.created_at
        }));
        const stats = {
          total_recipes: recipes.length,
          active_recipes: recipes.filter(r => r.recipe_status === "active").length,
          archived_recipes: recipes.filter(r => r.recipe_status === "archived").length
        };
        set_admin_overview_data({ recent_recipes, stats });
      } catch (error: any) {
        dispatch(
          notification_actions.add_notification({
            message: error.message || "Failed to fetch admin data",
            type: "error"
          })
        );
      } finally {
        dispatch(ui_loader_actions.set_ui_loading(false));
        set_isLoading(false);
      }
    };
    fetchOverviewData();
  }, [dispatch, auth_state.token]);

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="mb-6">
          <Link
            to="/admin/recipes/new"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New Recipe
          </Link>
        </div>
        {isLoading ? (
          <div className="text-center text-lg">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">Total Recipes</h2>
                <p className="text-2xl">{admin_overview_data.stats.total_recipes}</p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">Active Recipes</h2>
                <p className="text-2xl">{admin_overview_data.stats.active_recipes}</p>
              </div>
              <div className="p-4 bg-white shadow rounded">
                <h2 className="text-xl font-semibold">Archived Recipes</h2>
                <p className="text-2xl">{admin_overview_data.stats.archived_recipes}</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Recent Recipes</h2>
              {admin_overview_data.recent_recipes.length === 0 ? (
                <p>No recent recipes found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Title</th>
                        <th className="py-2 px-4 border-b">Created At</th>
                        <th className="py-2 px-4 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {admin_overview_data.recent_recipes.map(recipe => (
                        <tr key={recipe.recipe_id}>
                          <td className="py-2 px-4 border-b">{recipe.title}</td>
                          <td className="py-2 px-4 border-b">
                            {new Date(recipe.created_at).toLocaleString()}
                          </td>
                          <td className="py-2 px-4 border-b">
                            <Link
                              to={`/admin/recipes/${recipe.recipe_id}`}
                              className="text-blue-500 hover:underline"
                            >
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UV_AdminDashboard;