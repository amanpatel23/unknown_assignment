import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const userContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [selectedFilterOption, setSelectedFilterOption] = useState("All");
  const [filteredTasks, setFilteredTasks] = useState(null);
  const [invitedUsers, setInvitedUsers] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const createNewUserHandler = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:3000/signUp", {
        email,
        password,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const userLoginHandler = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/signIn",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logOutHandler = () => {
    const response = axios.get("http://localhost:3000/logOut", {
      withCredentials: true,
    });
    setUser(null);
  };

  const addTaskHandler = async (taskDesc, dueDate, assignedTo) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/addTask",
        {
          taskDesc,
          dueDate,
          assignedTo,
        },
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateTaskStatusHandler = async (taskId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/updateTaskStatus",
        {
          taskId,
        },
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const deleteTaskHandler = async (taskId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/deleteTask",
        {
          taskId,
        },
        {
          withCredentials: true,
        }
      );

      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateTaskHandler = async (updatedTask) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/updateTask",
        {
          updatedTask,
        },
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const sendAssignedTaskEmailHandler = async (recieverEmail) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/sendAssignedTaskEmail",
        {
          recieverEmail,
        },
        {
          withCredentials: true,
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  };

  const changeFilterHandler = (label) => {
    if (selectedFilterOption === label) return;
    setSelectedFilterOption(label);
  };

  const sendInvitationEmailHandler = async (recieverEmail) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/sendInvitationEmail",
        {
          recieverEmail,
        },
        {
          withCredentials: true,
        }
      );

      return response;
    } catch (error) {
      throw error;
    }
  };

  const removeInvitedUserHandler = async (id) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/removeInvitedUser",
        { id },
        {
          withCredentials: true,
        }
      );

      return response;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    async function getLoggedInUser() {
      try {
        const response = await axios.get(
          "http://localhost:3000/getLoggedInUser",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user_info);
      } catch (error) {
        console.log(error);
      }
    }

    getLoggedInUser();
  }, []);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await axios.get("http://localhost:3000/getTasks", {
          withCredentials: true,
        });
        const tasks = response.data.tasks_arr.map((task) => ({
          ...task,
          dueDate: formatDate(task.dueDate),
        }));
        setTasks(tasks);

        const invitedUsers_response = await axios.get(
          "http://localhost:3000/getInvitedUsers",
          {
            withCredentials: true,
          }
        );
        setInvitedUsers(invitedUsers_response.data.invitedUsersInfo);
      } catch (error) {
        console.log(error);
      }
    }

    if (user) {
      setSelectedOption(user.email);
      fetchTasks();
    }
  }, [user]);

  useEffect(() => {
    if (tasks) {
      if (selectedFilterOption === "All") {
        setFilteredTasks(tasks);
      } else if (selectedFilterOption === "Done") {
        const filtered = tasks.filter((task) => task.completed);
        setFilteredTasks(filtered);
      } else {
        const filtered = tasks.filter((task) => !task.completed);
        setFilteredTasks(filtered);
      }
    }
  }, [selectedFilterOption, tasks]);

  return (
    <userContext.Provider
      value={{
        createNewUserHandler,
        userLoginHandler,
        user,
        setUser,
        logOutHandler,
        addTaskHandler,
        tasks,
        setTasks,
        updateTaskStatusHandler,
        deleteTaskHandler,
        showCreateTaskForm,
        setShowCreateTaskForm,
        editTask,
        setEditTask,
        formatDate,
        updateTaskHandler,
        sendAssignedTaskEmailHandler,
        selectedFilterOption,
        setSelectedFilterOption,
        changeFilterHandler,
        filteredTasks,
        sendInvitationEmailHandler,
        invitedUsers,
        setInvitedUsers,
        removeInvitedUserHandler,
        selectedOption,
        setSelectedOption,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
export { userContext };
