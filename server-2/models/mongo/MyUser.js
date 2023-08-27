/**
 * User model
 * */
const bcrypt = require("bcryptjs");
const MongoDbModel = require("../../bootloader/mongo");
// For Number types better reading
const Float = Number;
const Int = Number;

class MyUser extends MongoDbModel {
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
        email: String,
        password: String,
        tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
        invited_users: [
          { type: mongoose.Schema.Types.ObjectId, ref: "InvitedUser" },
        ],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      });

      schema.pre("save", async function (next) {
        const user = this;
        if (user.isModified("password") || user.isNew) {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(user.password, salt);
          user.password = hash;
        }
        next();
      });

      schema.methods.comparePassword = async function (password) {
        return await bcrypt.compare(password, this.password);
      };

      return schema;
    };
  }

  static get Indexes() {
    return [];
  }
}

exports = module.exports = MyUser;
