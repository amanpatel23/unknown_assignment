import React, { useState, useContext, useEffect } from "react";
import { userContext } from "../../contexts/userContext";
import styles from "./CreateTaskForm.module.css";
import { toast } from "react-toastify";

const CreateTaskForm = () => {
  const [taskDesc, setTaskDesc] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [assignTask, setAssignTask] = useState("");

  const {
    user,
    addTaskHandler,
    setTasks,
    editTask,
    setEditTask,
    formatDate,
    updateTaskHandler,
    setShowCreateTaskForm,
    sendAssignedTaskEmailHandler,
    invitedUsers,
    selectedOption,
    setSelectedOption,
  } = useContext(userContext);

  const selectDropdownOption = (e) => {
    setSelectedOption(e.target.value);
  };

  useEffect(() => {
    if (editTask) {
      setTaskDesc(editTask.taskDesc);
      setSelectedDate(editTask.dueDate);
      setAssignTask(editTask.assignedTo);
    } else {
      clearInput();
    }
  }, [editTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!editTask) {
        const response = await addTaskHandler(
          taskDesc,
          selectedDate,
          selectedOption
        );
        let new_task = response.data.created_task_info;
        new_task = { ...new_task, dueDate: formatDate(new_task.dueDate) };
        setTasks((prevTasks) => [new_task, ...prevTasks]);
        toast.success(response.data.message);

        const email_resposne = await sendAssignedTaskEmailHandler(
          selectedOption
        );
        toast.success(email_resposne.data.message);
      } else {
        const updatedTask = {
          id: editTask.id,
          taskDesc,
          dueDate: selectedDate,
          assignedTo: selectedOption,
        };
        const response = await updateTaskHandler(updatedTask);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editTask.id ? { ...task, ...updatedTask } : task
          )
        );
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }

    clearInput();
    setEditTask(null);
    setShowCreateTaskForm(false);
  };

  const clearInput = () => {
    setTaskDesc("");
    setSelectedDate("");
    setAssignTask("");
  };

  return (
    <div className={styles.formContainer}>
      <h2>{editTask ? "Update Task" : "Create Task"}</h2>
      <form onSubmit={handleSubmit} className={styles.taskForm}>
        <div className={styles.formGroup}>
          <label htmlFor="task-desc">Task Description</label>
          <input
            required
            type="text"
            id="task-desc"
            name="task-desc"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="date">Date</label>
          <input
            required
            type="date"
            id="date"
            name="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          {/* <label htmlFor="assign-task">Assign Task</label>
          <input
            required
            type="email"
            id="assign-task"
            name="assign-task"
            placeholder="Enter email of the user"
            value={assignTask}
            onChange={(e) => setAssignTask(e.target.value)}
          /> */}
          <label>Assign Task</label>
          <select
            className={styles.dropdown}
            value={selectedOption}
            onChange={selectDropdownOption}
          >
            <option value={user.email}>{user.email}</option>
            {invitedUsers.map((user) => (
              <option key={user.id} value={user.email}>
                {user.email}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={styles.submitButton}>
          {editTask ? "Update Task" : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default CreateTaskForm;
