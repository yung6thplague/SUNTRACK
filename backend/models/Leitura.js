const mongoose = require("mongoose");

const LeituraSchema = new mongoose.Schema({
  userId: String,
  producao: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Leitura", LeituraSchema);
