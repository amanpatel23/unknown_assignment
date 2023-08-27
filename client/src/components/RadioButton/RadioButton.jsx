import React, { useContext } from "react";
import styles from "./RadioButton.module.css";
import { userContext } from "../../contexts/userContext";

export default function RadioButton({ label }) {
  const { selectedFilterOption, changeFilterHandler } = useContext(userContext);
  return (
    <div className={styles.container}>
      <label className={styles.radiobutton_option}>
        <input
          className={styles.radio_btn}
          type="radio"
          checked={selectedFilterOption === label}
          onChange={() => changeFilterHandler(label)}
        />
        {label}
      </label>
    </div>
  );
}
