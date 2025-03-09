import React, { useState, useEffect, useRef } from "react";
import "./TokenSelect.css";

const TokenSelect = ({ value, onChange, tokens }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tokenImages, setTokenImages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const context = import.meta.glob('../assets/*.svg');

  const dropdownRef = useRef(null); // Reference for the dropdown menu
  const selectRef = useRef(null); // Reference for the select box

  // Load token images once when the component is mounted
  useEffect(() => {
    const loadTokenImages = async () => {
      try {
        const images = {};

        // Process each file and store the images
        for (const path in context) {
          const tokenName = path.split('/').pop().replace('.svg', '').toUpperCase();
          const tokenImage = await context[path]();
          images[tokenName] = tokenImage.default;
        }

        setTokenImages(images);
      } catch (error) {
        console.error("Error loading token images:", error);
      }
    };

    loadTokenImages();
  }, []);

  // Function to get the token image
  const getTokenImage = (token) => {
    const formattedToken = token.toUpperCase();
    return tokenImages[formattedToken] ? tokenImages[formattedToken] : null;
  };

  // Close dropdown if click is outside the select area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current && !selectRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listener to document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filtered tokens based on the search query
  const filteredTokens = tokens.filter((token) =>
    token.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="token-select-container" ref={selectRef}>
      {/* Selected Token Display */}
      <div className="token-select-display" onClick={() => setIsOpen(!isOpen)}>
        <img
          src={getTokenImage(value)}
          alt={value}
          width="20"
          height="20"
          className="token-image"
          onError={(e) => (e.target.style.display = "none")}
        />
        {value}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="token-dropdown" ref={dropdownRef}>
          {/* Search Bar */}
          <div className="token-search-bar">
            <input
              type="text"
              placeholder="Search tokens"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Token Options */}
          {filteredTokens.map((token) => (
            <div
              key={token}
              className="token-option"
              onClick={() => {
                onChange(token);
                setIsOpen(false);
                setSearchQuery(""); // Clear search when selecting a token
              }}
            >
              <img
                src={getTokenImage(token)}
                alt={token}
                width="20"
                height="20"
                className="token-image"
                onError={(e) => (e.target.style.display = "none")}
              />
              {token}
            </div>
          ))}

          {/* If no tokens match the search */}
          {filteredTokens.length === 0 && (
            <div className="no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenSelect;



