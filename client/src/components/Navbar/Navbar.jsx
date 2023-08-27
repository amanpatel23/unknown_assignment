import React, { useContext } from "react";
import { userContext } from "../../contexts/userContext";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, logOutHandler } = useContext(userContext);

  const navigate = useNavigate();

  const onLogOutButtonClick = () => {
    logOutHandler();
    navigate('/signin')
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.logo}>
          {/* Replace with your logo image */}
          <h2 className={styles.logo_text}>UnknownApp</h2>
        </div>
        {!user ? (
          <div className={styles.links}>
            <Link className={styles.link} to="/signin">
              Sign In
            </Link>
            <Link className={styles.link} to="/signup">
              Sign Up
            </Link>
          </div>
        ) : (
          <div className={styles.links}>
            <Link className={styles.link} to="/dashboard">
              Dashboard
            </Link>
            <button onClick={onLogOutButtonClick} className={[styles.link, styles.logout_btn].join(" ")}>
              LogOut
            </button>
          </div>
        )}
      </div>

      <Outlet />
    </>
  );
};

export default Navbar;
