const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "tech", 'gestor'], default: "user" }
}, {
  versionKey: false,       
  timestamps: {            
    createdAt: true,
    updatedAt: false
  },
  toJSON: {
    transform(doc, ret) {
      delete ret.password;  
      return ret;
    }
  }
});


module.exports = mongoose.model("User", userSchema);




