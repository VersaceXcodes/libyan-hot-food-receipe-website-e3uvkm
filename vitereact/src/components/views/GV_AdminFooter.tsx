import React from "react";
import { Link } from "react-router-dom";

const GV_AdminFooter: React.FC = () => {
  // Action: Handles navigation actions for admin footer links.
  const handleAdminFooterLinkClick = (target: string) => {
    console.log("Admin footer link clicked:", target);
    if (target === "documentation") {
      window.open("https://www.example.com/documentation", "_blank");
    } else if (target === "support") {
      window.open("https://www.example.com/support", "_blank");
    }
  };

  return (
    <>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <div className="mb-2 text-sm">
          © 2023 Libyan Hot Food Recipe. All rights reserved.
        </div>
        <div className="text-xs">
          <button
            onClick={() => handleAdminFooterLinkClick("documentation")}
            className="hover:underline mx-2"
          >
            Documentation
          </button>
          |
          <button
            onClick={() => handleAdminFooterLinkClick("support")}
            className="hover:underline mx-2"
          >
            Support
          </button>
        </div>
      </footer>
    </>
  );
};

export default GV_AdminFooter;