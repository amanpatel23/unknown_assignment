import React, { useContext } from "react";
import styles from "./InvitedUserCard.module.css";
import { userContext } from "../../contexts/userContext";
import { toast } from "react-toastify";

const InvitedUserCard = ({ id, email, status }) => {
  const { removeInvitedUserHandler, setInvitedUsers } = useContext(userContext);

  const clickedOnRemoveBtn = async (id) => {
    try {
      const response = await removeInvitedUserHandler(id);
      setInvitedUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== id)
      );

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <p className={styles.email}>{email}</p>
        <p className={styles.status}>status: {status}</p>
      </div>
      <div className={styles.cardButtons}>
        <button
          className={styles.removeButton}
          onClick={() => clickedOnRemoveBtn(id)}
        >
          Remove
        </button>
        {status === "PENDING" && (
          <button className={styles.testButton}>Resend</button>
        )}
      </div>
    </div>
  );
};

export default InvitedUserCard;
