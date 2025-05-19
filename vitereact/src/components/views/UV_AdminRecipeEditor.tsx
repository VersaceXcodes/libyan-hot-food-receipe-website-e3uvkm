import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, notification_actions, ui_loader_actions } from "@/store/main";

type RecipeFormData = {
  title: string;
  description: string;
  recipe_category_id: string;
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
};

type Ingredient = {
  ingredient_name: string;
  measurement: string;
  order_index: number;
};

type Step = {
  step_number: number;
  instruction: string;
  media_url: string;
};

type FormState = {
  is_edit_mode: boolean;
  is_loading: boolean;
  error: string;
};

const UV_AdminRecipeEditor: React.FC = () => {
  const { recipe_id } = useParams<{ recipe_id?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth_state);
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1337";

  const [recipeFormData, setRecipeFormData] = useState<RecipeFormData>({
    title: "",
    description: "",
    recipe_category_id: "",
    cooking_time: 0,
    preparation_time: 0,
    servings: 0,
    spice_level: "",
    difficulty: "",
    main_image_url: "",
    additional_images: [],
    video_url: "",
    chef_tips: "",
    nutritional_info: ""
  });
  const [ingredientsData, setIngredientsData] = useState<Ingredient[]>([]);
  const [stepsData, setStepsData] = useState<Step[]>([]);
  const [formState, setFormState] = useState<FormState>({
    is_edit_mode: false,
    is_loading: false,
    error: ""
  });
  const [newAdditionalImage, setNewAdditionalImage] = useState<string>("");
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    ingredient_name: "",
    measurement: "",
    order_index: 1
  });
  const [newStep, setNewStep] = useState<Step>({
    step_number: 1,
    instruction: "",
    media_url: ""
  });

  useEffect(() => {
    if (recipe_id) {
      setFormState((prev) => ({ ...prev, is_edit_mode: true, is_loading: true }));
      axios
        .get(`${apiBaseURL}/admin/recipes/${recipe_id}`, {
          headers: { Authorization: `Bearer ${authState.token}` }
        })
        .then((response) => {
          const data = response.data;
          setRecipeFormData({
            title: data.title || "",
            description: data.description || "",
            recipe_category_id: data.recipe_category_id || "",
            cooking_time: data.cooking_time || 0,
            preparation_time: data.preparation_time || 0,
            servings: data.servings || 0,
            spice_level: data.spice_level || "",
            difficulty: data.difficulty || "",
            main_image_url: data.main_image_url || "",
            additional_images: data.additional_images || [],
            video_url: data.video_url || "",
            chef_tips: data.chef_tips || "",
            nutritional_info: data.nutritional_info || ""
          });
          setIngredientsData(data.ingredients || []);
          setStepsData(data.steps || []);
          setFormState((prev) => ({ ...prev, is_loading: false }));
        })
        .catch((error) => {
          console.error("Error loading recipe:", error);
          setFormState((prev) => ({
            ...prev,
            is_loading: false,
            error: "Failed to load recipe."
          }));
        });
    }
  }, [recipe_id, apiBaseURL, authState.token]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setRecipeFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const handleAddImage = () => {
    if (newAdditionalImage.trim() !== "") {
      setRecipeFormData((prev) => ({
        ...prev,
        additional_images: [...prev.additional_images, newAdditionalImage.trim()]
      }));
      setNewAdditionalImage("");
    }
  };

  const removeImage = (index: number) => {
    setRecipeFormData((prev) => {
      const updated = [...prev.additional_images];
      updated.splice(index, 1);
      return { ...prev, additional_images: updated };
    });
  };

  const handleAddIngredient = () => {
    if (newIngredient.ingredient_name.trim() !== "") {
      setIngredientsData((prev) => [...prev, newIngredient]);
      setNewIngredient({ ingredient_name: "", measurement: "", order_index: prev => prev.length + 1 } as Ingredient);
      // Reset order index to next value
      setNewIngredient((prev) => ({ ...prev, order_index: prev.order_index + 1 }));
    }
  };

  const removeIngredient = (index: number) => {
    setIngredientsData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    setIngredientsData((prev) =>
      prev.map((ingredient, i) =>
        i === index
          ? { ...ingredient, [field]: field === "order_index" ? Number(value) : value }
          : ingredient
      )
    );
  };

  const handleAddStep = () => {
    if (newStep.instruction.trim() !== "") {
      setStepsData((prev) => [...prev, newStep]);
      setNewStep({ step_number: stepsData.length + 2, instruction: "", media_url: "" });
    }
  };

  const removeStep = (index: number) => {
    setStepsData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStepChange = (
    index: number,
    field: keyof Step,
    value: string
  ) => {
    setStepsData((prev) =>
      prev.map((step, i) =>
        i === index
          ? { ...step, [field]: field === "step_number" ? Number(value) : value }
          : step
      )
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, is_loading: true, error: "" }));
    const payload = {
      ...recipeFormData,
      ingredients: ingredientsData,
      steps: stepsData
    };
    try {
      if (formState.is_edit_mode && recipe_id) {
        await axios.put(`${apiBaseURL}/admin/recipes/${recipe_id}`, payload, {
          headers: { Authorization: `Bearer ${authState.token}` }
        });
        dispatch(
          notification_actions.add_notification({
            message: "Recipe updated successfully",
            type: "success"
          })
        );
      } else {
        await axios.post(`${apiBaseURL}/admin/recipes`, payload, {
          headers: { Authorization: `Bearer ${authState.token}` }
        });
        dispatch(
          notification_actions.add_notification({
            message: "Recipe created successfully",
            type: "success"
          })
        );
      }
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Error submitting recipe:", err);
      setFormState((prev) => ({ ...prev, error: "Failed to submit recipe." }));
    }
    setFormState((prev) => ({ ...prev, is_loading: false }));
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) {
      setFormState((prev) => ({ ...prev, is_loading: true, error: "" }));
      try {
        await axios.delete(`${apiBaseURL}/admin/recipes/${recipe_id}`, {
          headers: { Authorization: `Bearer ${authState.token}` }
        });
        dispatch(
          notification_actions.add_notification({
            message: "Recipe deleted successfully",
            type: "success"
          })
        );
        navigate("/admin/dashboard");
      } catch (err: any) {
        console.error("Error deleting recipe:", err);
        setFormState((prev) => ({ ...prev, error: "Failed to delete recipe." }));
      }
      setFormState((prev) => ({ ...prev, is_loading: false }));
    }
  };

  const handleCancel = () => {
    navigate("/admin/dashboard");
  };

  return (
    <>
      <div className="container mx-auto p-4">
        {formState.is_loading && (
          <div className="text-blue-500">Loading...</div>
        )}
        {formState.error && (
          <div className="text-red-500 mb-4">{formState.error}</div>
        )}
        <h1 className="text-2xl font-bold mb-4">
          {formState.is_edit_mode ? "Edit Recipe" : "New Recipe"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={recipeFormData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={recipeFormData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Category ID</label>
              <input
                type="text"
                name="recipe_category_id"
                value={recipeFormData.recipe_category_id}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Cooking Time (mins)</label>
              <input
                type="number"
                name="cooking_time"
                value={recipeFormData.cooking_time}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Preparation Time (mins)</label>
              <input
                type="number"
                name="preparation_time"
                value={recipeFormData.preparation_time}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Servings</label>
              <input
                type="number"
                name="servings"
                value={recipeFormData.servings}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Spice Level</label>
              <input
                type="text"
                name="spice_level"
                value={recipeFormData.spice_level}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Difficulty</label>
              <input
                type="text"
                name="difficulty"
                value={recipeFormData.difficulty}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Main Image URL</label>
            <input
              type="text"
              name="main_image_url"
              value={recipeFormData.main_image_url}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Additional Images</label>
            <div className="flex space-x-2 mt-1">
              <input
                type="text"
                value={newAdditionalImage}
                onChange={(e) => setNewAdditionalImage(e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2"
                placeholder="Image URL"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-green-500 text-white rounded-md px-3 py-2"
              >
                Add
              </button>
            </div>
            <ul className="mt-2">
              {recipeFormData.additional_images.map((img, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span>{img}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium">Video URL</label>
            <input
              type="text"
              name="video_url"
              value={recipeFormData.video_url}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Chef Tips</label>
            <textarea
              name="chef_tips"
              value={recipeFormData.chef_tips}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nutritional Info</label>
            <textarea
              name="nutritional_info"
              value={recipeFormData.nutritional_info}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          {/* Ingredients Section */}
          <div>
            <h2 className="text-xl font-semibold mt-4">Ingredients</h2>
            <div className="flex space-x-2 mt-2">
              <input
                type="text"
                placeholder="Ingredient Name"
                value={newIngredient.ingredient_name}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    ingredient_name: e.target.value
                  })
                }
                className="border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Measurement"
                value={newIngredient.measurement}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    measurement: e.target.value
                  })
                }
                className="border border-gray-300 rounded-md p-2"
              />
              <input
                type="number"
                placeholder="Order Index"
                value={newIngredient.order_index}
                onChange={(e) =>
                  setNewIngredient({
                    ...newIngredient,
                    order_index: Number(e.target.value)
                  })
                }
                className="border border-gray-300 rounded-md p-2 w-20"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="bg-green-500 text-white rounded-md px-3 py-2"
              >
                Add Ingredient
              </button>
            </div>
            <ul className="mt-2">
              {ingredientsData.map((ing, index) => (
                <li key={index} className="flex items-center space-x-2 mt-1">
                  <input
                    type="text"
                    value={ing.ingredient_name}
                    onChange={(e) =>
                      handleIngredientChange(index, "ingredient_name", e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-2"
                  />
                  <input
                    type="text"
                    value={ing.measurement}
                    onChange={(e) =>
                      handleIngredientChange(index, "measurement", e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-2"
                  />
                  <input
                    type="number"
                    value={ing.order_index}
                    onChange={(e) =>
                      handleIngredientChange(index, "order_index", e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-2 w-20"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {/* Steps Section */}
          <div>
            <h2 className="text-xl font-semibold mt-4">Cooking Steps</h2>
            <div className="flex space-x-2 mt-2">
              <input
                type="number"
                placeholder="Step Number"
                value={newStep.step_number}
                onChange={(e) =>
                  setNewStep({
                    ...newStep,
                    step_number: Number(e.target.value)
                  })
                }
                className="border border-gray-300 rounded-md p-2 w-20"
              />
              <textarea
                placeholder="Instruction"
                value={newStep.instruction}
                onChange={(e) =>
                  setNewStep({ ...newStep, instruction: e.target.value })
                }
                className="border border-gray-300 rounded-md p-2 flex-grow"
              />
              <input
                type="text"
                placeholder="Media URL"
                value={newStep.media_url}
                onChange={(e) =>
                  setNewStep({ ...newStep, media_url: e.target.value })
                }
                className="border border-gray-300 rounded-md p-2"
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="bg-green-500 text-white rounded-md px-3 py-2"
              >
                Add Step
              </button>
            </div>
            <ul className="mt-2">
              {stepsData.map((step, index) => (
                <li key={index} className="flex flex-col border border-gray-300 rounded-md p-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={step.step_number}
                      onChange={(e) =>
                        handleStepChange(index, "step_number", e.target.value)
                      }
                      className="border border-gray-300 rounded-md p-2 w-20"
                    />
                    <textarea
                      value={step.instruction}
                      onChange={(e) =>
                        handleStepChange(index, "instruction", e.target.value)
                      }
                      className="border border-gray-300 rounded-md p-2 flex-grow"
                    />
                    <input
                      type="text"
                      value={step.media_url}
                      onChange={(e) =>
                        handleStepChange(index, "media_url", e.target.value)
                      }
                      className="border border-gray-300 rounded-md p-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Action Buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md px-4 py-2"
              disabled={formState.is_loading}
            >
              {formState.is_edit_mode ? "Update Recipe" : "Save Recipe"}
            </button>
            {formState.is_edit_mode && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white rounded-md px-4 py-2"
                disabled={formState.is_loading}
              >
                Delete Recipe
              </button>
            )}
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white rounded-md px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UV_AdminRecipeEditor;