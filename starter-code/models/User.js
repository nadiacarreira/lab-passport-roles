const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
//hacemos un esquema mongoose con los campos que el usuario tiene que rellenar, incluido el rol
const userSchema = new Schema({
  username: String,
  name: String,
  familyName: String,
  password: String,
  role: {
    type: String,
    enum: ['Boss', 'TA', 'Developer','Student'],
 },
 facebookID: String,
}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
