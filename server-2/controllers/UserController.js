const userService = require("../services/UserService");
exports = module.exports = class DemoController {
  constructor(router) {
    // config routes
    router.get("/test", this.test);
    router.post("/signUp", this.signUp);
    router.post("/signIn", this.signIn);
    router.get("/logOut", this.logOut);
    router.get("/getLoggedInUser", this.getLoggedInUser);
    router.post("/addTask", this.addTask);
    router.get("/getTasks", this.getTasks);
    router.post("/updateTaskStatus", this.updateTaskStatus);
    router.post("/deleteTask", this.deleteTask);
    router.post("/updateTask", this.updateTask);
    router.post("/sendAssignedTaskEmail", this.sendAssignedTaskEmail);
    router.post("/sendInvitationEmail", this.sendInvitationEmail);
    router.get("/acceptInvitation", this.acceptInvitation);
    router.get("/getInvitedUsers", this.getInvitedUsers);
    router.post("/removeInvitedUser", this.removeInvitedUser);
    log.info("Routed", this.constructor.name);
  }

  async test(request, response) {
    return response.status(200).json({ message: "hey" });
  }

  async signUp(request, response) {
    return userService.signUp(request, response);
  }

  async signIn(request, response) {
    return userService.signIn(request, response);
  }

  logOut(request, response) {
    return userService.logOut(request, response);
  }

  getLoggedInUser(request, response) {
    return userService.getLoggedInUser(request, response);
  }

  async addTask(request, response) {
    return userService.addTask(request, response);
  }

  async getTasks(request, response) {
    return userService.getTasks(request, response);
  }

  async updateTaskStatus(request, response) {
    return userService.updateTaskStatus(request, response);
  }

  async deleteTask(request, response) {
    return userService.deleteTask(request, response);
  }

  async updateTask(request, response) {
    return userService.updateTask(request, response);
  }

  async sendAssignedTaskEmail(request, response) {
    return userService.sendAssignedTaskEmail(request, response);
  }

  async sendInvitationEmail(request, response) {
    return userService.sendInvitationEmail(request, response);
  }

  async acceptInvitation(request, response) {
    return userService.acceptInvitation(request, response);
  }

  async getInvitedUsers(request, response) {
    return userService.getInvitedUsers(request, response);
  }

  async removeInvitedUser(request, response) {
    return userService.removeInvitedUser(request, response);
  }
};
