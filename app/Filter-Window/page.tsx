"use client";
import React, { useState, useEffect } from "react";
import styles from "./AllergyFilterPage.module.css";

const AllergyFilterPage = () => {
  const [selectedHideAllergies, setSelectedHideAllergies] = useState(() => {
    const storedHideAllergies = localStorage.getItem("hideAllergies");
    return storedHideAllergies ? JSON.parse(storedHideAllergies) : [];
  });

  const [selectedShowAllergies, setSelectedShowAllergies] = useState(() => {
    const storedShowAllergies = localStorage.getItem("showAllergies");
    return storedShowAllergies ? JSON.parse(storedShowAllergies) : [];
  });

  const hideAllergies = [
    "milk",
    "eggs",
    "fish",
    "shellfish",
    "treenut",
    "nuts",
    "wheat",
    "soy",
    "gluten",
    "sesame",
    "alcohol",
  ];
  const showAllergies = [
    "eggs",
    "fish",
    "gluten",
    "milk",
    "nuts",
    "soy",
    "vegan",
    "veggie",
    "pork",
    "beef",
    "halal",
    "shellfish",
    "treenut",
    "alcohol",
    "sesame",
  ];

  const handleReset = () => {
    setSelectedHideAllergies([]);
    setSelectedShowAllergies([]);
  };

  const handleCancel = () => {
    setSelectedHideAllergies([]);
    setSelectedShowAllergies([]);
    window.location.href = "global_search";
  };

  const handleApply = () => {
    localStorage.setItem(
      "hideAllergies",
      JSON.stringify(selectedHideAllergies),
    );
    localStorage.setItem(
      "showAllergies",
      JSON.stringify(selectedShowAllergies),
    );
    console.log("Hide Allergies:", selectedHideAllergies);
    console.log("Show Allergies:", selectedShowAllergies);
    window.location.href = "global_search";
  };

  const handleCheckboxChange = (allergy, type) => {
    if (type === "hide") {
      if (selectedHideAllergies.includes(allergy)) {
        setSelectedHideAllergies(
          selectedHideAllergies.filter((item) => item !== allergy),
        );
      } else {
        setSelectedHideAllergies([...selectedHideAllergies, allergy]);
      }
    } else {
      if (selectedShowAllergies.includes(allergy)) {
        setSelectedShowAllergies(
          selectedShowAllergies.filter((item) => item !== allergy),
        );
      } else {
        setSelectedShowAllergies([...selectedShowAllergies, allergy]);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={`${styles.filterText} ${styles.filterTopLeft}`}>Filter</h1>
      <div className={styles.columns}>
        <div className={styles.column}>
          <h2 className="flex font-medium text-2xl text-[#003C6C] items-center justify-center pb-5">
            Hide Items that contain:
          </h2>
          <div>
            {hideAllergies.map((allergy, index) => (
              <div key={index} className={styles.checkbox}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedHideAllergies.includes(allergy)}
                    onChange={() => handleCheckboxChange(allergy, "hide")}
                  />
                  {allergy}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.column}>
          <h2 className="flex font-medium text-2xl text-[#003C6C] items-center justify-center pb-5">
            Show items that match:
          </h2>
          <div>
            {showAllergies.map((allergy, index) => (
              <div key={index} className={styles.checkbox}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedShowAllergies.includes(allergy)}
                    onChange={() => handleCheckboxChange(allergy, "show")}
                  />
                  {allergy}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.submitButtons}>
        <button
          className={`${styles.submitButton} flex font-medium text-2xl text-[#003C6C] items-center justify-center pb-5`}
          style={{ padding: "0 1rem", textDecoration: "none" }}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className={`${styles.submitButton} flex font-medium text-2xl text-[#003C6C] items-center justify-center pb-5`}
          style={{ padding: "0 1rem", textDecoration: "none" }}
          onClick={handleReset}
        >
          Reset
        </button>
        <button
          className={`${styles.submitButton} flex font-medium text-2xl text-[#003C6C] items-center justify-center pb-5`}
          style={{ padding: "0 1rem", textDecoration: "none" }}
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default AllergyFilterPage;
