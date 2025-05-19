import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface HeroBannerData {
  image_url: string;
  intro_text: string;
  cta_label: string;
  cta_link: string;
}

interface FeaturedRecipe {
  recipe_id: string;
  title: string;
  teaser: string;
  image_url: string;
}

const UV_Landing: React.FC = () => {
  const [hero_banner_data] = useState<HeroBannerData>({
    image_url: "https://picsum.photos/1200/400",
    intro_text: "Discover the authentic flavors of Libyan cuisine!",
    cta_label: "Explore Recipes",
    cta_link: "/recipes",
  });

  const [featured_recipes, setFeaturedRecipes] = useState<FeaturedRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/recipes`,
          {
            params: {
              limit: 6,
            },
          }
        );
        // Map the response data to our expected featured recipe structure.
        const mappedRecipes = response.data.map((recipe: any) => ({
          recipe_id: recipe.recipe_id,
          title: recipe.title,
          teaser: recipe.description,
          image_url: recipe.main_image_url,
        }));
        setFeaturedRecipes(mappedRecipes);
      } catch (error) {
        console.error("Error fetching featured recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRecipes();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        <div
          className="h-96 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero_banner_data.image_url})` }}
        >
          <div className="bg-black bg-opacity-50 h-full flex flex-col justify-center items-center">
            <h1 className="text-white text-4xl font-bold mb-4 text-center">
              {hero_banner_data.intro_text}
            </h1>
            <Link
              to={hero_banner_data.cta_link}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg"
            >
              {hero_banner_data.cta_label}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Featured Recipes</h2>
        {loading ? (
          <p className="text-center">Loading featured recipes...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {featured_recipes.map((recipe) => (
              <div
                key={recipe.recipe_id}
                className="relative group rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{recipe.title}</h3>
                  <p className="text-gray-600">{recipe.teaser}</p>
                </div>
                <Link
                  to={`/recipes/${recipe.recipe_id}`}
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
                >
                  <span className="text-white font-medium text-lg">
                    View Recipe
                  </span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default UV_Landing;