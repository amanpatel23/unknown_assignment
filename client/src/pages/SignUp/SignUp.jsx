import React, { useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userContext } from "../../contexts/userContext";
import styles from "./SignUp.module.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const { createNewUserHandler } = useContext(userContext);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords Don\'t Match");
      clearInput();
      return;
    }
    try {
      const response = await createNewUserHandler(email, password);
      toast.success(response.data.message);
      navigate('/signin');
    } catch (error) {
      toast.error(error.response.data.error);
    }
    clearInput();
  }

  const clearInput = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <div className={styles.signInContainer}>
      <h2>Sign Up</h2>
      <form onSubmit={onSubmitHandler} className={styles.signInForm}>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            className={styles.input_field}
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            className={styles.input_field}
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Confirm Password</label>
          <input
            className={styles.input_field}
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Sign Up
        </button>
      </form>
      <p className={styles.signupLink}>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUp;
