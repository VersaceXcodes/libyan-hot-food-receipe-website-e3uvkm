import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

interface Ingredient {
  ingredient_id: string;
  ingredient_name: string;
  measurement: string;
  order_index: number;
}

interface Step {
  step_id: string;
  step_number: number;
  instruction: string;
  media_url: string;
}

interface RecipeDetail {
  recipe_id: string;
  title: string;
  description: string;
  cooking_time: number;
  preparation_time: number;
  servings: number;
  spice_level: string;
  difficulty: string;
  main_image_url: string;
  additional_images: string[];
  video_url: string;
  chef_tips: string;
  nutritional_info: string;
  created_at: string;
  updated_at: string;
  recipe_category_id: string;
  ingredients: Ingredient[];
  steps: Step[];
}

interface RecipeSummary {
  recipe_id: string;
  title: string;
  main_image_url: string;
  recipe_category_id: string;
}

const UV_RecipeDetail: React.FC = () => {
  const { recipe_id } = useParams<{ recipe_id: string }>();
  const [recipe_detail, setRecipeDetail] = useState<RecipeDetail | null>(null);
  const [is_media_loading, setIsMediaLoading] = useState<boolean>(false);
  const [related_recipes, setRelatedRecipes] = useState<RecipeSummary[]>([]);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:1337";

  // Function to fetch the full details of the recipe from the backend API
  const fetchRecipeDetail = async () => {
    if (!recipe_id) return;
    setIsMediaLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/recipes/${recipe_id}`);
      if (response.ok) {
        const data: RecipeDetail = await response.json();
        setRecipeDetail(data);
      } else {
        console.error("Failed to fetch recipe detail:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching recipe detail:", error);
    } finally {
      setIsMediaLoading(false);
    }
  };

  // Function to fetch related recipes based on the recipe_category_id
  const fetchRelatedRecipes = async () => {
    if (recipe_detail && recipe_detail.recipe_category_id) {
      try {
        const url = `${apiBaseUrl}/recipes?recipe_category_id=${encodeURIComponent(
          recipe_detail.recipe_category_id
        )}&limit=4`;
        const response = await fetch(url);
        if (response.ok) {
          const data: RecipeSummary[] = await response.json();
          // Exclude the current recipe from related recipes
          const filtered = data.filter(
            (recipe) => recipe.recipe_id !== recipe_detail.recipe_id
          );
          setRelatedRecipes(filtered);
        } else {
          console.error("Failed to fetch related recipes:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching related recipes:", error);
      }
    }
  };

  // Function to handle social sharing action based on platform
  const handleSocialShare = (platform: string) => {
    if (!recipe_detail) return;
    const currentUrl = window.location.href;
    let shareUrl = "";
    if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`;
    } else if (platform === "twitter") {
      const text = recipe_detail.title;
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(currentUrl)}`;
    } else if (platform === "whatsapp") {
      const text = recipe_detail.title;
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        text + " " + currentUrl
      )}`;
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (recipe_id) {
      fetchRecipeDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe_id]);

  useEffect(() => {
    if (recipe_detail && recipe_detail.recipe_category_id) {
      fetchRelatedRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe_detail]);

  return (
    <>
      {!recipe_detail ? (
        <div className="p-4 text-center text-lg">Loading...</div>
      ) : (
        <>
          {/* Header Section with Main Image and Title */}
          <div
            className="w-full h-64 bg-cover bg-center"
            style={{ backgroundImage: `url(${recipe_detail.main_image_url})` }}
          >
            <div className="bg-black bg-opacity-50 h-full flex items-center justify-center">
              <h1 className="text-white text-4xl font-bold">
                {recipe_detail.title}
              </h1>
            </div>
          </div>

          {/* Recipe Content Section */}
          <div className="p-4">
            <p className="text-gray-700 mb-2">{recipe_detail.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div>Cooking Time: {recipe_detail.cooking_time} mins</div>
              <div>Preparation Time: {recipe_detail.preparation_time} mins</div>
              <div>Servings: {recipe_detail.servings}</div>
              <div>Spice Level: {recipe_detail.spice_level}</div>
              <div>Difficulty: {recipe_detail.difficulty}</div>
            </div>

            {/* Optional Additional Details */}
            {recipe_detail.nutritional_info && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">
                  Nutritional Information
                </h2>
                <p className="text-gray-700">{recipe_detail.nutritional_info}</p>
              </div>
            )}
            {recipe_detail.chef_tips && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Chef Tips</h2>
                <p className="text-gray-700">{recipe_detail.chef_tips}</p>
              </div>
            )}

            {/* Ingredients List */}
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
              <ul className="list-disc list-inside">
                {recipe_detail.ingredients
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((ingredient) => (
                    <li key={ingredient.ingredient_id}>
                      {ingredient.ingredient_name} - {ingredient.measurement}
                    </li>
                  ))}
              </ul>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Instructions</h2>
              {recipe_detail.steps
                .sort((a, b) => a.step_number - b.step_number)
                .map((step) => (
                  <div key={step.step_id} className="mb-4">
                    <h3 className="text-xl font-semibold">
                      Step {step.step_number}
                    </h3>
                    <p className="text-gray-700">{step.instruction}</p>
                    {step.media_url && (
                      <div className="mt-2">
                        <img
                          src={step.media_url}
                          alt={`Step ${step.step_number} illustration`}
                          className="w-full h-auto rounded"
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Social Sharing Buttons */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => handleSocialShare("facebook")}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Share on Facebook
              </button>
              <button
                onClick={() => handleSocialShare("twitter")}
                className="bg-blue-400 text-white px-4 py-2 rounded"
              >
                Share on Twitter
              </button>
              <button
                onClick={() => handleSocialShare("whatsapp")}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Share on WhatsApp
              </button>
            </div>

            {/* Related Recipes Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Related Recipes</h2>
              {related_recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {related_recipes.map((recipe) => (
                    <div
                      key={recipe.recipe_id}
                      className="border rounded overflow-hidden"
                    >
                      <img
                        src={recipe.main_image_url}
                        alt={recipe.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2">
                        <h3 className="text-lg font-medium">{recipe.title}</h3>
                        <Link
                          to={`/recipes/${recipe.recipe_id}`}
                          className="text-blue-500 hover:underline"
                        >
                          View Recipe
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  No related recipes available.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UV_RecipeDetail;