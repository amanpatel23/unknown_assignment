/**
 * User model
 * */
const MongoDbModel = require("../../bootloader/mongo");
// For Number types better reading
const Float = Number;
const Int = Number;

class InvitedUser extends MongoDbModel {
  /*Define which database to connect to*/
  static get connection() {
    return this.APP_DB;
  }

  /* Needed functions by the MongoDbModel Interface */
  static get Name() {
    return this.name;
  }

  static get Schema() {
    const enumStatusValues = ["PENDING", "ACCEPTED"];
    return (mongoose) => {
      const schema = new mongoose.Schema({
        email: String,
        invitation_token: String,
        status: {
          type: String,
          enum: enumStatusValues,
          default: "PENDING",
        },
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

exports = module.exports = InvitedUser;
