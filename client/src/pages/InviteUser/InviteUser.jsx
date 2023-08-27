import React, { useState, useContext } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import styles from "./InviteUser.module.css";
import { userContext } from "../../contexts/userContext";
import InvitedUserCard from "../../components/InvitedUserCard/InvitedUserCard";

const InviteUser = () => {
  const [email, setEmail] = useState("");

  const { sendInvitationEmailHandler, invitedUsers, setInvitedUsers } =
    useContext(userContext);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await sendInvitationEmailHandler(email);
      if (response.data.new_invitation.flag) {
        setInvitedUsers((prevInvited) => [
          ...prevInvited,
          response.data.new_invitation,
        ]);
      }
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }

    clearInput();
  };

  const clearInput = () => {
    setEmail("");
  };

  return (
    <div className={styles.outer}>
      <form onSubmit={submitForm} className={styles.container}>
        <h2>Invite User</h2>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button type="submit">Send Invitation</button>
      </form>

      <div className={styles.invited_users}>
        <h2 className={styles.invited_users_text}>Invited Users</h2>
        {invitedUsers &&
          invitedUsers.map((user) => (
            <InvitedUserCard
              key={user.id}
              id={user.id}
              email={user.email}
              status={user.status}
            />
          ))}
      </div>
    </div>
  );
};

export default InviteUser;
