import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface StaticContent {
  page_key: string;
  title: string;
  content: string;
  updated_at: string;
}

const UV_About: React.FC = () => {
  const [static_content, setStaticContent] = useState<StaticContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Function to fetch static content from backend API
  const fetchStaticContent = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/static_pages/about`
      );
      setStaticContent(response.data);
    } catch (err) {
      console.error("Error fetching static content:", err);
      setError("Failed to load content. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on component mount
  useEffect(() => {
    fetchStaticContent();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg">Loading About Page...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          {/* Supportive banner image */}
          <div className="mb-8">
            <img
              src="https://picsum.photos/seed/about/1200/400"
              alt="About Banner"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
          {/* Display static content title */}
          <h1 className="text-4xl font-bold mb-4 text-center">
            {static_content?.title}
          </h1>
          {/* Display main content rendered as HTML */}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: static_content?.content || "" }}
          />
          {/* Display the last updated timestamp */}
          <div className="mt-4 text-gray-500 text-sm">
            Last updated:{" "}
            {static_content?.updated_at
              ? new Date(static_content.updated_at).toLocaleDateString()
              : ""}
          </div>
        </div>
      )}
    </>
  );
};

export default UV_About;