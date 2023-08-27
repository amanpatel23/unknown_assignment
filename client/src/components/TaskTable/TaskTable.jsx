import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./TaskTable.module.css";
import { userContext } from "../../contexts/userContext";

const TaskTable = () => {
  const {
    user,
    tasks,
    filteredTasks,
    setTasks,
    updateTaskStatusHandler,
    deleteTaskHandler,
    setEditTask,
    setShowCreateTaskForm,
  } = useContext(userContext);

  const clickedOnCheckbox = async (taskId) => {
    try {
      const response = await updateTaskStatusHandler(taskId);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const clickedOnDeleteButton = async (taskId) => {
    try {
      const response = await deleteTaskHandler(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const clickedOnEditButton = (task) => {
    setEditTask(task);
    setShowCreateTaskForm(true);
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Task Desc</th>
          <th>Due Date</th>
          <th>Assigned To</th>
          <th>Completed</th>
        </tr>
      </thead>
      <tbody>
        {filteredTasks &&
          filteredTasks.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.taskDesc}</td>
              <td>{todo.dueDate}</td>
              <td>{todo.assignedTo}</td>
              <td>
                <input
                  className={styles.completed_checkbox}
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => clickedOnCheckbox(todo.id)}
                />
              </td>
              <td>
                <div className={styles.action_btns_grp}>
                  <button
                    onClick={() => clickedOnDeleteButton(todo.id)}
                    className={styles.delete_btn}
                  >
                    delete
                  </button>
                  <button
                    onClick={() => clickedOnEditButton(todo)}
                    className={styles.edit_btn}
                  >
                    edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default TaskTable;
