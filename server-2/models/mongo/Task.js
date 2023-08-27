/**
 * User model
 * */
const MongoDbModel = require("../../bootloader/mongo");
// For Number types better reading
const Float = Number;
const Int = Number;

class Task extends MongoDbModel {
  /*Define which database to connect to*/
  static get connection() {
    return this.APP_DB;
  }

  /* Needed functions by the MongoDbModel Interface */
  static get Name() {
    return this.name;
  }

  static get Schema() {
    return (mongoose) => {
      const schema = new mongoose.Schema({
        taskDesc: String,
        dueDate: Date,
        assignedTo: String,
        completed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      });

      return schema;
    };
  }

  static get Indexes() {
    return [];
  }
}

exports = module.exports = Task;
