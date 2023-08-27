import React, { useState } from "react";
import styles from "./Filter.module.css";
import RadioButton from "../RadioButton/RadioButton";

const Filter = () => {
  const filterOptions = ["All", "Done", "Pending"];
  return (
    <>
      <div className={styles.outer}>
        <div className={styles.inner}>
          <h2>Filter</h2>
          {filterOptions.map((option, index) => (
            <RadioButton key={index} label={option} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Filter;
