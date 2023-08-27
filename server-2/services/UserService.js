const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "postit.deleteit@gmail.com",
    pass: "sdiorblhvtuqtdqe",
  },
});

const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString("hex");
};

class UserService {
  static async signUp(request, response) {
    try {
      const User = await _db.MyUser;
      const { email, password } = request.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return response.status(409).json({ error: "Email Already Exists" });
      }

      const newUser = new User({ email, password });
      await newUser.save();

      response.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async signIn(request, response) {
    try {
      const User = _db.MyUser;
      const { email, password } = request.body;
      const user = await User.findOne({ email });
      if (!user) {
        return response.status(401).json({ error: "Email Is Not Registered" });
      }

      const didPasswordMatch = await user.comparePassword(password);
      if (!didPasswordMatch) {
        return response.status(401).json({ error: "Invalid Credentials" });
      }
      const loginCredentials = { _id: user._id, email: user.email };
      request.loginUser(loginCredentials);

      const user_info = { id: user._id, email: user.email };

      return response
        .status(200)
        .json({ message: "SignIn Successfull", user_info });
    } catch (error) {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static logOut(request, response) {
    request.logout();
    return response.status(200).json({ message: "LoggedOut Successfully" });
  }

  static async addTask(request, response) {
    const Task = _db.Task;
    const User = _db.MyUser;
    try {
      const userId = request.user._id;
      const task_info = request.body;

      const task_created = await Task.create(task_info);
      const user = await User.findById(userId);
      user.tasks.push(task_created);
      await user.save();

      const created_task_info = {
        id: task_created._id,
        taskDesc: task_created.taskDesc,
        dueDate: task_created.dueDate,
        assignedTo: task_created.assignedTo,
        completed: task_created.completed,
      };
      return response
        .status(200)
        .json({ message: "Todo Added Successfully", created_task_info });
    } catch (error) {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static getLoggedInUser(request, response) {
    if (request.user) {
      const user_info = { id: request.user._id, email: request.user.email };
      return response.json({ user_info });
    } else {
      return response.json({ user_info: null });
    }
  }

  static async getTasks(request, response) {
    const User = _db.MyUser;
    try {
      const userId = request.user._id;
      const user = await User.findById(userId).populate("tasks");

      const sortedTasks = await user.tasks.sort(
        (a, b) => b.createdAt - a.createdAt
      );
      const tasks_arr = sortedTasks.map((task) => ({
        id: task._id,
        taskDesc: task.taskDesc,
        dueDate: task.dueDate,
        assignedTo: task.assignedTo,
        completed: task.completed,
      }));
      return response.status(200).json({ tasks_arr });
    } catch (error) {
      return response.status(500).json({ error: "Failed To Fetch Todos" });
    }
  }

  static async updateTaskStatus(request, response) {
    const Task = _db.Task;
    try {
      const taskId = request.body.taskId;

      const task = await Task.findById(taskId);
      task.completed = !task.completed;
      await task.save();

      return response
        .status(200)
        .json({ message: "Task Status Updated Successfully" });
    } catch (error) {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteTask(request, response) {
    const User = _db.MyUser;
    const Task = _db.Task;
    try {
      const taskId = request.body.taskId;
      const userId = request.user._id;

      const user = await User.findById(userId).populate("tasks");
      const taskIndex = await user.tasks.findIndex(
        (task) => task._id.toString() === taskId
      );
      user.tasks.splice(taskIndex, 1);
      await user.save();

      await Task.findByIdAndDelete(taskId);

      return response
        .status(200)
        .json({ message: "Task Deleted Successfully" });
    } catch (error) {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateTask(request, response) {
    const Task = _db.Task;
    try {
      const { updatedTask } = request.body;

      const task = await Task.findById(updatedTask.id);
      task.taskDesc = updatedTask.taskDesc;
      task.dueDate = updatedTask.dueDate;
      task.assignedTo = updatedTask.assignedTo;
      await task.save();

      return response
        .status(200)
        .json({ message: "Task Updated Successfully" });
    } catch (error) {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async sendAssignedTaskEmail(request, response) {
    const { recieverEmail } = request.body;

    const mailOptions = {
      from: "postit.deleteit@gmail.com",
      to: recieverEmail,
      subject: "Task Assignment",
      html: `<p>You just got assigned a new task by <strong>${request.user.email}</strong></p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return response
          .status(500)
          .json({ error: "Error In Sending The Notification" });
      } else {
        return response
          .status(200)
          .json({ message: "Notification Was Sent To The Email", info });
      }
    });
  }

  static async sendInvitationEmail(request, response) {
    const InvitedUser = _db.InvitedUser;
    const User = _db.MyUser;
    try {
      const userId = request.user._id;
      const { recieverEmail } = request.body;
      const user = await User.findById(userId).populate("invited_users");

      const invitedUsersList = await user.invited_users;
      const alreadyInvited = invitedUsersList.find(
        (user) => user.email === recieverEmail
      );

      if (alreadyInvited && alreadyInvited.status === "ACCEPTED") {
        return response
          .status(401)
          .json({ error: "User Is Already Registered" });
      }

      const invitation_token = generateRandomString(50);

      const link = `http://localhost:3000/acceptInvitation?userId=${userId}&invitation_token=${invitation_token}`;

      const mailOptions = {
        from: "postit.deleteit@gmail.com",
        to: recieverEmail,
        subject: "Invitation Link | UnknownApp",
        html: `<p>You have been invited by ${user.email}. <br> Click on this <a href=${link}><strong>Link</strong></a> to accept the invitation.</p>`,
      };

      transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
          return response
            .status(500)
            .json({ error: "Couldn't Send The Invitation Link" });
        }

        let invitedUserId;
        if (!alreadyInvited) {
          const curr_invitedUser = InvitedUser({
            email: recieverEmail,
            invitation_token,
          });
          await curr_invitedUser.save();
          invitedUserId = curr_invitedUser._id;

          user.invited_users.push(curr_invitedUser);
          await user.save();
        } else {
          invitedUserId = alreadyInvited._id;
          alreadyInvited.invitation_token = invitation_token;
          await alreadyInvited.save();
        }

        return response.status(200).json({
          message: "Invitation Link Send Successfully",
          new_invitation: {
            id: invitedUserId,
            email: recieverEmail,
            status: "PENDING",
            flag: alreadyInvited === undefined
          },
        });
      });
    } catch (error) {
      return response.status(500).json({
        error: "Internal Server Error",
      });
    }
  }

  static async acceptInvitation(request, response) {
    const User = _db.MyUser;
    try {
      const { userId, invitation_token } = request.query;

      const user = await User.findById(userId).populate("invited_users");
      const invitedUsersList = user.invited_users;
      const invitedUser = invitedUsersList.find(
        (user) => user.invitation_token === invitation_token
      );

      if (!invitedUser) {
        return response.send(
          "<h2>Sorry, but this link is either expired or invalid.</h2>"
        );
      }

      if (invitedUser.status === "ACCEPTED") {
        return response.send(
          "<h2>Hey Bro, You have already accepted the invitation.</h2>"
        );
      }

      invitedUser.status = "ACCEPTED";
      await invitedUser.save();
      return response.send("<h2>Yayyy! You have accepted the invitation.</h2>");
    } catch (error) {
      return response.send("<p>error</p>");
    }
  }

  static async getInvitedUsers(request, response) {
    const User = _db.MyUser;
    try {
      const userId = request.user._id;
      const user = await User.findById(userId).populate("invited_users");
      const invitedUsersList = user.invited_users;

      const required_info = invitedUsersList.map((user) => ({
        id: user._id,
        email: user.email,
        status: user.status,
      }));

      return response.status(200).json({ invitedUsersInfo: required_info });
    } catch (error) {
      return response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async removeInvitedUser(request, response) {
    const User = _db.MyUser;
    const InvitedUser = _db.InvitedUser;
    try {
      const userId = request.user._id;

      const invitedUserId = request.body.id;
      const user = await User.findById(userId).populate("invited_users");
      const invitedUsersList = user.invited_users;
      const index = invitedUsersList.findIndex(
        (user) => user._id.toString() === invitedUserId
      );
      invitedUsersList.splice(index, 1);
      await user.save();

      await InvitedUser.findByIdAndDelete(invitedUserId);

      return response.status(200).json({ message: "User Removed Succesfully" });
    } catch (error) {
      return response.status(500).json({ message: "Internal Server Error" });
    }
  }
}

exports = module.exports = UserService;
