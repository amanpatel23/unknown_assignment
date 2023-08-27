import React, { useContext } from "react";
import { userContext } from "../../contexts/userContext";
import CreateTaskForm from "../../components/CreateTaskForm/CreateTaskForm";
import TaskTable from "../../components/TaskTable/TaskTable";
import styles from "./Dashboard.module.css";
import Filter from "../../components/Filter/Filter";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { showCreateTaskForm, setShowCreateTaskForm, setEditTask } =
    useContext(userContext);

  const navigate = useNavigate();

  const clickedOnAddTaskBtn = () => {
    setEditTask(null);
    setShowCreateTaskForm(!showCreateTaskForm);
  };

  const clickedOnInviteButton = () => {
    navigate("/inviteUser");
  };

  return (
    <>
      <div className={styles.outer}>
        <div className={styles.inner}>
          <div className={styles.form_container}>
            {showCreateTaskForm && <CreateTaskForm />}
            <div className={styles.btn_grp}>
              <button
                onClick={clickedOnAddTaskBtn}
                className={[styles.addTask_btn, styles.action_btn].join(" ")}
              >
                {showCreateTaskForm ? "Close Form" : "Create Task"}
              </button>
              <button
                onClick={clickedOnInviteButton}
                className={[
                  [styles.inviteUser_btn, styles.action_btn].join(" "),
                ]}
              >
                Invite users
              </button>
            </div>
          </div>
          <div className={styles.filter_block}>
            <Filter />
          </div>
          <div className={styles.tastTable_container}>
            <TaskTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
