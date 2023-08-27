import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../contexts/userContext";
import { toast } from "react-toastify";
import styles from "./SignIn.module.css";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { userLoginHandler, setUser } = useContext(userContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await userLoginHandler(email, password);
      setUser(response.data.user_info);
      toast.success(response.data.message);

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response.data.error);
    }
    clearInput();
  };

  const clearInput = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <div className={styles.signInContainer}>
      <h2>Sign In</h2>
      <form onSubmit={submitHandler} className={styles.signInForm}>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            className={styles.input_field}
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Sign In
        </button>
      </form>
      <p className={styles.signupLink}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default SignIn;
