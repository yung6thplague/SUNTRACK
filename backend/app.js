const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors({
  origin: function (origin, callback) {
    if (origin === "http://127.0.0.1:5500" || origin === null || origin === undefined) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());


mongoose.connect("mongodb+srv://admin:admin@suntrack.b8p1vki.mongodb.net/")
  .then(() => {
    console.log("MONGODB ON");
    app.listen(3000, () => console.log("SERVER ON"));
  })
  .catch((err) => {
    console.error(" Erro ao ligar ao MongoDB:", err);
    process.exit(1); 
  });


const monitorizacaoRoutes = require('./routes/monitorizacao');
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes); 
app.use("/api/installations", require("./routes/installation"));
app.use("/api/monitorizacao", monitorizacaoRoutes);
app.use("/api/leituras", require("./routes/leituras"));

