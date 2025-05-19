import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

interface RecipeSummary {
  recipe_id: string;
  title: string;
  description: string;
  image_url: string;
  cooking_time: number;
  spice_level: string;
  difficulty: string;
}

interface RecipeCategory {
  category_id: string;
  category_name: string;
}

interface PaginationData {
  current_page: number;
  total_pages: number;
  limit: number;
}

interface FilterOptions {
  spice_level: string;
  recipe_category_id: string;
}

const UV_RecipeListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get URL parameters with defaults
  const initial_page = parseInt(searchParams.get("page") ?? "1", 10);
  const initial_limit = parseInt(searchParams.get("limit") ?? "10", 10);
  const initial_spice_level = searchParams.get("spice_level") ?? "";
  const initial_recipe_category_id = searchParams.get("recipe_category_id") ?? "";
  const initial_search_query = searchParams.get("search") ?? "";
  const initial_sort = searchParams.get("sort") ?? "latest";

  // State for recipe list
  const [recipe_list, setRecipeList] = useState<RecipeSummary[]>([]);
  // State for pagination
  const [pagination_data, setPaginationData] = useState<PaginationData>({
    current_page: initial_page,
    total_pages: 0,
    limit: initial_limit,
  });
  // State for filters
  const [filter_options, setFilterOptions] = useState<FilterOptions>({
    spice_level: initial_spice_level,
    recipe_category_id: initial_recipe_category_id,
  });
  // State for sort option
  const [sort_option, setSortOption] = useState<string>(initial_sort);
  // State for search query
  const [search_query, setSearchQuery] = useState<string>(initial_search_query);
  // State for recipe categories to populate category filter dropdown
  const [recipe_categories, setRecipeCategories] = useState<RecipeCategory[]>([]);
  // Local loading state
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch recipe categories for the category filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:1337/recipe_categories");
        setRecipeCategories(response.data);
      } catch (error) {
        console.error("Error fetching recipe categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Function to fetch recipes based on current state and URL parameters
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination_data.current_page,
        limit: pagination_data.limit,
        spice_level: filter_options.spice_level,
        recipe_category_id: filter_options.recipe_category_id,
        search: search_query,
        sort: sort_option,
      };
      const response = await axios.get("http://localhost:1337/recipes", { params });
      // Assume the backend returns an array of recipes
      const recipes = response.data as RecipeSummary[];
      setRecipeList(recipes);
      // Dummy pagination update: if number of recipes is less than limit, it's the last page.
      setPaginationData(prev => ({
        current_page: prev.current_page,
        total_pages: recipes.length < prev.limit ? prev.current_page : prev.current_page + 1,
        limit: prev.limit,
      }));
    } catch (error) {
      console.error("Error fetching recipes", error);
    } finally {
      setLoading(false);
    }
  };

  // Sync state with URL parameters and fetch recipes when any dependency changes
  useEffect(() => {
    const newParams: Record<string, string> = {
      page: pagination_data.current_page.toString(),
      limit: pagination_data.limit.toString(),
      spice_level: filter_options.spice_level,
      recipe_category_id: filter_options.recipe_category_id,
      search: search_query,
      sort: sort_option,
    };
    // Remove keys with empty string
    Object.keys(newParams).forEach(key => {
      if (newParams[key] === "") {
        delete newParams[key];
      }
    });
    setSearchParams(newParams);
    fetchRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination_data.current_page,
    pagination_data.limit,
    filter_options,
    search_query,
    sort_option,
  ]);

  // Handler functions for filter and search changes
  const handleSpiceLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions(prev => ({ ...prev, spice_level: event.target.value }));
    setPaginationData(prev => ({ ...prev, current_page: 1 }));
  };

  const handleRecipeCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions(prev => ({ ...prev, recipe_category_id: event.target.value }));
    setPaginationData(prev => ({ ...prev, current_page: 1 }));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    setPaginationData(prev => ({ ...prev, current_page: 1 }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPaginationData(prev => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPaginationData(prev => ({ ...prev, current_page: newPage }));
  };

  return (
    <>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Recipe Listing</h1>
        {/* Filter & Search Section */}
        <div className="flex flex-wrap items-center mb-4 gap-4">
          {/* Search Input */}
          <input
            type="text"
            value={search_query}
            onChange={handleSearchChange}
            placeholder="Search recipes..."
            className="border p-2 rounded-md"
          />
          {/* Spice Level Filter */}
          <select
            value={filter_options.spice_level}
            onChange={handleSpiceLevelChange}
            className="border p-2 rounded-md"
          >
            <option value="">All Spice Levels</option>
            <option value="mild">Mild</option>
            <option value="medium">Medium</option>
            <option value="hot">Hot</option>
          </select>
          {/* Recipe Category Filter */}
          <select
            value={filter_options.recipe_category_id}
            onChange={handleRecipeCategoryChange}
            className="border p-2 rounded-md"
          >
            <option value="">All Categories</option>
            {recipe_categories.map(category => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
          {/* Sort Option */}
          <select
            value={sort_option}
            onChange={handleSortChange}
            className="border p-2 rounded-md"
          >
            <option value="latest">Latest</option>
            <option value="most_popular">Most Popular</option>
            <option value="quickest">Quickest to Prepare</option>
          </select>
        </div>

        {/* Recipe Cards Grid */}
        {loading ? (
          <div className="text-center">Loading recipes...</div>
        ) : recipe_list.length === 0 ? (
          <div className="text-center">No recipes found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipe_list.map(recipe => (
              <div
                key={recipe.recipe_id}
                className="border rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
                  <p className="text-gray-600 mb-2">{recipe.description}</p>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Cooking Time: {recipe.cooking_time} mins</span>
                    <span>Spice: {recipe.spice_level}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Difficulty: {recipe.difficulty}</span>
                  </div>
                  <Link
                    to={`/recipes/${recipe.recipe_id}`}
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            onClick={() => handlePageChange(pagination_data.current_page - 1)}
            disabled={pagination_data.current_page <= 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {pagination_data.current_page}</span>
          <button
            onClick={() => handlePageChange(pagination_data.current_page + 1)}
            disabled={recipe_list.length < pagination_data.limit}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default UV_RecipeListing;