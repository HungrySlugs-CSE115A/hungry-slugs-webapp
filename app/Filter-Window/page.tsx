"use client";
import React, { useState, useEffect } from 'react';
import styles from './AllergyFilterPage.module.css';

const AllergyFilterPage = () => {
  const [selectedHideAllergies, setSelectedHideAllergies] = useState([]);
  const [selectedShowAllergies, setSelectedShowAllergies] = useState([]);

  // Define hideAllergies and showAllergies arrays
  const hideAllergies = ['Milk', 'Egg', 'Fish', 'Shellfish', 'Tree Nut', 'Peanut', 'Wheat', 'Soy', 'Gluten', 'Sesame', 'Alcohol'];
  const showAllergies = ['Egg', 'Fish', 'Gluten Friendly', 'Milk', 'Peanuts', 'Soy', 'Vegan', 'Vegetarian', 'Pork', 'Beef', 'Halal', 'Shellfish', 'Tree Nut', 'Alcohol', 'Sesame'];

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
    console.log('Hide Allergies:', selectedHideAllergies);
    console.log('Show Allergies:', selectedShowAllergies);
    window.location.href = "global_search";
  };

  const handleCheckboxChange = (allergy, type) => {
    if (type === 'hide') {
      if (selectedHideAllergies.includes(allergy)) {
        setSelectedHideAllergies(selectedHideAllergies.filter(item => item !== allergy));
      } else {
        setSelectedHideAllergies([...selectedHideAllergies, allergy]);
      }
    } else {
      if (selectedShowAllergies.includes(allergy)) {
        setSelectedShowAllergies(selectedShowAllergies.filter(item => item !== allergy));
      } else {
        setSelectedShowAllergies([...selectedShowAllergies, allergy]);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <h2>Hide items that contain:</h2>
        <div>
          {hideAllergies.map((allergy, index) => (
            <div key={index} className={styles.checkbox}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedHideAllergies.includes(allergy)}
                  onChange={() => handleCheckboxChange(allergy, 'hide')}
                />
                {allergy}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.column}>
        <h2>Show items that match:</h2>
        <div>
          {showAllergies.map((allergy, index) => (
            <div key={index} className={styles.checkbox}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedShowAllergies.includes(allergy)}
                  onChange={() => handleCheckboxChange(allergy, 'show')}
                />
                {allergy}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4 space-x-4">
        <button className={styles.submitButton} onClick={handleCancel}>Cancel</button>
        <button className={styles.submitButton} onClick={handleReset}>Reset</button>
        <button className={styles.submitButton} onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
};

export default AllergyFilterPage;
