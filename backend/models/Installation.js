const mongoose = require("mongoose");

const installationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  installDate: { type: Date, required: true },
  address: { type: String, required: true },
  panelCount: { type: Number, required: true },
  capacityKw: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Installation", installationSchema);
