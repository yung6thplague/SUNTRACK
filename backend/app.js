const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const installationController = require('./controllers/installationController');
const {ensureTech} = require('./controllers/authController');
const app = express();
app.use(cors());
app.use(express.json());

// conectar na db
mongoose.connect("mongodb+srv://admin:admin@suntrack.b8p1vki.mongodb.net/")
    .then(() => console.log("MongoDB ON"))
    .catch(err => console.error("Erro ao ligar ao MongoDB: ", err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/installations", require("./routes/routeInstallation"));
app.get('/tech/installations', ensureTech, installationController.listInstallations);
const PORT = 3000;
app.listen(PORT, () => console.log("Server ON"));