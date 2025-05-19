import React from "react";
import { Link, useNavigate } from "react-router-dom";

const GV_Footer: React.FC = () => {
  const navigate = useNavigate();

  // Default footer links as per the data map
  const footer_links = [
    { label: "Privacy Policy", url: "/privacy" },
    { label: "Terms of Use", url: "/terms" },
    { label: "Facebook", url: "https://www.facebook.com" },
    { label: "Twitter", url: "https://www.twitter.com" }
  ];

  // Function to handle footer link clicks.
  // For external links we use window.open, while internal links navigation is handled by <Link>.
  const handleFooterLinkClick = (url: string) => {
    if (url.startsWith("http")) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      // For internal links, navigation is handled by the <Link> component.
      // Alternatively, one could use navigate(url) if a programmatic navigation is needed.
    }
  };

  return (
    <>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4">
            {footer_links.map((link, index) =>
              link.url.startsWith("http") ? (
                <a
                  key={index}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleFooterLinkClick(link.url);
                  }}
                  className="hover:text-gray-300"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={index}
                  to={link.url}
                  onClick={() => handleFooterLinkClick(link.url)}
                  className="hover:text-gray-300"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
          <div className="mt-2 md:mt-0">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Libyan Hot Food Recipe Website. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default GV_Footer;